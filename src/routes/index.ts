import { Router } from "express";
import * as Publicationcontroller from "../controllers/publication.controller";
import * as Usercontroller from "../controllers/user.controller";
import * as LoginController from "../controllers/login.controller";

import multer from "../libs/multer";
const router = Router();

router.route('/register')
    .post(Usercontroller.registerUser)

router.route('/user/:id')
    .get(Usercontroller.getUser) 

router.route('/login')
    .post(LoginController.login) //MIRAR COMO SE CREAN Y CONSERVAN SESIONES EN NODEJS

router.route('/publications')
    .get(Publicationcontroller.getPublications)
    .post(multer.single('image'),Publicationcontroller.createPublication) //Solo una imagen
    
router.route('/publications/:id')
    .get(Publicationcontroller.getPublication)
    .delete(Publicationcontroller.deletePublication)
    .put(Publicationcontroller.doComment)

router.route('/publications/like/:id')
    .put(Publicationcontroller.doLike)

    
router.route('/publications/gradient/:id')
    .put(Publicationcontroller.gradient)

export default router; 