import express from "express"
import { checkAuth, login, signup, updateProfile, logout } from "../controllers/userController.js"
import { protectRoute } from "../middleware/auth.js"
import { validate } from "../middleware/validate.js"
import { signupSchema, loginSchema } from "../schemas/userSchema.js"

const userRouter = express.Router();

userRouter.post("/signup", validate(signupSchema), signup)
userRouter.post("/login", validate(loginSchema), login)
userRouter.post("/logout" ,logout)
userRouter.put("/update-profile" , protectRoute , updateProfile)
userRouter.get("/check",protectRoute , checkAuth)

export default userRouter;