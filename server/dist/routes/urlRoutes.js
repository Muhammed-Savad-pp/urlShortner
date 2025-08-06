"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const urlController_1 = __importDefault(require("../controller/urlController"));
const userAuth_1 = __importDefault(require("../middleware/userAuth"));
const urlService_1 = require("../services/urlService");
const urlRepository_1 = __importDefault(require("../repository/implementation/urlRepository"));
const url_route = express_1.default.Router();
const urlService = new urlService_1.UrlService(urlRepository_1.default);
const urlController = new urlController_1.default(urlService);
url_route.post('/url-shortner', userAuth_1.default, urlController.urlShortner.bind(urlController));
url_route.get('/urls', userAuth_1.default, urlController.fetchUrls.bind(urlController));
url_route.get('/short-url/:code', urlController.redirectUrl.bind(urlController));
exports.default = url_route;
