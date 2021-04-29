let jwt = require('jsonwebtoken');
import User from "../models/user";
import {config} from "../configs/config";
import fs from 'fs';
import { Request, Response, NextFunction } from "express";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers["session"];
  
    if (!token) return res.status(403).json({ message: "No token provided" });


    let blackList = fs.readFileSync('/home/frueda/eco-back-jonathan/src/middlewares/blackList.txt','utf8').split('\n')
    for (let index = 0; index < blackList.length; index++) {
      if(blackList[index] == token){
        return res.status(401).json({ message: "BlackList Unauthorized!" });
      } 
    }
       try {
     
      const decoded = jwt.verify(token, config.privateKey);
      req.userId = decoded.id.toString();
      const user = await User.findById(decoded.id, { password: 0 });
      if (!user) return res.status(404).json({ message: "No user found" });
      
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
  };