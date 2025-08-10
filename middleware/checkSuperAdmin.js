export function checkSuperAdmin(req, res, next) {
  if (req.user?.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}