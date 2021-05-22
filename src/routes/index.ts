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

router.route('/user')
    .get(verifyToken, Usercontroller.getUser)
    .put(verifyToken, Usercontroller.editUser) 

router.route('/login')
    .post(LoginController.login) 
    
router.route('/logout')
    .post(verifyToken, LoginController.logout) 

router.route('/publications')
    .get(verifyToken, Publicationcontroller.getPublications)
    .post(verifyToken, multer.array('image', 2),Publicationcontroller.createPublication) 
    
router.route('/publications/:id')
    .get(verifyToken, Publicationcontroller.getPublication)
    .delete(verifyToken, Publicationcontroller.deletePublication)
    .put(verifyToken,Publicationcontroller.doComment)

router.route('/publications/like/:id/:pos')
    .put(verifyToken, Publicationcontroller.doLike)
    .delete(verifyToken, Publicationcontroller.removeLike)

    
router.route('/publications/gradient/:id')
    .put(verifyToken, Publicationcontroller.gradient)

router.route('/publications/search/:ubi')
    .get(verifyToken, Publicationcontroller.search)

router.route('/profile')
    .get(verifyToken, Usercontroller.getProfile)

router.route('/verify')
    .post(verifyToken, Usercontroller.verify)

router.route('/publications/comment/:id/:pos')
    .delete(verifyToken, Publicationcontroller.deleteComment)

export default router; 