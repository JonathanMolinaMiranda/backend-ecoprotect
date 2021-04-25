import { Request, Response } from "express";
import publication from "../models/publication";
import path from "path";
import fs from "fs-extra";

export async function createPublication(req: Request, res: Response):Promise<Response>{
    const {id, nameUser, ubication, description,
        comments, mgNumber, commentsNumber, 
        gradient, type} = req.body;

    const newPublication = {
        publicationID: id,
        userName: nameUser,
        ubication: ubication,
        imagePath: req.file.path,
        description: description,
        comments: comments, 
        mgCount: mgNumber,
        commentsNum: commentsNumber,
        gradient: gradient, 
        type: type
    }
    const p = new publication(newPublication)
    await p.save();

    return res.json({
        message: 'Publication successfully saved',
    })
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
        fs.unlink(path.resolve(p.imagePath));
    }
    return res.json({
        message:'Publication with id: ' + id + ' successfully removed.'
    });
}

export async function doComment(req: Request, res: Response): Promise<Response>{
    const id= req.params.id;
    const {comment} = req.body;
    
    await publication.findByIdAndUpdate(id, {
        $push: {
            comments: comment
          },
          $inc: {
            commentsNum: 1
          }
    });

    return res.json({
        message : 'Publication with id: ' + id + ' successfully added comment.'
    });

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

    let average = 0;
    if(updated != null){
         average = updated.gradient.reduce((a, b) => a + b, 0) / updated.gradient.length;
    }


    return res.json({
        message : 'Publication with id: ' + id + ' successfully added gradient.',
        average: average
    })

}