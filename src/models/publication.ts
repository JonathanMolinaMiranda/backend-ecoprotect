import {Schema, model, Document} from "mongoose";

const schema= new Schema({
    userName: String,
    ubication: String,
    imagePath: String,
    description: String,
    comments: Array, 
    mgCount: Array,
    commentsNum: Number,
    gradient: Array, 
    type: Boolean
});

interface IPublication extends Document{
    userName: string;
    ubication: string;
    imagePath: string;
    description: string;
    comments: Array<string>;
    mgCount: Array<number>;
    commentsNum: number;
    gradient: Array<number>; 
    type: boolean;
}

export default model<IPublication>('Publication', schema)
