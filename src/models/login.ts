import {Schema, model, Document} from "mongoose";

const schema= new Schema({
    mail: String,
    password: String
});
/*
interface ILogin extends Document{
    mail: string;
    password: string
}
export default model<ILogin>('Login', schema)
*/
export default model('Login', schema);