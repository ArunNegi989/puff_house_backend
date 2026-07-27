import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { validationResult } from "express-validator";
export const getProfile = async (req, res) => {
    try {
        const profile = await User.findById(req.user._id).select("-password");

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully.",
            profile,
        });
    } catch (error) {
        console.error("Get Profile Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while fetching your profile. Please try again later.",
        });
    }
};

export const updateProfile = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Please correct the validation errors.",
            errors: errors.array(),
        });
    }

    try {
        const {
            name,
            phone,
            avatar,
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }

        if (
            typeof name === "string" &&
            name.trim()
        ) {
            user.name = name.trim();
        }

        if (
            typeof phone === "string"
        ) {
            user.phone = phone.trim();
        }

        if (
            typeof avatar === "string"
        ) {
            user.avatar = avatar;
        }

        await user.save();

        if (user.phone) {
            await Notification.deleteMany({
                user: user._id,
                type: "profile",
            });
        }

        const updatedUser = await User.findById(user._id).select("-password");

        return res.status(200).json({
            success: true,
            message:
                "Your profile has been updated successfully.",
            profile: updatedUser,
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while updating your profile. Please try again later.",
        });
    }
};