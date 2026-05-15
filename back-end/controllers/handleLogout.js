import { refreshCookieOptionsRemove } from "../config/cookie.js";

export const handleLogout = (req, res) => {
  try {
    res.clearCookie("refreshToken", refreshCookieOptionsRemove);

    return res.status(200).json({
      status: { code: 200, message: "Logged out successfully" },
      response: null
    });

  } catch (error) {
    return res.status(500).json({
      status: { code: 500, message: error.message },
      response: null
    });
  }
};