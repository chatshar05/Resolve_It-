const express = require("express");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate-letter", async (req,res)=>{

try{

const { studentName, complaintId, category, location, description } = req.body;

const prompt = `
Generate a professional acknowledgement letter.

Header: Resolve It Portal

Student Name: ${studentName}
Complaint ID: ${complaintId}
Category: ${category}
Location: ${location}
Issue: ${description}

Requirements:
- Professional tone
- Confirm complaint received
- Mention action will be taken soon
- Closing from Resolve It Support Team
`;

const response = await openai.chat.completions.create({
model:"gpt-4o-mini",
messages:[
{
role:"user",
content:prompt
}
]
});

const letter = response.choices[0].message.content;

res.json({letter});

}catch(err){

console.log(err);
res.status(500).json({message:"AI generation failed"});

}

});

app.listen(6000,()=>{
console.log("Gen AI service running on port 6000");
});