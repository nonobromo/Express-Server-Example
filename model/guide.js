const mongoose = require("mongoose");
const Joi = require("joi");

const guideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 1024,
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 1024,
  },
  category: {
    type: [
      {
        type: String,
        enum: ["Internet", "Printers", "Word", "Excel", "Outlook", "Misc"],
        required: true,
      },
    ],
    required: true,
  },
  steps: {
    type: [
      {
        text: { type: String, required: true, minlength: 5 },
        image: { type: String, required: false },
      },
    ],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
});
const Guide = mongoose.model("Guide", guideSchema, "guides");

function validateCard(guide) {
  const schema = Joi.object({
    title: Joi.string().min(20).max(1024).required(),
    description: Joi.string().min(20).max(1024).required(),
    category: Joi.array()
      .items(
        Joi.string().valid(
          "Internet",
          "Printers",
          "Word",
          "Excel",
          "Outlook",
          "Misc"
        )
      )
      .min(1)
      .required(),
    steps: Joi.array()
      .items(
        Joi.object({
          text: Joi.string().min(5).required(),
          image: Joi.string().uri().optional(),
        })
      )
      .min(2)
      .required(),
  });

  return schema.validate(guide);
}

module.exports = { Guide, validateCard };
