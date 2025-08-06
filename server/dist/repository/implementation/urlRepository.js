"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UrlModel_1 = __importDefault(require("../../models/UrlModel"));
const baseRepository_1 = require("./baseRepository");
class UrlRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(UrlModel_1.default);
    }
    async createUrl(urlData) {
        try {
            return this.model.create(urlData);
        }
        catch (error) {
            throw new Error(`Error in create url repostiory: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.default = new UrlRepository();
