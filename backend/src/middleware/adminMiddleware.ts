import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({
      message: "Admin access required",
    });
    return;
  }

  next();
};

export default adminOnly;