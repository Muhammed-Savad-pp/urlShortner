import  express  from "express";
import UserController from "../controller/userController";
import { UserService } from "../services/userServices";
import userRepository from "../repository/implementation/userRepository";

const user_route = express.Router();

const userService = new UserService(
    userRepository
)

const userController = new UserController(userService);

user_route.post('/register', userController.registerUser.bind(userController));
user_route.post('/login', userController.loginUser.bind(userController));
user_route.post('/logout', userController.logoutUser.bind(userController));
user_route.post('/refresh-token', userController.validateRefreshToken.bind(userController));


export default user_route