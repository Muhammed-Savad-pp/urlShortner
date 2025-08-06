import { IUser } from "../models/UserModel"


export interface IUserService {
    registerUser(userData: {name: string, email: string, password: string, confirmPassword: string}): Promise<{success: boolean, message: string}>;
    loginUser(email: string, password: string): Promise<{success: boolean, message: string, accessToken?: string, refreshToken?: string}>;
    validateRefreshToken(token: string): Promise<{accessToken?: string, refreshToken?: string}>
}