import { Router } from "express"
import * as authController from "../controllers/authentication-controller"

const router = Router()

router.post("/api/auth/register", authController.createUser)
router.get("/api/auth/profile", authController.getProfile)
router.get("/api/auth/username-exists/:username", authController.isUsernameTaken)
router.get("/api/auth/email-exists/:email", authController.isEmailRegistered)
router.post("/api/auth/login", authController.login)
router.post("/api/auth/logout", authController.logout)

export default router