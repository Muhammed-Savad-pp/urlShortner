import { IUrl } from "../models/UrlModel";


export interface IUrlService {
    urlShortner(userId: string, originalUrl: string): Promise<{success: boolean, message: string, newUrl?: Partial<IUrl> | null}>;
    urls(userId: string, page: number, limit: number, search: string): Promise<{urlData: IUrl[] | null, totalPages: number}>;
    redirectUrl(code: string): Promise<{success: boolean, url?: IUrl}>;
}