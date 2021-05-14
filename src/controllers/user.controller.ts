import { Request, Response } from "express";
import user from "../models/user";
import bcrypt from "bcrypt";
import {comparePassword} from "./login.controller"

async function encryptPassword(password: any) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };
  

export async function registerUser(req: Request, res: Response):Promise<Response>{
    const {mail, userName, country, city,
        postalCode, password, publications, 
        numberPublications, awards, type} = req.body;

    const newUser = {
        mail: mail,
        userName: userName,
        country: country,
        city: city,
        postalCode: postalCode,
        password: await encryptPassword(password), 
        publications: publications,
        numberPublications: numberPublications,
        awards: awards, 
        type: false
    }
    const u = new user(newUser);
    await u.save();

    return res.json({
        message: 'Usser successfully saved',
        u
    })  
}

export async function getUser(req: Request, res: Response):Promise<Response>{
    const id= req.userId;
    const u = await user.findById(id);
    return res.json(u);
}


export async function editUser(req: Request, res: Response):Promise<Response>{
    const {userName, password, actualPassword} = req.body;
    const id= req.userId;
    const updated = ""
    let p=""
    const u = await user.findById(id)
    if(u) {p= u.password}

    if(userName){
        if(!await user.findOne({"userName" : userName})){
            const updated = await user.findByIdAndUpdate(id, {    
                userName: userName
            });
            if (updated){
                await updated.save();}
        }else{return res.json({msg: "Already exists nameUser", response: 0})}
    }
    if(password){
        console.log(p, actualPassword)
        if(await comparePassword(actualPassword, p)){
            const updated = await user.findByIdAndUpdate(id, {    
                password: await encryptPassword(password)
            });
            if (updated){await updated.save();}
        } else{return res.json({msg: "Problem with password", response: 0})}


    }

    return res.json({
        message : 'User with id: ' + id + ' successfully updated.',
        response: 1

    })

}

export async function getProfile(req: Request, res: Response):Promise<Response>{
    const id= req.userId;

    const u = await user.findById(id);
    if(u){
        return res.json({
            username: u.userName,
            type: u.type,
            awards : u.awards,
            publications : u.publications,
            images : u.imgPaths

        });
    }
    return res.json({msg : "No user found"});

}

export async function verify(req: Request, res: Response):Promise<Response>{
    const id= req.userId;


    await user.findByIdAndUpdate(id, {
        type: true
    });

    return res.json({msg : "User verificated"});

}
    