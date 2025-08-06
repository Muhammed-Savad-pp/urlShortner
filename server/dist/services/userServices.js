"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_utils_1 = require("../utils/token.utils");
async function hashPassword(password) {
    return await bcrypt_1.default.hash(password, 10);
}
class UserService {
    constructor(_userRepository) {
        this._userRepository = _userRepository;
    }
    ;
    async registerUser(userData) {
        try {
            const { name, email, password, confirmPassword } = userData;
            if (!name || !email || !password || !confirmPassword) {
                return { success: false, message: 'complete the fields' };
            }
            if (password !== confirmPassword) {
                return { success: false, message: 'Password and confirm Password not match' };
            }
            const existingUser = await this._userRepository.findOne({ email: email });
            if (existingUser) {
                return { success: false, message: "This email already registered" };
            }
            const hashedPassword = await hashPassword(password);
            const response = await this._userRepository.createUser({
                name,
                email,
                password: hashedPassword,
            });
            return { success: true, message: 'SignUp SuccessFully' };
        }
        catch (error) {
            console.error(error);
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
    async loginUser(email, password) {
        try {
            const existingUser = await this._userRepository.findOne({ email: email });
            if (!existingUser) {
                return { success: false, message: 'User not found' };
            }
            const validPassowrd = await bcrypt_1.default.compare(password, existingUser.password);
            if (!validPassowrd)
                return { success: false, message: "Invalid Password" };
            const accessToken = await (0, token_utils_1.generateAccessToken)(existingUser.id);
            const refreshToken = await (0, token_utils_1.generateRefreshToken)(existingUser._id);
            console.log(accessToken, 'accessToken');
            console.log(refreshToken, 'refreshToken');
            return { success: true, message: "Logged SuccessFully", accessToken: accessToken, refreshToken };
        }
        catch (error) {
            console.error(error);
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
    async validateRefreshToken(token) {
        try {
            console.log('refresh token');
            const decoded = (0, token_utils_1.verifyToken)(token);
            console.log(decoded);
            const user = await this._userRepository.findById(decoded.id);
            console.log(user);
            if (!user) {
                const error = new Error('User not found');
                error.status = 404;
                throw error;
            }
            const accessToken = await (0, token_utils_1.generateAccessToken)(user._id);
            const refreshToken = await (0, token_utils_1.generateRefreshToken)(user._id);
            return { accessToken, refreshToken };
        }
        catch (error) {
            console.log(error);
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
}
exports.UserService = UserService;
