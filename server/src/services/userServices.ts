import { IUserService } from "../interface/IUserServices";
import { IUser } from "../models/UserModel";
import { IUserRepository } from "../repository/interface/IUserRepository";
import bcrypt from 'bcrypt'
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/token.utils";
import { MESSAGE } from "../constants/message";

async function hashPassword(password:string): Promise<string> {
    return await bcrypt.hash(password, 10)
}

export class UserService implements IUserService {

    constructor(
        private _userRepository: IUserRepository
    ){ };

    async registerUser(userData: {name: string, email: string, password: string, confirmPassword: string}): Promise<{ success: boolean; message: string; }> {
        try {
            
            const { name, email, password, confirmPassword } = userData;

            if(!name || !email || !password || !confirmPassword) {
                return {success: false, message: MESSAGE.FIELDS_ERROR}
            }

            if(password !== confirmPassword) {
                return { success: false, message: MESSAGE.PASSWORD_ERROR}
            }

            const existingUser = await this._userRepository.findOne({email: email});

            if(existingUser) {
                return {success: false, message: MESSAGE.EXISCTING_EMAIL}
            }

            const hashedPassword = await hashPassword(password); 

            const response = await this._userRepository.createUser(
                {
                    name,
                    email,
                    password: hashedPassword ,
                }
            )

            return {success: true, message: MESSAGE.COMPLETE_SIGNUP}

        } catch (error) {
            console.error(error);
            throw new Error(error instanceof Error ? error.message : String(error))
        }
    }

    async loginUser(email: string, password: string): Promise<{ success: boolean; message: string; accessToken?: string; refreshToken?: string; }> {
        try {
            
            const existingUser = await this._userRepository.findOne({email: email});
            
            if(!existingUser) {
                return { success: false, message: MESSAGE.NO_USER}
            }

            const validPassowrd = await bcrypt.compare(password, existingUser.password);

            if(!validPassowrd) return {success: false, message: MESSAGE.INVALID_PASSWORD};

            const accessToken = await generateAccessToken(existingUser.id as string);
            const refreshToken = await generateRefreshToken(existingUser._id as string);            

            return { success: true, message: MESSAGE.SUCESSFULL_LOGIN,accessToken: accessToken, refreshToken}


        } catch (error) {
            console.error(error);
            throw new Error(error instanceof Error ? error.message : String(error))
        }
    }

    async validateRefreshToken(token: string): Promise<{ accessToken?: string; refreshToken?: string; }> {
        try {
                        
            const decoded = verifyToken(token);

            const user = await this._userRepository.findById(decoded.id);            

            if(!user) {
                const error: any = new Error(MESSAGE.NO_USER);
                error.status = 404;
                throw error;
            }

            const accessToken = await generateAccessToken(user._id as string);
            const refreshToken = await generateRefreshToken(user._id as string);

            return {accessToken, refreshToken};

        } catch (error) {
            console.log(error);
            throw new Error( error instanceof Error ? error.message : String(error))
        }
    }
}