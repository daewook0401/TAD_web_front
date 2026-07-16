export const toDrivePublicUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    return value;
  }

  try {
    const url = new URL(value);
    if (url.pathname === '/tad' || url.pathname.startsWith('/tad/')) {
      url.pathname = `/public${url.pathname}`;
    }
    return url.toString();
  } catch {
    return value;
  }
};
