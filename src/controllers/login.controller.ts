import { Request, Response } from "express";
import User from "../models/user"

export async function login(req: Request, res: Response):Promise<Response>{
    
    const {mail, password} = req.body;
    
    const l = await User.findOne({"mail": mail});
    
    if(l){
        if(l.password == password){
            return res.json({
                message : 'User Login Sucessfully.'
            });
        }
    }
    return res.json({
        msg: 'Incorrect password or email.'
    });
}