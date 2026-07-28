export const getCookieOptions = (rememberMe = false) => ({
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: rememberMe
    ? 1000 * 60 * 60 * 24 * 30
    : 1000 * 60 * 60 * 24,
});