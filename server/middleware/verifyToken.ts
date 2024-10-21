import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend the Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.auth_token; // Safely access cookies

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return; // Just return void, do not return the response object
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;

    req.userId = decoded.userId; // Assign the userId to the request

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Unauthorized: Token expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export default verifyToken;
