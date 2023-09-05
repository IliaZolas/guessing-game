import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies.accessToken;
    console.log("auth.ts: token value for auth -->",token)

    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken = jwt.verify(token, "accessTokenSecret") as JwtPayload;
    console.log("auth.ts file decoded token variable:",decodedToken);
    const user = decodedToken;

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({
      error: new Error("Invalid request!"),
    });
  }
};

export default authMiddleware;
