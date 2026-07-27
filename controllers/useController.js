import User from "../models/User.js";

/* ======================================
ADMIN DASHBOARD
====================================== */

export const dashboard = async (req, res) => {

    try {

        const [

            totalUsers,

            verifiedUsers,

            blockedUsers,

            admins,

        ] = await Promise.all([

            User.countDocuments(),

            User.countDocuments({

                emailVerified: true,

            }),

            User.countDocuments({

                isBlocked: true,

            }),

            User.countDocuments({

                role: "admin",

            }),

        ]);

        return res.status(200).json({

            success: true,

            data: {

                totalUsers,

                verifiedUsers,

                blockedUsers,

                admins,

            },

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }

};


/* ======================================
USER PROFILE
====================================== */

export const profile = async (req, res) => {

    try {

        const user = await User.findById(

            req.user._id

        ).select(

            "-password -emailVerificationOTP -passwordResetOTP"

        );

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found.",

            });

        }

        return res.status(200).json({

            success: true,

            user,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }

};