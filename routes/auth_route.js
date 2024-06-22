import { Router } from "express";

const router = Router();

import {signUp,login,sendEmail} from "../controllers/auth_controller.js"

router.post("/signup",signUp);
router.post("/login",login);
router.get("/sendEmail",sendEmail);




export default router;