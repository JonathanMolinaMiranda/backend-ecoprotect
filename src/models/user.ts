import {Schema, model, Document} from "mongoose";

const schema= new Schema({
    mail: String,
    userName: String,
    country: String,
    city: String,
    postalCode: String,
    password: String, 
    publications: Array,
    imgPaths: Array,
    numberPublications: Number,
    awards: Array, 
    type: Boolean
});

interface IUser extends Document{
    mail: string;
    userName: string;
    country: string;
    city: string;
    postalCode: string;
    password: string;  
    publications: Array<string>;
    imgPaths: Array<string>;
    numberPyblications: number;
    awards: Array<string>; 
    type: boolean;
}
export default model<IUser>('User', schema)
