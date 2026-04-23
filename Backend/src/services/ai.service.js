const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function classifyComplaint(description) {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are an AI system that classifies college complaints.

Categories:
wifi
hostel
electricity
classroom
other

Priority levels:
severe
moderate
medium

Return ONLY JSON:

{
 "category": "",
 "priority": ""
}

Complaint:
${description}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini Response:", text);

    const match = text.match(/\{[\s\S]*\}/);

    if (match) {
      return JSON.parse(match[0]);
    }

    return { category: "other", priority: "medium" };

  } catch (err) {
    console.error("Gemini FULL ERROR:", err);
    return { category: "other", priority: "medium" };
  }
}

module.exports = { classifyComplaint };