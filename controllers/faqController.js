import FAQ from "../models/FAQ.js";

/* ==========================================================
   PUBLIC FAQs
========================================================== */

export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({
      isActive: true,
    }).sort({
      order: 1,
    });

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    console.error("Get FAQs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs.",
    });
  }
};

/* ==========================================================
   ADMIN FAQs
========================================================== */

export const getAdminFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({
      order: 1,
    });

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs.",
    });
  }
};

/* ==========================================================
   CREATE FAQ
========================================================== */

export const createFAQ = async (req, res) => {
  try {
    const {
      question,
      answer,
      isActive,
    } = req.body;

    const total = await FAQ.countDocuments();

    const faq = await FAQ.create({
      question,
      answer,
      isActive,
      order: total + 1,
    });

    res.status(201).json({
      success: true,
      message: "FAQ created successfully.",
      data: faq,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create FAQ.",
    });
  }
};

/* ==========================================================
   UPDATE FAQ
========================================================== */

export const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    faq.question = req.body.question;
    faq.answer = req.body.answer;
    faq.isActive = req.body.isActive;

    await faq.save();

    res.status(200).json({
      success: true,
      message: "FAQ updated successfully.",
      data: faq,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update FAQ.",
    });
  }
};

/* ==========================================================
   DELETE FAQ
========================================================== */

export const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    await faq.deleteOne();

    const faqs = await FAQ.find().sort({
      order: 1,
    });

    for (let i = 0; i < faqs.length; i++) {
      faqs[i].order = i + 1;
      await faqs[i].save();
    }

    res.status(200).json({
      success: true,
      message: "FAQ deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete FAQ.",
    });
  }
};

/* ==========================================================
   TOGGLE STATUS
========================================================== */

export const toggleFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    faq.isActive = !faq.isActive;

    await faq.save();

    res.status(200).json({
      success: true,
      message: `FAQ ${
        faq.isActive ? "activated" : "deactivated"
      } successfully.`,
      data: faq,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update FAQ status.",
    });
  }
};

/* ==========================================================
   MOVE UP
========================================================== */

export const moveUp = async (req, res) => {
  try {
    const current = await FAQ.findById(req.params.id);

    if (!current) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    const previous = await FAQ.findOne({
      order: current.order - 1,
    });

    if (!previous) {
      return res.status(400).json({
        success: false,
        message: "Already at top.",
      });
    }

    const temp = current.order;

    current.order = previous.order;
    previous.order = temp;

    await current.save();
    await previous.save();

    res.status(200).json({
      success: true,
      message: "FAQ moved up successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to move FAQ.",
    });
  }
};

/* ==========================================================
   MOVE DOWN
========================================================== */

export const moveDown = async (req, res) => {
  try {
    const current = await FAQ.findById(req.params.id);

    if (!current) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    const next = await FAQ.findOne({
      order: current.order + 1,
    });

    if (!next) {
      return res.status(400).json({
        success: false,
        message: "Already at bottom.",
      });
    }

    const temp = current.order;

    current.order = next.order;
    next.order = temp;

    await current.save();
    await next.save();

    res.status(200).json({
      success: true,
      message: "FAQ moved down successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to move FAQ.",
    });
  }
};

/* ==========================================================
   REINDEX
========================================================== */

export const reindexFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({
      order: 1,
      createdAt: 1,
    });

    for (let i = 0; i < faqs.length; i++) {
      faqs[i].order = i + 1;
      await faqs[i].save();
    }

    res.status(200).json({
      success: true,
      message: "FAQ order updated successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to reindex FAQs.",
    });
  }
};