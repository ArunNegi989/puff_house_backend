export const getCookieOptions = (rememberMe = false) => ({
  httpOnly: true,

  secure: process.env.NODE_ENV === "production",

  sameSite: "lax",

  path: "/",

  maxAge: rememberMe
    ? 1000 * 60 * 60 * 24 * 30
    : 1000 * 60 * 60 * 24,
});