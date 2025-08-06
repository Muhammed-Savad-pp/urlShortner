import { IUrl } from "../../models/UrlModel";
import { IBaseRepository } from "./IBaseRepository";

export interface IUrlRepository extends IBaseRepository <IUrl> {
    createUrl(urlData: Partial<IUrl>): Promise<IUrl | null>; 
}