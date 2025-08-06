import mongoose, { Document, Schema } from "mongoose";

export interface IUrl extends Document {
    userId: string;
    originalUrl: string;
    shortUrl: string;
    createAt: Date;
}

const urlSchema: Schema = new Schema({
    userId: {
        type: String,
        requried: true,
    },
    originalUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<IUrl>("Url", urlSchema)