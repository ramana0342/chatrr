import jwt from "jsonwebtoken";

export const refreshTokenHandler = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({
      message: "Refresh token missing"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      {
       
         id: decoded.id,
        user_name: decoded.user_name,
        name : decoded.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      accessToken: newAccessToken
    });

  } catch (err) {
    return res.status(403).json({
      message: "Invalid refresh token"
    });
  }
};