export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    // exp is in seconds → convert to milliseconds
    const expiryTime = payload.exp * 1000;

    return Date.now() > expiryTime;
  } catch {
    return true; // if token is malformed → treat as expired
  }
}