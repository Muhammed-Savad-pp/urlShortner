import express from "express"
import UrlController from "../controller/urlController";
import authenticateToken from "../middleware/userAuth";
import { UrlService } from "../services/urlService";
import urlRepository from "../repository/implementation/urlRepository";

const url_route = express.Router();

const urlService = new UrlService(
    urlRepository
)


const urlController = new UrlController(urlService);

url_route.post('/url-shortner', authenticateToken,  urlController.urlShortner.bind(urlController))
url_route.get('/urls', authenticateToken, urlController.fetchUrls.bind(urlController));
url_route.get('/short-url/:code', urlController.redirectUrl.bind(urlController))

export default url_route