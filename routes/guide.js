const express = require("express");

const router = express.Router();
const { Guide, validateCard } = require("../model/guide");

router.get("/all", async (req, res) => {
  res.json(await Guide.find());
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const guide = await Guide.findById(id);
    if (!guide) {
      return res.status(404).send("Guide Not Found");
    }
    res.json(guide);
  } catch {
    res.status(500).send("error fetching guide");
  }
});

router.post("/", async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const guide = new Guide({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      steps: req.body.steps,
    });

    await guide.save();
    res.send(guide);
  } catch (err) {
    res.status(500).send("Something went wrong while saving the guide.");
  }
});

module.exports = router;
