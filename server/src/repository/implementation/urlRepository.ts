import UrlModel, { IUrl } from "../../models/UrlModel";
import { IUrlRepository } from "../interface/IUrlRepository";
import { BaseRepository } from "./baseRepository";

class UrlRepository extends BaseRepository<IUrl> implements IUrlRepository {
    
    constructor() {
        super(UrlModel) 
    }

    async createUrl(urlData: Partial<IUrl>): Promise<IUrl | null> {
        try {

            return this.model.create(urlData)
            
        } catch (error) {
            throw new Error(`Error in create url repostiory: ${ error instanceof Error ? error.message : String(error)}`)
        }
    }
}

export default new UrlRepository()