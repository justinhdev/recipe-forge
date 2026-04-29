import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length === 0) {
    next();
    return;
  }

  const user = (req as Request & { user?: { userId?: number } }).user;
  if (!user?.userId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const account = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { email: true },
  });

  if (!account || !adminEmails.includes(account.email.toLowerCase())) {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};
