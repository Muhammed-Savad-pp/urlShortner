"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlService = void 0;
const uuid_1 = require("uuid");
class UrlService {
    constructor(_urlRepository) {
        this._urlRepository = _urlRepository;
    }
    async urlShortner(userId, originalUrl) {
        try {
            const urlData = await this._urlRepository.findOne({ userId: userId, originalUrl: originalUrl });
            if (urlData) {
                return { success: false, message: 'Url already convert' };
            }
            const shortUrl = `${process.env.BACKEND_URL}/url/short-url/${(0, uuid_1.v4)().slice(0, 8)}`;
            const createdUrlShortner = await this._urlRepository.createUrl({
                userId,
                originalUrl,
                shortUrl,
            });
            return { success: true, message: "URL converted", newUrl: createdUrlShortner };
        }
        catch (error) {
            console.error(error);
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
    async urls(userId, page, limit, search) {
        try {
            const skip = (page - 1) * limit;
            const filter = {
                userId: userId,
            };
            if (search) {
                filter.$or = [
                    { originalUrl: { $regex: search, $options: "i" } },
                    { shortUrl: { $regex: search, $options: 'i' } }
                ];
            }
            const urls = await this._urlRepository.find(filter, {}, skip, limit, { createAt: -1 });
            const countDocuments = await this._urlRepository.count(filter);
            return { urlData: urls, totalPages: Math.ceil(countDocuments / limit) };
        }
        catch (error) {
            console.error(error);
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
    async redirectUrl(code) {
        try {
            const url = `${process.env.BACKEND_URL}/url/short-url/${code}`;
            const foundUrl = await this._urlRepository.findOne({ shortUrl: url });
            if (foundUrl) {
                return { success: true, url: foundUrl };
            }
            return { success: false };
        }
        catch (error) {
            console.error(error);
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
}
exports.UrlService = UrlService;
