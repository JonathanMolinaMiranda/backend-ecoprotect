import { Request, Response } from "express";
import publication from "../models/publication";
import User from "../models/user"
import path from "path";
import fs from "fs-extra";
let jwt = require('jsonwebtoken');

export async function createPublication(req: Request, res: Response){
    const {ubication, description,
        comments, mgCount, commentsNum, 
        gradient, type} = req.body;
    
    const user_id = req.userId;
    const l = await User.findById(user_id);
    console.log(user_id)

    if (l) {
        const newPublication = {
            userName: l.userName,
            ubication: ubication,
            imagePath: req.file.path,
            description: description,
            comments: [], 
            mgCount: [],
            commentsNum: 0,
            gradient: parseInt(gradient), 
            gradientAverage: parseInt(gradient), 
            type: l.type
        }
        const p = new publication(newPublication)
        await p.save();

        return res.json({
            message: 'Publication successfully saved',
            gradient: newPublication.gradient
        })
    }
}


export async function getPublications(req: Request, res: Response): Promise<Response>{
    const p = await publication.find();
    return res.json(p);
}

export async function getPublication(req: Request, res: Response): Promise<Response>{

    const id= req.params.id;
    const p = await publication.findById(id);
    return res.json(p);         
}

export async function deletePublication(req: Request, res: Response): Promise<Response>{
    const id= req.params.id;
    const p = await publication.findByIdAndRemove(id);
    if(p){
        if(!fs.unlink(path.resolve(p.imagePath))) { return res.json({message: 'No image'})}
    }
    return res.json({
        message:'Publication with id: ' + id + ' successfully removed.'
    });
}

export async function doComment(req: Request, res: Response){
    const id= req.params.id;
    const {comment} = req.body;

                      
    const user_id = req.userId;
    const l = await User.findById(user_id);

    if (l) { 

        const com = l.userName+": "+comment
        
        
        await publication.findByIdAndUpdate(id, {
            $push: {
                comments: com,
                mgCount: 0
            },
            $inc: {
                commentsNum: 1
            }
        });
    
        return res.json({
            message : 'Publication with id: ' + id + ' successfully added comment.'
        });
    }
}

export async function doLike(req: Request, res: Response): Promise<Response>{
    const id= req.params.id; 
    const pos = req.params.pos;

    let com= `mgCount.${pos}`;
    await publication.findByIdAndUpdate(id, {
        $inc: 
            {
                [com] : 1 
            }
            
        });

    return res.json({
        msg: 'ok'
    });

}

export async function gradient(req: Request, res: Response): Promise<Response>{
    const id= req.params.id; 
    const {gradient} = req.body;
    const updated = await publication.findByIdAndUpdate(id, {
        $push: {
            gradient: gradient
          }
    }, {new : true});

   if(updated != null){
        updated.gradientAverage = updated.gradient.reduce((a, b) => a + b, 0) / updated.gradient.length
        await updated.save();
    }

    return res.json({
        message : 'Publication with id: ' + id + ' successfully added gradient.',
        average: updated?.gradientAverage
    })

}


