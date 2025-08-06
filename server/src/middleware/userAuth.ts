import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


export interface CustomeRequest extends Request {
    userId?: string;
}

interface CustomJwtPayload extends JwtPayload {
    id: string;
}

const authenticateToken = (req: CustomeRequest, res: Response, next: NextFunction) => {
    try {

        const token = req.headers['authorization'];

        if (!token) {
            res.status(401).json({ message: 'Access denied. no token' });
            return;
        }

        const newToken = token.split(' ')[1];
        const secret = process.env.JWT_ACCESSTOKEN_SECRET;

        if (!secret) {
            throw new Error('access token secret is not defined');
        }

        jwt.verify(newToken, secret, (err, payload) => {
            console.log('verify done', payload);

            if (err) {
                console.log(err, 'errr');
                
                res.status(401).json({ message: 'invalid token' });
                return;
            }

            const data = payload as CustomJwtPayload;
            req.userId = data.id;
            next();


        })

    } catch (error) {
        console.log('errror occured in authenticateToken middleware', error);
        res.status(401).json({ message: 'An error occured while authentication' })
    }
}

export default authenticateToken