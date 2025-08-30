import { Request, Response } from "express";
import { IUserController } from "../interface/IuserController";
import { IUserService } from "../interface/IUserServices";
import { HTTP_STATUS } from "../constants/httpStatus";

class UserController implements IUserController {

    constructor(
        private _userService: IUserService
    ) { }

    async registerUser(req: Request, res: Response): Promise<void> {
        try {

            const formData = req.body;

            const response = await this._userService.registerUser(formData);

            res.status(HTTP_STATUS.OK).json(response)

        } catch (error) {
            console.error(error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(error)
        }
    }

    async loginUser(req: Request, res: Response): Promise<void> {
        try {

            const { email, password } = req.body;

            const response = await this._userService.loginUser(email, password);

            if (response.success) {
                res.status(HTTP_STATUS.CREATED)
                    .cookie('refreshToken', response.refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        maxAge: 3 * 60 * 1000
                    })
                    .json({ success: true, message: 'Logged  in successfully', accessToken: response.accessToken })
            } else {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: response.message })
            }

        } catch (error) {
            console.error(error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(error)
        }
    }

    async logoutUser(req: Request, res: Response): Promise<void> {
        try {

            res.clearCookie('refreshToken');
            res.json({ success: true, message: 'User Logout' });
            return

        } catch (error) {
            console.error(error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(error)
        }
    }

    async validateRefreshToken(req: Request, res: Response): Promise<void> {
        try {

            console.log('req.cookies', req.cookies.refreshToken);

            if (!req.cookies.refreshToken) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'Refresh token not found'
                });
                return;
            }


            const { accessToken, refreshToken } = await this._userService.validateRefreshToken(req.cookies.refreshToken);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 3 * 60 * 1000,
                sameSite: 'none',
            });

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Token created',
                token: accessToken,
            })

        } catch (error: any) {
            console.error(error);

            if (error.status === HTTP_STATUS.UNAUTHORIZED) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: error.message
                });
                return;
            }

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'An internal server error occured',
            })

        }
    }

}

export default UserController;