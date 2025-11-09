
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT_TEMPLATE = (topic: string) => `
You are a relationship counselor AI. Your task is to create a practice conversation script for a couple using the Speaker-Listener Technique.

The topic for the conversation is: "${topic}".

The couple's names are Partner A and Partner B.

Please generate a script that follows these rules precisely:
1.  The conversation should have two full rounds.
2.  Each round MUST consist of exactly four conversation turns.

3.  **Round 1:** Partner A is the Speaker, and Partner B is the Listener.
    * **Turn 1 - Partner A (Speaker):** Starts by sharing their thoughts and feelings about the topic. This should be a few sentences long.
    * **Turn 2 - Partner B (Listener):** Responds by reflecting *only* what they heard, for example: "So, what I'm hearing you say is...". They must not add their own opinions or questions.
    * **Turn 3 - Partner A (Speaker):** Clarifies with, for example: "That's close, but what I really meant was...".
    * **Turn 4 - Partner B (Listener):** Acknowledges the Speaker's clarification. The Listener must reflect the new clarification, for example: "Okay, thanks for clarifying, what I'm hearing you say *now* is..."

4.  **Round 2:** The roles switch. Partner B is the Speaker, and Partner A is the Listener.
    * **Turn 5 - Partner B (Speaker):** Shares their thoughts and feelings on the topic. This should also be a few sentences long.
    * **Turn 6 - Partner A (Listener):** Responds by reflecting *only* what they heard, for example: "What I heard you say is...".
    * **Turn 7 - Partner B (Speaker):** Clarifies with, for example: "That's close, but what I really meant was...".
    * **Turn 8 - Partner A (Listener):** Acknowledges the Speaker's clarification. The Listener must reflect the new clarification, for example: "Okay, thanks for clarifying, what I'm hearing you say *now* is..."

Please make the conversation feel natural, empathetic, and constructive. The goal is for the couple to practice the technique, not solve the issue within this script.

Format the output as plain text. Clearly label each person's turn (e.g., "Partner A (Speaker):"). Do not include any introductory or concluding text outside of the script itself.
`;


export const generateScript = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: PROMPT_TEMPLATE(topic),
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating script from Gemini:", error);
    throw new Error("Failed to generate the conversation script. Please try again.");
  }
};
