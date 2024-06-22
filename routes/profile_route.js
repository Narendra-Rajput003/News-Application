import { Router } from "express";

const router = Router();


import {allUsersProfiles,getProfile,updateProfile} from "../controllers/profile_controller.js"
import {authMiddleware} from "../middleware/auth_middleware.js"

router.get("/allusers",allUsersProfiles);
router.get("/get-profile",authMiddleware,getProfile)
router.put("/update-profile",authMiddleware,updateProfile);

export default router;