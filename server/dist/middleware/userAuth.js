"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
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
        jsonwebtoken_1.default.verify(newToken, secret, (err, payload) => {
            console.log('verify done', payload);
            if (err) {
                console.log(err, 'errr');
                res.status(401).json({ message: 'invalid token' });
                return;
            }
            const data = payload;
            req.userId = data.id;
            next();
        });
    }
    catch (error) {
        console.log('errror occured in authenticateToken middleware', error);
        res.status(401).json({ message: 'An error occured while authentication' });
    }
};
exports.default = authenticateToken;
