import { Schema, model } from 'mongoose';
import { IData } from '../models/data.model';

const PostSchema = new Schema<IData>({
    title: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, required: false },
    userId: { type: String, required: true },
    likes: { type: [String], default: [] } 
});

export default model<IData>('Post', PostSchema);