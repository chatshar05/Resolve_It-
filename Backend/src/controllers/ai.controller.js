const { classifyComplaint } = require("../services/ai.service");

async function analyzeComplaint(req, res) {

  try {

    const { description } = req.body;

    const result = await classifyComplaint(description);

    res.json(result);

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "AI failed" });

  }

}

module.exports = { analyzeComplaint };