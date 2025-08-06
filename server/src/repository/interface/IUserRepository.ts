import { IUser } from "../../models/UserModel";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
    createUser(userData: Partial<IUser>): Promise<IUser>
}
