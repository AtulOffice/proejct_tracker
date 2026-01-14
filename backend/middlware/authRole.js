export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(401).json({ success: false, message: "Access denied" });
    }

    next();
  };
};
