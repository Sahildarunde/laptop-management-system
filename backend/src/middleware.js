import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    const role = req.header("Role");
  
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    if (!role) {
        return res.status(401).json({ message: "Role not specified" });
      }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
      }
      req.user = decoded;
  
      next();
    });
};