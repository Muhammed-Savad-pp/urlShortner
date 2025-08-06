import { Document, FilterQuery, Model, SortOrder } from "mongoose";
import { IBaseRepository } from "../interface/IBaseRepository";


export class BaseRepository <T extends Document > implements IBaseRepository<T> {

    protected readonly model:Model<T>

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(item: T): Promise<T> {
        try {
            
            const newItem = new this.model(item);
            return await newItem.save();

        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error))
        }
    }

    async findOne(filter: FilterQuery<T>, projection?: Record<string, number>): Promise<T | null> {
        try {
            
            return this.model.findOne(filter, projection)

        } catch (error) {
            console.error(error);
            throw new Error(error instanceof Error ? error.message : String(error))
        }
    }

    async findById(id: string): Promise<T | null> {
        try {
            
            return this.model.findById(id);

        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error))
        }
    }

    async find(filter: FilterQuery<T>, projection?: Record<string, number>, skip?: number, limit?: number, sort?: Record<string, SortOrder>): Promise<T[]> {
        try {
            
            let query = this.model.find(filter, projection).sort(sort);

            if(typeof skip === 'number') {
                query = query.skip(skip)
            }

            if(typeof limit === 'number') {
                query = query.limit(limit);
            }

            return await query.exec();


        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error))
        }
    }

    async count(filter: FilterQuery<T>): Promise<number> {
        try {

            return await this.model.countDocuments(filter)
            
        } catch (error) {
            throw new Error(`Error in count: ${error instanceof Error ? error.message : String(error)}`)
        }
    }
}