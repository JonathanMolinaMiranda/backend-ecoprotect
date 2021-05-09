import { Request, Response } from "express";
import user from "../models/user";
import bcrypt from "bcrypt";
import { createTrue } from "typescript";

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
        type: type
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
    const {userName, password} = req.body;
    const id= req.userId;
    const updated = ""

    if(userName){
        const updated = await user.findByIdAndUpdate(id, {    
            userName: userName
        });
        if (updated){await updated.save();}
    }
    if(password){
        const updated = await user.findByIdAndUpdate(id, {    
            password: await encryptPassword(password)
        });
        if (updated){await updated.save();}
    }

    return res.json({
        message : 'User with id: ' + id + ' successfully updated.',
    })

}

export async function getProfile(req: Request, res: Response):Promise<Response>{
    const id= req.userId;

    const u = await user.findById(id);
    if(u){
        return res.json({
            username: u.userName,
            awards : u.awards,
            publications : u.publications,
            images : u.imgPaths

        });
    }
    return res.json({msg : "No user found"});

}
    