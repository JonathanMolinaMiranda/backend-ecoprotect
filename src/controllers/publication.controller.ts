import { Request, Response } from "express";
import publication from "../models/publication";
import User from "../models/user"
import path from "path";
import fs from "fs-extra";
const FormData = require('form-data');     
let jwt = require('jsonwebtoken');
let request = require('request');

//FUNCION PARA DESCARGAR IMAGENES POR ENLACE
function downloadImage(uri: string, filename: string, callback: () => void){
    request.head(uri, function(){     
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

function blurFace(fileName: string, path: string, user_id: any){
    const form = new FormData();
    const buffer = fs.createReadStream(path)
    const fetch = require('node-fetch');

    form.append('image', buffer, {
        contentType: 'multipart/form-data',
        name: 'image',
        filename: fileName,
      });

    fetch('https://api.faceblurapi.com/v1/blur?apiKey=96cc5130122645ecb7ccb414ac53d99c', { method: 'POST', body: form })
    .then((res: { json: () => any; }) => res.json())
    .then(async (json: any) => {

        //CREACIÓN DEL PATH1
        const id = './images/' + fileName;
        console.log(id)
        await downloadImage(json.image, id, function(){
        });

    });
}

export async function createPublication(req: Request, res: Response){
    const {ubication, description,
        comments, mgCount, commentsNum, 
        gradient, type, url1,url2} = req.body;
    
    const user_id = req.userId;
    
    
    const l = await User.findById(user_id);
    let s= Object.assign(req.files)

    
    const fileName = s[0].path.split('/').pop();
    blurFace(fileName, s[0].path, user_id)

    if (l) {
        const newPublication = {
            userName: l.userName,
            ubication: ubication,
            imagePath: s[0].path,
            solutionPath: s[1] ? s[1].path:" "   ,
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
        l.publications.push(p.id)
        if(l.numberPublications) l.numberPublications+=1;
        else l.numberPublications =1
        switch(l.numberPublications) { 
            case 1: { 
            l.awards.push("bronzePublication")
            break; 
            } 
            case 10: { 
                l.awards.push("silverPublication") 
            break; 
            } 
            case 20: { 
                l.awards.push("goldPublication")
            break; 
            } 
        } 
        if(s[1]){
            //l.imgPaths.push(p.imagePath, p.solutionPath)
            const fileName = s[1].path.split('/').pop();
            blurFace(fileName, s[1].path, user_id)
            l.imgPaths.push(p.imagePath,p.solutionPath)
            
        }
        else l.imgPaths.push(p.imagePath)
        await l.save();

        return res.json({
            message: 'Publication successfully saved',
            gradient: newPublication.gradient,
            idImage: p.id,
            image: p.imagePath

        })
    }
    /*const {ubication, description,
        comments, mgCount, commentsNum, 
        gradient, type} = req.body;

    let s= Object.assign(req.files)
    console.log(s[0].path)
    
    const user_id = req.userId;
    const l = await User.findById(user_id);


    if (l) {
        const newPublication = {
            userName: l.userName,
            ubication: ubication,
            imagePath: s[0].path,
            solutionPath: s[1] ? s[1].path:" "   ,
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
        l.publications.push(p.id)
        if(l.numberPublications) l.numberPublications+=1;
        else l.numberPublications =1
        switch(l.numberPublications) { 
            case 1: { 
               l.awards.push("bronzePublication")
               break; 
            } 
            case 10: { 
                l.awards.push("silverPublication") 
               break; 
            } 
            case 20: { 
                l.awards.push("goldPublication")
               break; 
            } 
         } 
        if(l.type){
            //l.imgPaths.push(p.imagePath, p.solutionPath)
            l.imgPaths.push(p.imagePath,p.solutionPath)
            
        }
        else l.imgPaths.push(p.imagePath)
        await l.save();

        return res.json({
            message: 'Publication successfully saved',
            gradient: newPublication.gradient,
            idImage: p.id,
            image: p.imagePath

        })
    }*/
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
    const user_id = req.userId;
    const l = await User.findById(user_id);
    const p = await publication.findByIdAndRemove(id);
    if(l){
        if(p){ 
            if(!fs.unlink(path.resolve(p.imagePath))) { return res.json({message: 'No image'})}        
       

            const index =  l.publications.indexOf(id);

            if(index > -1){
                l.publications.splice(index, 1);

            }else{
                return res.json({message: 'No publication found by id '+ id});
            }

            if(l.type == true){
                if(!fs.unlink(path.resolve(p.solutionPath))) { return res.json({message: 'No image'})}
                l.imgPaths.splice(index*2, 2);    
            }else{
                l.imgPaths.splice(index, 1);
            }
        }
        l.save();    
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

        if(l.numberComments) l.numberComments+=1;
        else l.numberComments =1

        switch(l.numberComments) { 
            case 1: { 
               l.awards.push("bronzeComment")
               break; 
            } 
            case 10: { 
                l.awards.push("silverComment") 
               break; 
            } 
            case 20: { 
                l.awards.push("goldComment")
               break; 
            } 
         } 
         l.save()
    
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


export async function removeLike(req: Request, res: Response): Promise<Response>{
    const id= req.params.id; 
    const pos = req.params.pos;

    let com= `mgCount.${pos}`;
    await publication.findByIdAndUpdate(id, {
        $inc: 
            {
                [com] : -1 
            }
            
        });

    return res.json({
        msg: 'ok'
    });

}

export async function search(req: Request, res: Response): Promise<Response>{
    const ubica = req.params.ubi;
    const p = await publication.find({ ubication: ubica});
    if(p){
        return res.json(p);
    }
    else{
        return res.json({msg: "Not found"})
    }
}

export async function deleteComment(req: Request, res: Response): Promise<Response>{
    const id= req.params.id; 
    const pos = req.params.pos;

    let com= `comments.${pos}`;
    let mg = `mgCount.${pos}`;
    await publication.findByIdAndUpdate(id, {
        $set:
        {
            [com] : null,
            [mg] : null
        }   
        });

    await publication.findByIdAndUpdate(id, {
        $pull: 
        {
            comments : null,
            mgCount : null
        }
        });

    return res.json({
        msg: 'ok'
    });
}