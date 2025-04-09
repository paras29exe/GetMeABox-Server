import { Router } from "express";
import { loginUser, signupUser, autoLogin, logoutUser, checkExistence, changePassword } from "../controllers/authController.js";
import verifyUser from "../middleware/auth.middleware.js";

const router = Router()

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.post("/auto-login", verifyUser, autoLogin);

router.post("/change-password", verifyUser, changePassword);

router.post("/logout", verifyUser, logoutUser);

router.post("/check-email-existence", checkExistence)

export default router;