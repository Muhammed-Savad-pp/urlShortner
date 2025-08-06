"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controller/userController"));
const userServices_1 = require("../services/userServices");
const userRepository_1 = __importDefault(require("../repository/implementation/userRepository"));
const user_route = express_1.default.Router();
const userService = new userServices_1.UserService(userRepository_1.default);
const userController = new userController_1.default(userService);
user_route.post('/register', userController.registerUser.bind(userController));
user_route.post('/login', userController.loginUser.bind(userController));
user_route.post('/logout', userController.logoutUser.bind(userController));
user_route.post('/refresh-token', userController.validateRefreshToken.bind(userController));
exports.default = user_route;
