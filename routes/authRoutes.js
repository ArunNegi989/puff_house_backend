import express from "express";
import crypto from "crypto";

import {
    generateForgotPasswordTemplate,
} from "../services/forgotPassword.js";

import {
    notifyPasswordChanged,
} from "../utils/notificationService.js";
import {  signup,  verifyEmail,  resendOTP, login, logout,forgotPassword, verifyResetOTP 
    , resetPassword,changePassword,refreshAccessToken,
    checkEmail
} from "../controllers/authController.js";

import {  loginValidation, signupValidation } from "../validators/authValidator.js";
import { authenticate,authorize, getMe } from "../middleware/authMiddleware.js";
import { loginLimiter, signupLimiter, otpLimiter, forgotPasswordLimiter } from "../middleware/rateLimiter.js";
import { dashboard, profile } from "../controllers/useController.js";
import { checkEmailValidation } from "../validators/checkEmailValidation.js";


const router = express.Router();

router.post( "/signup", signupLimiter, signupValidation, signup );

router.post("/verify-email",otpLimiter,verifyEmail);

router.post("/resend-otp",otpLimiter,resendOTP);

router.post("/forgot-password",forgotPasswordLimiter,forgotPassword);

router.post("/verify-reset-otp",otpLimiter,verifyResetOTP);

router.post("/reset-password",otpLimiter,resetPassword);

router.patch("/change-password", authenticate, changePassword);

router.post("/login",loginLimiter,loginValidation,login);

router.post("/logout",logout);

router.get("/me",authenticate,getMe);

router.post("/refresh-token", refreshAccessToken);

router.post("/check-email", checkEmailValidation, checkEmail);

export default router;