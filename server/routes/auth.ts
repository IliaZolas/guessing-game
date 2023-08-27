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
    let token = req.headers.authorization
    let tokens = req.headers
    console.log("token value for auth:",tokens)

    if (!token) {
      const cookies = req.cookies;
      token = cookies.accessToken; 
      console.log("is there a token for auth here?",token)
    }

    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken = jwt.verify(token, "RANDOM-TOKEN") as JwtPayload;
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
