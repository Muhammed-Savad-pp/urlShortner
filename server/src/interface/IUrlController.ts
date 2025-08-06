import { Response } from "express";
import { CustomeRequest } from "../middleware/userAuth";


export interface IUrlController {
    urlShortner(req: CustomeRequest, res: Response): Promise<void>;
    fetchUrls(req: CustomeRequest, res: Response): Promise<void>;
    redirectUrl(req: CustomeRequest, res: Response): Promise<void>;
}