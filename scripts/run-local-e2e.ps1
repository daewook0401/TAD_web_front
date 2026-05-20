param(
  [string]$BackendDir = "..\TAD_web_back",
  [string]$FrontendUrl = "http://127.0.0.1:5173",
  [string]$ApiBaseUrl = "http://127.0.0.1:8080/api",
  [string]$DatabaseUrl = "",
  [string]$RedisUrl = ""
)

$ErrorActionPreference = "Stop"

$RootDir = Resolve-Path (Join-Path $PSScriptRoot "..")
$BackendPath = Resolve-Path (Join-Path $RootDir $BackendDir)
$BackendLocalConfig = Join-Path $BackendPath "src\main\resources\application-local.yml"
$LogDir = Join-Path $RootDir ".local-e2e"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Get-LocalYamlValue {
  param(
    [string]$Path
  )

  $targetParts = $Path.Split(".")
  $stack = @{}

  foreach ($line in Get-Content -Encoding UTF8 $BackendLocalConfig) {
    if ($line.Trim().Length -eq 0 -or $line.TrimStart().StartsWith("#")) {
      continue
    }

    if ($line -match '^(\s*)([^:#]+):\s*(.*)$') {
      $indent = $Matches[1].Length
      $level = [int][Math]::Floor($indent / 2)
      $key = $Matches[2].Trim()
      $value = $Matches[3].Trim()

      $stack[$level] = $key
      foreach ($existingLevel in @($stack.Keys)) {
        if ($existingLevel -gt $level) {
          $stack.Remove($existingLevel)
        }
      }

      $currentPath = (0..$level | ForEach-Object { $stack[[int]$_] }) -join "."
      if ($currentPath -eq $Path -and $value.Length -gt 0) {
        return $value.Trim("'").Trim('"')
      }
    }
  }

  return $null
}

function Convert-JdbcPostgresToDatabaseUrl {
  param(
    [string]$JdbcUrl,
    [string]$Username,
    [string]$Password
  )

  if ($JdbcUrl -notmatch '^jdbc:postgresql://([^/:]+)(?::(\d+))?/([^?]+)') {
    throw "Unsupported PostgreSQL JDBC URL: $JdbcUrl"
  }

  $hostName = $Matches[1]
  $port = if ($Matches[2]) { $Matches[2] } else { "5432" }
  $database = $Matches[3]
  $encodedUser = [System.Uri]::EscapeDataString($Username)
  $encodedPassword = [System.Uri]::EscapeDataString($Password)
  return "postgres://${encodedUser}:${encodedPassword}@${hostName}:${port}/${database}"
}

function Wait-HttpOk {
  param(
    [string]$Url,
    [string]$Name,
    [int]$TimeoutSeconds = 90
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 3
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
        return
      }
    } catch {
      $statusCode = $null
      if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
        $statusCode = [int]$_.Exception.Response.StatusCode
      }

      if ($statusCode -and $statusCode -ge 200 -and $statusCode -lt 500) {
        return
      }

      Start-Sleep -Seconds 2
    }
  }

  throw "$Name did not become ready at $Url within ${TimeoutSeconds}s."
}

function Stop-ProcessById {
  param(
    [int]$TargetProcessId
  )

  $process = Get-Process -Id $TargetProcessId -ErrorAction SilentlyContinue
  if (-not $process) {
    return
  }

  Stop-Process -Id $TargetProcessId -Force -ErrorAction SilentlyContinue
  try {
    [void]$process.WaitForExit(5000)
  } catch {
  }
}

function Stop-ProcessTree {
  param(
    [int]$TargetProcessId
  )

  $children = Get-CimInstance Win32_Process -Filter "ParentProcessId = $TargetProcessId" -ErrorAction SilentlyContinue
  foreach ($child in $children) {
    Stop-ProcessTree -TargetProcessId $child.ProcessId
  }

  Stop-ProcessById -TargetProcessId $TargetProcessId
}

function Stop-WorkspaceListeners {
  param(
    [int[]]$Ports,
    [switch]$NoThrow
  )

  $workspaceMarkers = @([string]$RootDir, [string]$BackendPath)

  foreach ($port in $Ports) {
    $listeners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
      Select-Object -ExpandProperty OwningProcess -Unique

    foreach ($ownerProcessId in $listeners) {
      $process = Get-CimInstance Win32_Process -Filter "ProcessId = $ownerProcessId" -ErrorAction SilentlyContinue
      if (-not $process) {
        continue
      }

      $commandLine = [string]$process.CommandLine
      $isWorkspaceProcess = $false
      foreach ($marker in $workspaceMarkers) {
        if ($commandLine.Contains($marker)) {
          $isWorkspaceProcess = $true
          break
        }
      }

      if ($isWorkspaceProcess) {
        Stop-ProcessById -TargetProcessId $ownerProcessId
        Start-Sleep -Milliseconds 500
      } elseif (-not $NoThrow) {
        throw "Port $port is already in use by PID $ownerProcessId. Stop it or pass a different -FrontendUrl/-ApiBaseUrl."
      }
    }
  }
}

$backendPort = ([System.Uri]$ApiBaseUrl).Port
$frontendPort = ([System.Uri]$FrontendUrl).Port
$backendProcess = $null
$frontendProcess = $null

try {
  Stop-WorkspaceListeners -Ports @($backendPort, $frontendPort)

  $env:SPRING_PROFILES_ACTIVE = "local"
  $env:SERVER_PORT = "$backendPort"
  $env:FRONTEND_URL = $FrontendUrl
  $env:API_BASE_URL = $ApiBaseUrl
  $env:VITE_API_BASE_URL = $ApiBaseUrl
  $env:APP_CORS_ALLOWED_ORIGIN_PATTERNS = "https://towardadiamond.com,https://www.towardadiamond.com,http://localhost:5173,http://localhost:3000,$FrontendUrl"

  if ($DatabaseUrl) {
    $uri = [System.Uri]$DatabaseUrl
    $env:DATABASE_URL = $DatabaseUrl
    $env:SPRING_DATASOURCE_URL = "jdbc:postgresql://$($uri.Host):$($uri.Port)$($uri.AbsolutePath)"
    $userInfo = $uri.UserInfo.Split(":", 2)
    if ($userInfo.Length -ge 1) { $env:SPRING_DATASOURCE_USERNAME = [System.Uri]::UnescapeDataString($userInfo[0]) }
    if ($userInfo.Length -ge 2) { $env:SPRING_DATASOURCE_PASSWORD = [System.Uri]::UnescapeDataString($userInfo[1]) }
  } else {
    $jdbcUrl = Get-LocalYamlValue "spring.datasource.url"
    $dbUser = Get-LocalYamlValue "spring.datasource.username"
    $dbPassword = Get-LocalYamlValue "spring.datasource.password"
    $env:DATABASE_URL = Convert-JdbcPostgresToDatabaseUrl -JdbcUrl $jdbcUrl -Username $dbUser -Password $dbPassword
  }

  if ($RedisUrl) {
    $redisUri = [System.Uri]$RedisUrl
    $env:REDIS_URL = $RedisUrl
    $env:SPRING_DATA_REDIS_HOST = $redisUri.Host
    $env:SPRING_DATA_REDIS_PORT = "$($redisUri.Port)"
    if ($redisUri.UserInfo -match ":(.+)$") {
      $env:SPRING_DATA_REDIS_PASSWORD = [System.Uri]::UnescapeDataString($Matches[1])
    }
  } else {
    $redisHost = Get-LocalYamlValue "spring.data.redis.host"
    $redisPort = Get-LocalYamlValue "spring.data.redis.port"
    $redisPassword = Get-LocalYamlValue "spring.data.redis.password"
    if ($redisPassword) {
      $encodedRedisPassword = [System.Uri]::EscapeDataString($redisPassword)
      $env:REDIS_URL = "redis://:${encodedRedisPassword}@${redisHost}:${redisPort}"
    } else {
      $env:REDIS_URL = "redis://${redisHost}:${redisPort}"
    }
  }

  $backendProcess = Start-Process `
    -FilePath (Join-Path $BackendPath "gradlew.bat") `
    -ArgumentList "--no-daemon", "bootRun" `
    -WorkingDirectory $BackendPath `
    -RedirectStandardOutput (Join-Path $LogDir "backend.log") `
    -RedirectStandardError (Join-Path $LogDir "backend.err.log") `
    -WindowStyle Hidden `
    -PassThru

  Wait-HttpOk -Url "$ApiBaseUrl/actuator/health" -Name "Backend"

  $frontendProcess = Start-Process `
    -FilePath (Get-Command npm.cmd).Source `
    -ArgumentList "run", "dev", "--", "--host", "127.0.0.1", "--port", "$frontendPort", "--strictPort" `
    -WorkingDirectory $RootDir `
    -RedirectStandardOutput (Join-Path $LogDir "frontend.log") `
    -RedirectStandardError (Join-Path $LogDir "frontend.err.log") `
    -WindowStyle Hidden `
    -PassThru

  Wait-HttpOk -Url "$FrontendUrl/login" -Name "Frontend"

  $npmCommand = (Get-Command npm.cmd).Source
  & $npmCommand run test:local:e2e
  if ($LASTEXITCODE -ne 0) {
    throw "Local E2E failed with exit code $LASTEXITCODE."
  }
} finally {
  Stop-WorkspaceListeners -Ports @($backendPort, $frontendPort) -NoThrow
  if ($frontendProcess) {
    Stop-ProcessTree -TargetProcessId $frontendProcess.Id
  }
  if ($backendProcess) {
    Stop-ProcessTree -TargetProcessId $backendProcess.Id
  }
  Stop-WorkspaceListeners -Ports @($backendPort, $frontendPort) -NoThrow
}
