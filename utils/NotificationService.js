import Notification from "../models/Notification.js";

export const createNotification = async ({
    user,
    title,
    message,
    type = "general",
    icon = "bell",
    priority = "medium",
    redirectUrl = "/",
    expiresAt = null,
}) => {

    const exists = await Notification.findOne({

        user,

        title,

        isRead: false,

    });

    if (exists) {

        return exists;

    }

    return Notification.create({

        user,

        title,

        message,

        type,

        icon,

        priority,

        redirectUrl,

        expiresAt,

    });

};

export const notifyWelcome = async (
    userId
) => {

    return createNotification({

        user: userId,

        title: "Welcome to Puff House 👋",

        message:
            "Your account has been created successfully.",

        type: "general",

        icon: "party",

        priority: "low",

        redirectUrl: "/",

    });

};

export const notifyProfileIncomplete =
    async (
        userId
    ) => {

        return createNotification({

            user: userId,

            title: "Complete Your Profile",

            message:
                "Add your phone number to personalize your account.",

            type: "profile",

            icon: "user",

            priority: "high",

            redirectUrl: "/account/profile",

        });

    };

export const notifyAddressMissing =
    async (
        userId
    ) => {

        return createNotification({

            user: userId,

            title: "Add Delivery Address",

            message:
                "Save your address for faster checkout.",

            type: "address",

            icon: "map-pin",

            priority: "high",

            redirectUrl: "/account/address",

        });

    };

export const notifyPasswordChanged =
    async (
        userId
    ) => {

        return createNotification({

            user: userId,

            title: "Password Updated",

            message:
                "Your password has been changed successfully.",

            type: "security",

            icon: "shield",

            priority: "medium",

            redirectUrl: "/account/settings",

        });

    };


export const notifyNewLogin =
    async (
        userId
    ) => {

        return createNotification({

            user: userId,

            title: "New Login",

            message:
                "A new login to your account was detected.",

            type: "security",

            icon: "shield",

            priority: "medium",

            redirectUrl: "/account/settings",

        });

    };

export const notifyOrderPlaced =
    async (
        userId,
        orderId
    ) => {

        return createNotification({

            user: userId,

            title: "Order Confirmed",

            message:
                "Your order has been placed successfully.",

            type: "order",

            icon: "package",

            priority: "medium",

            redirectUrl: `/account/orders/${orderId}`,

        });

    };

export const notifyOrderShipped =
    async (
        userId,
        orderId
    ) => {

        return createNotification({

            user: userId,

            title: "Order Shipped",

            message:
                "Your package is on the way.",

            type: "order",

            icon: "truck",

            priority: "medium",

            redirectUrl: `/account/orders/${orderId}`,

        });

    };

export const notifyReward =
    async (
        userId
    ) => {

        return createNotification({

            user: userId,

            title: "Reward Earned",

            message:
                "You've earned new reward points.",

            type: "reward",

            icon: "gift",

            priority: "low",

            redirectUrl: "/account/rewards",

        });

    };

export const notifyPromotion =
    async (
        userId,
        title,
        message
    ) => {

        return createNotification({

            user: userId,

            title,

            message,

            type: "promotion",

            icon: "megaphone",

            priority: "low",

            redirectUrl: "/",

            expiresAt:
                new Date(

                    Date.now() +

                    1000 * 60 * 60 * 24 * 7

                ),

        });

    };