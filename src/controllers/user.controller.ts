import { Request, Response } from "express";
import user from "../models/user";
import bcrypt from "bcrypt";

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
    const id= req.params.id;
    const u = await user.findById(id);
    return res.json(u);
}
