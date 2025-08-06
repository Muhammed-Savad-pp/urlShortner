import { error } from "console";
import jwt, { JwtPayload }  from "jsonwebtoken";
import { decode } from "punycode";

export const generateAccessToken = async (id: string) => {
    const secret = process.env.JWT_ACCESSTOKEN_SECRET;

    if(!secret) {
        throw new Error('accessToken not working')
    }

    const response = await jwt.sign({id}, secret, {expiresIn: '15m'});
    return response;
}

export const generateRefreshToken = async (id: string) => {
    const secret = process.env.JWT_REFRESHTOKEN_SECRET;

    if(!secret) {
        throw new Error('Refresh token not working')
    }

    const response = await jwt.sign({ id }, secret, { expiresIn: '3h'});
    return response;

}

export const verifyToken = (token: string): JwtPayload => {
    try {

        const decoded = jwt.verify(token, process.env.JWT_REFRESHTOKEN_SECRET as string) as JwtPayload;
        return decoded
        
    } catch (error) {
        const err: any = new Error('Token_expired');
        err.status = 401;
        throw error
    }
}