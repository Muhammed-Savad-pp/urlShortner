import { IUrlService } from "../interface/IUrlService";
import { IUrl } from "../models/UrlModel";
import { IUrlRepository } from "../repository/interface/IUrlRepository";
import { v4 as uuidv4 } from 'uuid';


export class UrlService implements IUrlService {

    constructor(
        private _urlRepository: IUrlRepository
    ) {}

    async urlShortner(userId: string, originalUrl: string): Promise<{ success: boolean; message: string; newUrl?: Partial<IUrl> | null; }> {
        try {
            
            const urlData = await this._urlRepository.findOne({userId: userId, originalUrl: originalUrl});

            if(urlData) {
                return { success: false, message: 'Url already convert'}
            }

            const shortUrl = `${process.env.BACKEND_URL}/url/short-url/${uuidv4().slice(0, 8)}`;
            const createdUrlShortner = await this._urlRepository.createUrl({
                userId,
                originalUrl,
                shortUrl,
            });            

            return { success: true, message: "URL converted", newUrl: createdUrlShortner}

        } catch (error) {
            console.error(error);
            throw new Error( error instanceof Error ? error.message : String(error))
        }
    }

    async urls(userId: string, page: number, limit: number, search: string): Promise<{urlData: IUrl[] | null, totalPages: number}> {
        try {
            
            const skip = ( page - 1) * limit;

            const filter: any = {
                userId: userId,
            }

            if(search) {
                filter.$or = [
                    { originalUrl: { $regex: search, $options: "i"}},
                    { shortUrl: { $regex: search, $options: 'i'}}
                ]
            }

            const urls = await this._urlRepository.find(filter, {}, skip, limit, { createAt: -1});
            const countDocuments = await this._urlRepository.count(filter);

            return {urlData: urls, totalPages: Math.ceil(countDocuments / limit)}

        } catch (error) {
            console.error(error);
            throw new Error(error instanceof Error ? error.message : String(error))
        }
    }

    async redirectUrl(code: string): Promise<{success: boolean, url?: IUrl}> {
        try {
            
            const url = `${process.env.BACKEND_URL}/url/short-url/${code}`;
            const foundUrl = await this._urlRepository.findOne({ shortUrl: url});

            if(foundUrl) {
                return { success: true, url: foundUrl}
            }

            return { success: false}

        } catch (error) {
            console.error(error);
            throw new Error( error instanceof Error ? error.message : String(error))
        }
    }

}