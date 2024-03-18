import { Request, Response, NextFunction } from "express";
import { Sequelize } from "sequelize";

export async function logMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}
