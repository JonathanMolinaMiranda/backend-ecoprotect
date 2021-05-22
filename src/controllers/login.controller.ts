import { Request, Response } from "express";
import User from "../models/user"
import fs from "fs";
import {config} from "../configs/config";
let jwt = require('jsonwebtoken');
import bcrypt from "bcrypt";


export async function comparePassword(password : any, receivedPassword: any){
    return await bcrypt.compare(password, receivedPassword)
  }

export async function login(req: Request, res: Response):Promise<Response>{
    
    const {mail, password} = req.body;
    
    const l = await User.findOne({"mail": mail});
   
    if(l){
            const _id = l.id
            const payload = {
                id: _id
            }; 

            const matchPassword = await comparePassword(
                req.body.password,
                l.password
            );

            if(matchPassword){
                const token = jwt.sign(payload, config.privateKey);
                return res.json({
                    message : 'User Login Sucessfully. Added token',
                    token: token
                });
            }else{
                return res.status(401).json({
                    message: "Invalid Password" 
                })
            }
    }

    return res.json({
        msg: 'Incorrect password or email.'
    });
}

export async function logout(req: Request, res: Response):Promise<Response>{
    let token = req.headers['session'];
    if(token){
        fs.appendFileSync('/home/frueda/eco-back-pruevas/src/middlewares/blackList.txt',`${token.toString()}\n`);

    }
    return res.json({ msg:'logout '+ token + ' destroyed'})
}
