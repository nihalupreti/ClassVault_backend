const setCookie = (res, encryptedToken) => {
  res.cookie("authToken", encryptedToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    maxAge: 60 * 60 * 1000, // 1 hour
    path: "/",
  });
};

module.exports = setCookie;
