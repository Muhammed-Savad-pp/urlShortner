"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(item) {
        try {
            const newItem = new this.model(item);
            return await newItem.save();
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
    async findOne(filter, projection) {
        try {
            return this.model.findOne(filter, projection);
        }
        catch (error) {
            console.error(error);
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
    async findById(id) {
        try {
            return this.model.findById(id);
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
    async find(filter, projection, skip, limit, sort) {
        try {
            let query = this.model.find(filter, projection).sort(sort);
            if (typeof skip === 'number') {
                query = query.skip(skip);
            }
            if (typeof limit === 'number') {
                query = query.limit(limit);
            }
            return await query.exec();
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
    async count(filter) {
        try {
            return await this.model.countDocuments(filter);
        }
        catch (error) {
            throw new Error(`Error in count: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.BaseRepository = BaseRepository;
