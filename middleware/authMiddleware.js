import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const authenticate = async (

    req,

    res,

    next

) => {

    try {

        const token = req.cookies.accessToken;

        if (!token) {

            return res.status(401).json({

                success: false,

                message: "Unauthorized.",

            });

        }

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        const user = await User.findById(decoded.id)
            .populate({
                path: "wishlist",
                match: {
                    status: true,
                },
            })
            .select(
                "-password -emailVerificationOTP -passwordResetOTP"
            );

        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Unauthorized.",

            });

        }
        if (user.isBlocked) {

            return res.status(403).json({

                success: false,

                message: "Your account has been blocked."

            });

        }

        if (!user.emailVerified) {

            return res.status(403).json({

                success: false,

                message: "Please verify your email."

            });

        }
        req.user = user;

        next();

    } catch (error) {

        console.error(error);

        return res.status(401).json({

            success: false,

            message: "Invalid or expired token."

        });

    }

};

export const getMe = async (

    req,

    res

) => {

    return res.json({

        success: true,

        user: {

            id: req.user._id,

            name: req.user.name,

            email: req.user.email,

            role: req.user.role,

            phone: req.user.phone,

            avatar: req.user.avatar,

            addresses: req.user.addresses,
            
            wishlist: req.user.wishlist,

            emailVerified: req.user.emailVerified
        }

    });

};

export const authorize = (...roles) => {

    return (

        req,

        res,

        next

    ) => {

        if (

            !roles.includes(

                req.user.role

            )

        ) {

            return res.status(403).json({

                success: false,

                message: "Forbidden."

            });

        }

        next();

    };

};