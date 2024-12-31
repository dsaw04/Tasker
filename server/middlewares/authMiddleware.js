import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Extract token

  if (!token) {
    return res.status(401).json({ error: "Access Denied: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded.id; // Attach user ID to request
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Access token expired" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
};
