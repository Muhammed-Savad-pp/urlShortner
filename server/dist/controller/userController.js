"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    constructor(_userService) {
        this._userService = _userService;
    }
    async registerUser(req, res) {
        try {
            const formData = req.body;
            const response = await this._userService.registerUser(formData);
            res.status(200).json(response);
        }
        catch (error) {
            console.error(error);
        }
    }
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            console.log(email, password, 'sdadf');
            const response = await this._userService.loginUser(email, password);
            if (response.success) {
                res.status(201)
                    .cookie('refreshToken', response.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 3 * 60 * 1000
                })
                    .json({ success: true, message: 'Logged  in successfully', accessToken: response.accessToken });
            }
            else {
                console.log('here');
                res.status(401).json({ success: false, message: response.message });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
    async logoutUser(req, res) {
        try {
            res.clearCookie('refreshToken');
            res.json({ success: true, message: 'User Logout' });
            return;
        }
        catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
    async validateRefreshToken(req, res) {
        try {
            console.log('req.cookies', req.cookies.refreshToken);
            if (!req.cookies.refreshToken) {
                res.status(400).json({
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
            res.status(200).json({
                success: true,
                message: 'Token created',
                token: accessToken,
            });
        }
        catch (error) {
            console.error(error);
            if (error.status === 401) {
                res.status(401).json({
                    success: false,
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: error.message || 'An internal server error occured',
            });
        }
    }
}
exports.default = UserController;
