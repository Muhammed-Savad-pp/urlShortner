import { Document, FilterQuery, SortOrder } from "mongoose";

export interface IBaseRepository <T extends Document> {
    create(item: T): Promise<T>;
    findOne(filter: FilterQuery<T>, projection?: Record<string, number>): Promise<T | null>;
    findById(id: string): Promise<T | null>
    find(filter: FilterQuery<T>, projection?: Record<string, number>, skip?: number, limit?: number, sort?: Record<string, SortOrder>): Promise<T[]>;
    count(filter: FilterQuery<T>): Promise<number>
}