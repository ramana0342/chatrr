import express from "express";
import { handleRegister , handleLogin , handleGetUserProfile } from "../controllers/userRegisterController.js";
import { fetchUsersList , fetchChatMessages } from "../controllers/userChatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { refreshTokenHandler } from "../controllers/refreshTokenHandler.js";
import { handleLogout } from "../controllers/handleLogout.js";

const router = express.Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.get("/search", authMiddleware, fetchUsersList)
router.get("/chat/:receiverId", authMiddleware, fetchChatMessages);
router.post('/refresh-token' , refreshTokenHandler)
router.get('/user-profile' , authMiddleware, handleGetUserProfile)
router.post("/logout", handleLogout);

export default router;