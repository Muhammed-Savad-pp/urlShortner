"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UrlController {
    constructor(_urlService) {
        this._urlService = _urlService;
    }
    async urlShortner(req, res) {
        try {
            const userId = req.userId;
            const { url } = req.body;
            const response = await this._urlService.urlShortner(userId, url);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
    async fetchUrls(req, res) {
        try {
            const userId = req.userId;
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const search = req.query.search;
            const response = await this._urlService.urls(userId, page, limit, search);
            res.status(200).json(response);
        }
        catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
    async redirectUrl(req, res) {
        try {
            const code = req.params.code;
            const foundUrl = await this._urlService.redirectUrl(code);
            if (foundUrl && foundUrl.url) {
                return res.redirect(foundUrl?.url?.originalUrl);
            }
            return res.redirect(`${process.env.FRONTENT_URL}/${code}`);
        }
        catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}
exports.default = UrlController;
