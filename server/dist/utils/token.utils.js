"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = async (id) => {
    const secret = process.env.JWT_ACCESSTOKEN_SECRET;
    if (!secret) {
        throw new Error('accessToken not working');
    }
    const response = await jsonwebtoken_1.default.sign({ id }, secret, { expiresIn: '15m' });
    return response;
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = async (id) => {
    const secret = process.env.JWT_REFRESHTOKEN_SECRET;
    if (!secret) {
        throw new Error('Refresh token not working');
    }
    const response = await jsonwebtoken_1.default.sign({ id }, secret, { expiresIn: '3h' });
    return response;
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESHTOKEN_SECRET);
        return decoded;
    }
    catch (error) {
        const err = new Error('Token_expired');
        err.status = 401;
        throw error;
    }
};
exports.verifyToken = verifyToken;
