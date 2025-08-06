import UserModel, { IUser } from "../../models/UserModel";
import { IUserRepository } from "../interface/IUserRepository";
import { BaseRepository } from "./baseRepository";

class UserRepository extends BaseRepository<IUser> implements IUserRepository {

    constructor() {
        super(UserModel)
    }

    async createUser(userData: Partial<IUser>): Promise<IUser> {
        try {
            
            return await this.model.create(userData)

        } catch (error) {
            throw new Error( error instanceof Error ? error.message : String(error))
        }
    }

}

export default new UserRepository()