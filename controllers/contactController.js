import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Contact from "../models/Contact.js";
import { sendReplyEmail } from "../services/mailService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateReplyTemplate } from "../services/emailTemplate.js";

export const createContact = asyncHandler(

    async (req, res) => {

       const errors = validationResult(req);

if (!errors.isEmpty()) {
  return res.status(400).json({
    success: false,
    message: errors.array({ onlyFirstError: true })[0].msg,
    errors: errors.array(),
  });
}

        const contact = await Contact.create({

            name: req.body.name,

            email: req.body.email,

            phone: req.body.phone,

            orderNumber: req.body.orderNumber,

            country: req.body.country,

            message: req.body.message,

        });

        res.status(201).json({

            success: true,

            message: "Message submitted successfully.",

            data: contact,

        });

    }

);

export const getContacts = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";

    const status = req.query.status || "";

    const filter = {};

    if (search) {

        filter.$or = [

            {
                name: {
                    $regex: search,
                    $options: "i",
                },
            },

            {
                email: {
                    $regex: search,
                    $options: "i",
                },
            },

            {
                phone: {
                    $regex: search,
                    $options: "i",
                },
            },

            {
                orderNumber: {
                    $regex: search,
                    $options: "i",
                },
            },

        ];

    }

    if (status) {

        filter.status = status;

    }

    const [contacts, total] = await Promise.all([

        Contact.find(filter)

            .select("-replyMessage")

            .sort({

                createdAt: -1,

            })

            .skip(skip)

            .limit(limit)

            .lean(),

        Contact.countDocuments(filter),

    ]);

    res.json({

        success: true,

        page,

        limit,

        total,

        totalPages: Math.ceil(total / limit),

        contacts,

    });

});

export const getContactById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(400).json({

            success: false,

            message: "Invalid Contact ID",

        });

    }

    const contact = await Contact.findById(id).lean();

    if (!contact) {

        return res.status(404).json({

            success: false,

            message: "Contact not found",

        });

    }

    res.json({

        success: true,

        contact,

    });

});

export const deleteContact = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(400).json({

            success: false,

            message: "Invalid Contact ID",

        });

    }

    const contact = await Contact.findById(id);

    if (!contact) {

        return res.status(404).json({

            success: false,

            message: "Contact not found",

        });

    }

    await contact.deleteOne();

    res.json({

        success: true,

        message: "Contact deleted successfully",

    });

});

export const replyToContact = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const {

        subject,

        message,

    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(400).json({

            success: false,

            message: "Invalid Contact ID",

        });

    }

    const contact = await Contact.findById(id);

    if (!contact) {

        return res.status(404).json({

            success: false,

            message: "Contact not found",

        });

    }

    if (!subject || !message) {

        return res.status(400).json({

            success: false,

            message: "Subject and message are required.",

        });

    }

    await sendReplyEmail({

        to: contact.email,

        subject,

       html: generateReplyTemplate({

    customerName: contact.name,

    subject,

    replyMessage: message,

})

    });

    contact.status = "Replied";

    contact.replyMessage = message;

    contact.repliedAt = new Date();

    await contact.save();

    res.json({

        success: true,

        message: "Reply sent successfully.",

    });

});