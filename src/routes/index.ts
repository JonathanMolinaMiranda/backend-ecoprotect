import { Router } from "express";
import * as Publicationcontroller from "../controllers/publication.controller";
import * as Usercontroller from "../controllers/user.controller";
import * as LoginController from "../controllers/login.controller";
import multer from "../libs/multer";
import {verifyToken} from "../middlewares/verifyToken";
import {checkUserExists} from "../middlewares/checkUserExists"
const router = Router();    

router.route('/register')
    .post(checkUserExists, Usercontroller.registerUser)

router.route('/user/:id')
    .get(verifyToken, Usercontroller.getUser) 

router.route('/login')
    .post(LoginController.login) 

    
router.route('/logout')
    .post(verifyToken, LoginController.logout) 

router.route('/publications')
    .get(verifyToken, Publicationcontroller.getPublications)
    .post(verifyToken, multer.single('image'),Publicationcontroller.createPublication) //Solo una imagen
    
router.route('/publications/:id')
    .get(verifyToken, Publicationcontroller.getPublication)
    .delete(verifyToken, Publicationcontroller.deletePublication)
    .put(verifyToken,Publicationcontroller.doComment)

router.route('/publications/like/:id/:pos')
    .put(verifyToken, Publicationcontroller.doLike)

    
router.route('/publications/gradient/:id')
    .put(verifyToken, Publicationcontroller.gradient)

export default router; 