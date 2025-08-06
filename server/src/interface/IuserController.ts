import { Request, Response } from "express";


export interface IUserController {
    registerUser(req: Request, res: Response): Promise<void>;
    loginUser(req: Request, res: Response): Promise<void>;
    logoutUser(req: Request, res: Response): Promise<void>;
    validateRefreshToken(req: Request, res: Response): Promise<void>;

}