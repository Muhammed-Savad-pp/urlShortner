import { IUserService } from "../interface/IUserServices";
import { IUser } from "../models/UserModel";
import { IUserRepository } from "../repository/interface/IUserRepository";
import bcrypt from 'bcrypt'
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/token.utils";

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
                return {success: false, message: 'complete the fields'}
            }

            if(password !== confirmPassword) {
                return { success: false, message: 'Password and confirm Password not match'}
            }

            const existingUser = await this._userRepository.findOne({email: email});

            if(existingUser) {
                return {success: false, message: "This email already registered"}
            }

            const hashedPassword = await hashPassword(password);

            const response = await this._userRepository.createUser(
                {
                    name,
                    email,
                    password: hashedPassword ,
                }
            )

            return {success: true, message: 'SignUp SuccessFully'}


        } catch (error) {
            console.error(error);
            throw new Error(error instanceof Error ? error.message : String(error))
        }
    }

    async loginUser(email: string, password: string): Promise<{ success: boolean; message: string; accessToken?: string; refreshToken?: string; }> {
        try {
            
            const existingUser = await this._userRepository.findOne({email: email});
            
            if(!existingUser) {
                return { success: false, message: 'User not found'}
            }

            const validPassowrd = await bcrypt.compare(password, existingUser.password);

            if(!validPassowrd) return {success: false, message: "Invalid Password"};

            const accessToken = await generateAccessToken(existingUser.id as string);
            const refreshToken = await generateRefreshToken(existingUser._id as string);
            console.log(accessToken, 'accessToken');
            console.log(refreshToken, 'refreshToken');
            

            return { success: true, message: "Logged SuccessFully",accessToken: accessToken, refreshToken}


        } catch (error) {
            console.error(error);
            throw new Error(error instanceof Error ? error.message : String(error))
        }
    }

    async validateRefreshToken(token: string): Promise<{ accessToken?: string; refreshToken?: string; }> {
        try {
            
            console.log('refresh token');
            
            const decoded = verifyToken(token);
            console.log(decoded);
            
            const user = await this._userRepository.findById(decoded.id);
            console.log(user);
            

            if(!user) {
                const error: any = new Error('User not found');
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