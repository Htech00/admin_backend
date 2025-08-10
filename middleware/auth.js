import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Pass a 401 Unauthorised error to the  next middleware
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRETKEY);

    // Attach the decoded  userId to req.user
    req.user = { userId: payload.userId};
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorised" });
  }
}
