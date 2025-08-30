import { Response } from "express";
import { IUrlController } from "../interface/IUrlController";
import { IUrlService } from "../interface/IUrlService";
import { CustomeRequest } from "../middleware/userAuth";
import { HTTP_STATUS } from "../constants/httpStatus";


class UrlController implements IUrlController {

    constructor(
        private _urlService: IUrlService
    ) { }

    async urlShortner(req: CustomeRequest, res: Response): Promise<void> {
        try {

            const userId = req.userId;
            const { url } = req.body;
            
            const response = await this._urlService.urlShortner(userId as string, url);

            res.status(HTTP_STATUS.OK).json(response);

        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(error)
        }
    }

    async  fetchUrls(req: CustomeRequest, res: Response): Promise<void> {
        try {

            const userId = req.userId;
            const page = parseInt(req.query.page as string);
            const limit = parseInt(req.query.limit as string);
            const search = req.query.search as string;

            const response = await this._urlService.urls(userId as string, page, limit, search);

            res.status(HTTP_STATUS.OK).json(response)
            
        } catch (error) {
            console.error(error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(error)
        }
    }

    async redirectUrl(req: CustomeRequest, res: Response): Promise<void> {
        try {
            
            const code = req.params.code;

            const foundUrl = await this._urlService.redirectUrl(code);

            if(foundUrl && foundUrl.url) {
                return res.redirect(foundUrl?.url?.originalUrl)
            }

            return res.redirect(`${process.env.FRONTENT_URL}/${code}`)

        } catch (error) {
            console.error(error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(error)
        }
    }

}


export default UrlController