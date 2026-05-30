const base64UrlEncode = (value: object) =>
  window
    .btoa(JSON.stringify(value))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

export const makeTestJwt = (expiresInSeconds = 3600) =>
  [
    base64UrlEncode({ alg: "none", typ: "JWT" }),
    base64UrlEncode({
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    }),
    "signature",
  ].join(".");
