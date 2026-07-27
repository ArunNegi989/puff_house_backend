import User from "../models/User.js";

import { validationResult } from "express-validator";

import jwt from "jsonwebtoken";

import crypto from "crypto";

import {
    hashPassword,
    comparePassword,
} from "../utils/password.js";

import {
    generateOTP,
} from "../utils/generateOTP.js";

import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/generateToken.js"

import {
    getCookieOptions,
} from "../utils/cookieOptions.js";

import {
    sendReplyEmail,
} from "../services/mailService.js";

import {
    generateVerifyEmailTemplate,
} from "../services/verifyEmailTemplate.js";

import {
    notifyWelcome,
    notifyProfileIncomplete,
    notifyAddressMissing,
    notifyPasswordChanged,
    notifyOrderPlaced
} from "../utils/notificationService.js";
import { generateForgotPasswordTemplate } from "../services/forgotPassword.js";

export const signup = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Please correct the validation errors.",
                errors: errors.array(),
            });
        }

        const { name, email, password, postalCode } = req.body;

        const hashedPassword = await hashPassword(password);

        const otp = generateOTP();

        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        const existingUser = await User.findOne({
            email,
        }).select("_id name email emailVerified");

        if (existingUser) {
            if (existingUser.emailVerified) {
                return res.status(409).json({
                    success: false,
                    message:
                        "An account with this email already exists. Please login or use Forgot Password.",
                });
            }

            existingUser.name = name;
            existingUser.password = hashedPassword;
            existingUser.emailVerificationOTP = otp;
            existingUser.emailVerificationOTPExpires = otpExpiry;
            existingUser.addresses = [
                {
                    postalCode,
                    isDefault: true,
                },
            ];
            await existingUser.save();

            await sendReplyEmail({
                to: email,
                subject: "Verify Your Email - Puff House",
                html: generateVerifyEmailTemplate({
                    name,
                    otp,
                }),
            });

            return res.status(200).json({
                success: true,
                message:
                    "A new verification OTP has been sent to your registered email address. The OTP will expire in 10 minutes.",
            });
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            emailVerificationOTP: otp,
            emailVerificationOTPExpires: otpExpiry,
            addresses: [
                {
                    postalCode,
                    isDefault: true,
                },
            ],
        });

        await sendReplyEmail({
            to: email,
            subject: "Verify Your Email - Puff House",
            html: generateVerifyEmailTemplate({
                name,
                otp,
            }),
        });

        await notifyWelcome(user._id);

        return res.status(201).json({
            success: true,
            message:
                "Account created successfully. Please verify your email using the OTP sent to your registered email address. The OTP will expire in 10 minutes.",
        });
    } catch (error) {
        console.error("Signup Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while creating your account. Please try again later.",
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email address.",
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message: "Your email address has already been verified. Please login to continue.",
            });
        }

        if (!user.emailVerificationOTP) {
            return res.status(400).json({
                success: false,
                message: "Verification OTP not found. Please request a new OTP.",
            });
        }

        if (user.emailVerificationOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: "The OTP you entered is incorrect. Please try again.",
            });
        }

        if (user.emailVerificationOTPExpires < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Your OTP has expired. Please request a new verification OTP.",
            });
        }

        user.emailVerified = true;
        user.emailVerificationOTP = undefined;
        user.emailVerificationOTPExpires = undefined;

        await user.save();

        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user, false);

        res.cookie("accessToken", accessToken, {
            ...getCookieOptions(false),
            maxAge: 15 * 60 * 1000,
        });

        res.cookie(
            "refreshToken",
            refreshToken,
            getCookieOptions(false)
        );

        return res.status(200).json({
            success: true,
            message:
                "Your email has been verified successfully. Welcome to Puff House!",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
            },
        });
    } catch (error) {
        console.error("Verify Email Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while verifying your email. Please try again later.",
        });
    }
};

export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email address.",
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message:
                    "Your email has already been verified. Please login to continue.",
            });
        }

        const otp = generateOTP();

        user.emailVerificationOTP = otp;
        user.emailVerificationOTPExpires = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await user.save();

        await sendReplyEmail({
            to: email,
            subject: "New Verification OTP - Puff House",
            html: generateVerifyEmailTemplate({
                name: user.name,
                otp,
            }),
        });

        return res.status(200).json({
            success: true,
            message:
                "A new verification OTP has been sent to your registered email address. The OTP will expire in 10 minutes.",
        });
    } catch (error) {
        console.error("Resend OTP Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while sending the verification OTP. Please try again later.",
        });
    }
};


export const login = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Please correct the validation errors.",
                errors: errors.array(),
            });
        }

        const {
            email,
            password,
            rememberMe,
        } = req.body;

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account has been blocked. Please contact the administrator.",
            });
        }

        if (
            user.lockUntil &&
            user.lockUntil > new Date()
        ) {
            const remainingMs =
                user.lockUntil.getTime() - Date.now();

            const minutes = Math.floor(
                remainingMs / 60000
            );

            const seconds = Math.floor(
                (remainingMs % 60000) / 1000
            );

            return res.status(429).json({
                success: false,
                message: `Your account is temporarily locked due to multiple failed login attempts. Please try again in ${minutes} minute${minutes !== 1 ? "s" : ""} ${seconds} second${seconds !== 1 ? "s" : ""}.`,
            });
        }

        if (!user.emailVerified) {
            return res.status(403).json({
                success: false,
                message:
                    "Please verify your email address before logging in.",
            });
        }

        const matched = await comparePassword(
            password,
            user.password
        );

        if (!matched) {
            user.loginAttempts += 1;

            const MAX_ATTEMPTS = 3;
            const remainingAttempts =
                MAX_ATTEMPTS - user.loginAttempts;

            if (user.loginAttempts >= MAX_ATTEMPTS) {
                user.lockUntil = new Date(
                    Date.now() + 15 * 60 * 1000
                );

                await user.save();

                return res.status(429).json({
                    success: false,
                    message:
                        "Your account has been temporarily locked for 15 minutes due to multiple failed login attempts.",
                });
            }

            await user.save();

            return res.status(401).json({
                success: false,
                message:
                    remainingAttempts === 1
                        ? "Invalid password. This is your last login attempt before your account is temporarily locked."
                        : `Invalid password. You have ${remainingAttempts} login attempts remaining.`,
            });
        }

        if (!user.phone) {
            await notifyProfileIncomplete(
                user._id
            );
        }

        user.loginAttempts = 0;
        user.lockUntil = null;
        user.lastLogin = new Date();

        await user.save();

        const accessToken =
            generateAccessToken(user);

        const refreshToken =
            generateRefreshToken(
                user,
                rememberMe
            );

        res.cookie(
            "accessToken",
            accessToken,
            {
                ...getCookieOptions(false),
                maxAge: 15 * 60 * 1000,
            }
        );

        res.cookie(
            "refreshToken",
            refreshToken,
            getCookieOptions(rememberMe)
        );

        return res.json({
            success: true,
            message: `Welcome back, ${user.name}! Login successful.`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
                phone: user.phone,
                avatar: user.avatar,
                addresses: user.addresses,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while logging in. Please try again later.",
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    } catch (error) {
        console.error("Logout Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while logging out. Please try again later.",
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please enter your registered email address.",
            });
        }

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "No account found with this email address.",
            });
        }

        if (!user.emailVerified) {
            return res.status(400).json({
                success: false,
                message:
                    "Please verify your email address before resetting your password.",
            });
        }

        const otp = generateOTP();

        user.passwordResetOTP = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        user.passwordResetOTPExpires = new Date(
            Date.now() + 1000 * 60 * 10
        );

        await user.save();

        await sendReplyEmail({
            to: user.email,
            subject: "Reset Your Password",
            html: generateForgotPasswordTemplate({
                name: user.name,
                otp,
            }),
        });

        return res.status(200).json({
            success: true,
            message:
                "A password reset OTP has been sent to your registered email address. The OTP will expire in 10 minutes.",
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while processing your request. Please try again later.",
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const {
            email,
            otp,
            password,
        } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email, OTP and new password are required.",
            });
        }

        const hashedOTP = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        const user = await User.findOne({
            email,
            passwordResetOTP: hashedOTP,
            passwordResetOTPExpires: {
                $gt: new Date(),
            },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message:
                    "The OTP is invalid or has expired. Please request a new password reset OTP.",
            });
        }

        user.password = await hashPassword(password);

        user.passwordResetOTP = undefined;
        user.passwordResetOTPExpires = undefined;

        await user.save();

        await notifyPasswordChanged(user._id);

        return res.status(200).json({
            success: true,
            message:
                "Your password has been changed successfully. Please login using your new password.",
        });
    } catch (error) {
        console.error("Reset Password Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while resetting your password. Please try again later.",
        });
    }
};
export const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required.",
            });
        }

        const hashedOTP = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        const user = await User.findOne({
            email,
            passwordResetOTP: hashedOTP,
            passwordResetOTPExpires: {
                $gt: new Date(),
            },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message:
                    "The OTP is invalid or has expired. Please request a new password reset OTP.",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "OTP verified successfully. You can now create your new password.",
        });
    } catch (error) {
        console.error("Verify Reset OTP Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while verifying the OTP. Please try again later.",
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            currentPassword,
            newPassword,
            confirmPassword,
        } = req.body;

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "All password fields are required.",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password and confirm password do not match.",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const isMatched =
            await comparePassword(
                currentPassword,
                user.password
            );

        if (!isMatched) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password is incorrect.",
            });
        }

        const samePassword =
            await comparePassword(
                newPassword,
                user.password
            );

        if (samePassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password cannot be the same as your current password.",
            });
        }

        user.password =
            await hashPassword(newPassword);

        await user.save();

        await notifyPasswordChanged(user._id);

        return res.status(200).json({
            success: true,
            message:
                "Password changed successfully.",
        });
    } catch (error) {
        console.error(
            "Change Password Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while changing password.",
        });
    }
};


export const refreshAccessToken = async (req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing.",
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        const accessToken = generateAccessToken(user);

        res.cookie(
            "accessToken",
            accessToken,
            {
                ...getCookieOptions(false),
                maxAge: 15 * 60 * 1000,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Access token refreshed.",
        });

    } catch (err) {

        return res.status(401).json({
            success: false,
            message: "Refresh token expired.",
        });

    }
};


export const checkEmail = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
                errors: errors.array(),
            });
        }

        const { email } = req.body;

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim(),
        }).select("_id email emailVerified");

        if (!existingUser) {
            return res.status(200).json({
                success: true,
                exists: false,
                verified: false,
                message: "Email is available.",
            });
        }

        if (existingUser.emailVerified) {
            return res.status(200).json({
                success: true,
                exists: true,
                verified: true,
                message: "An account with this email already exists.",
            });
        }

        return res.status(200).json({
            success: true,
            exists: true,
            verified: false,
            message:
                "An account exists but the email is not verified. Continue to verify your account.",
        });
    } catch (error) {
        console.error("Check Email Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while checking the email.",
        });
    }
};