import rateLimit from "express-rate-limit";

/* ==========================
LOGIN
========================== */

export const loginLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 5,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        message:
            "Too many login attempts. Please try again after 15 minutes.",

    },

});


/* ==========================
SIGNUP
========================== */

export const signupLimiter = rateLimit({

    windowMs: 60 * 60 * 1000,

    max: 5,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        message:
            "Too many signup attempts. Please try again later.",

    },

});


/* ==========================
VERIFY OTP
========================== */

export const otpLimiter = rateLimit({

    windowMs: 10 * 60 * 1000,

    max: 10,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        message:
            "Too many OTP attempts. Please wait 10 minutes.",

    },

});


/* ==========================
FORGOT PASSWORD
========================== */

export const forgotPasswordLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 3,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        message:
            "Too many password reset requests. Please try again later.",

    },

});