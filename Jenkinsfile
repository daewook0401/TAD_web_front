pipeline {
    agent any

    // ✅ 환경변수는 여기에!
    environment {
        NVM_DIR      = "$HOME/.nvm"
        DEPLOY_FRONT = "/home/daewook/server/tad/deploy/front"
        FRONT_DIR    = "front"   // 레포 안에서 프론트 소스 폴더
        BUILD_DIR    = "dist"    // npm run build 결과 폴더
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node (nvm)') {
            steps {
                sh """
                . $NVM_DIR/nvm.sh

                nvm install 22
                nvm use 22

                echo "Node version:"
                node -v
                echo "npm version:"
                npm -v
                """
            }
        }

        stage('Install & Build') {
            when {
                branch 'main'
            }
            steps {
                sh """
                . $NVM_DIR/nvm.sh
                nvm use 22

                cd ${FRONT_DIR}
                npm ci
                npm run build
                """
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh """
                # 배포 폴더 생성 및 초기화
                mkdir -p ${DEPLOY_FRONT}
                rm -rf ${DEPLOY_FRONT}/*

                # dist 안의 파일들을 통째로 배포 경로에 복사
                cp -r ${FRONT_DIR}/${BUILD_DIR}/* ${DEPLOY_FRONT}/

                # nginx에서 읽을 수 있도록 권한 부여
                chmod -R o+rx ${DEPLOY_FRONT}
                """
            }
        }
    }
}
