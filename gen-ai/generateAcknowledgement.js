const openai = require("./openaiClient");

async function generateAcknowledgement(data){

const prompt = `
Generate an acknowledgement letter from the Resolve It Portal.

Student Name: ${data.studentName}
Complaint ID: ${data.complaintId}
Category: ${data.category}
Location: ${data.location}
Issue: ${data.description}

Confirm the complaint has been received and action will be taken soon.
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

return response.choices[0].message.content;

}

module.exports = generateAcknowledgement;