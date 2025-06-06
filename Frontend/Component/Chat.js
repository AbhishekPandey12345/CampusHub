import envfile from './envimport';
import { GoogleGenerativeAI } from '@google/generative-ai';
const apiKey = envfile.apiKey;
const genAI = new GoogleGenerativeAI(apiKey);
const generationConfig = {
  temperature: 0.4,
  topP: 0.4,
  topK: 64,
  maxOutputTokens: 100,
  responseMimeType: 'text/plain',
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", generationConfig
});
// export async funtion run
let conversationHistory = [];
const MAX_HISTORY = 3;


const updateHistory = (role, message) => {
  conversationHistory.push({ role, parts: [{ text: message }] });
  if (conversationHistory.length > MAX_HISTORY * 2) {
    // *2 because each exchange has user + model messages
    conversationHistory = conversationHistory.slice(-MAX_HISTORY * 2);
  }
};

export const StartChat = async () => {
  // Initialize with just the system prompt
  conversationHistory = [
    {
      role: "model",
      parts: [{ text: prompt }],
    },
  ];
  return "Great to meet you. What would you like to know?";
};


export default async function run(user_input) {
  const chatSession = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          { text: envfile.data },
        ],
      },
      ...conversationHistory,
    ],
  });

  updateHistory("user", user_input);
    // updateHistory("model", response);
   

  const result = await chatSession.sendMessage(user_input);
  console.log(result.response.text());
  return result.response.text();
}
