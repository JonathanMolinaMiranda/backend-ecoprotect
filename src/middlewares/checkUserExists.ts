import { Request, Response, NextFunction } from "express";
import user from "../models/user";

export async function checkUserExists(req: Request, res: Response, next: NextFunction){
    const {mail, userName} = req.body;
    
    const mailExists = await user.findOne({"mail": mail});

    if(mailExists){
        return res.json({
            message: 'mail is already registered',
        })
    }
    const nameuserExist = await user.findOne({"userName": userName});
    if(nameuserExist){
        return res.json({
            message: 'Username already exist',
        })
    }
    next()
}