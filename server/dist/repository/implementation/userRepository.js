"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const baseRepository_1 = require("./baseRepository");
class UserRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(UserModel_1.default);
    }
    async createUser(userData) {
        try {
            return await this.model.create(userData);
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
}
exports.default = new UserRepository();
