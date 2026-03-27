import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export function isOpenAIConfigured(): boolean {
  return (
    !!process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY !== "your-openai-api-key-here"
  );
}

export const SCENARIOS = {
  "free-chat": {
    name: "Free Chat",
    description: "Practice everyday English conversation on any topic",
    systemPrompt:
      "You are a friendly English conversation partner. Respond naturally and help the user practice English. Ask follow-up questions to keep the conversation going.",
    icon: "MessageCircle",
  },
  restaurant: {
    name: "At a Restaurant",
    description: "Order food, ask about the menu, and interact with a waiter",
    systemPrompt:
      "You are a waiter at an English restaurant. Greet the customer warmly, present the menu, take their order, and make recommendations. Stay in character throughout the conversation.",
    icon: "UtensilsCrossed",
  },
  "job-interview": {
    name: "Job Interview",
    description: "Practice answering common interview questions professionally",
    systemPrompt:
      "You are an interviewer conducting a job interview in English. Start by introducing yourself and the company, then ask relevant interview questions. Provide brief feedback on answers when appropriate.",
    icon: "Briefcase",
  },
  airport: {
    name: "At the Airport",
    description: "Navigate check-in, security, and boarding conversations",
    systemPrompt:
      "You are an airport staff member helping a traveler. Help them with check-in, security questions, gate information, and boarding. Stay in character as airport personnel.",
    icon: "Plane",
  },
  shopping: {
    name: "Shopping",
    description: "Ask about products, sizes, prices, and make purchases",
    systemPrompt:
      "You are a helpful shop assistant in a clothing store. Help the customer find items, discuss sizes, colors, prices, and handle payment. Stay friendly and in character.",
    icon: "ShoppingBag",
  },
  "doctor-visit": {
    name: "Doctor's Visit",
    description: "Describe symptoms and understand medical advice",
    systemPrompt:
      "You are a doctor at a medical clinic. Ask the patient about their symptoms, provide a simple diagnosis, and give advice. Use clear medical terms with explanations. Stay in character.",
    icon: "Heart",
  },
} as const;

export type ScenarioKey = keyof typeof SCENARIOS;

const LEVEL_INSTRUCTIONS: Record<string, string> = {
  beginner:
    "Use simple vocabulary and short sentences. Avoid idioms and complex grammar. Speak slowly and clearly. If the user makes mistakes, gently correct them.",
  intermediate:
    "Use moderately complex language. Include some idioms occasionally. Use a mix of simple and compound sentences. Provide gentle corrections when needed.",
  advanced:
    "Use sophisticated vocabulary. Use idioms and complex sentence structures freely. Challenge the user with nuanced expressions. Correct subtle grammar issues.",
};

export function buildSystemPrompt(
  scenario: string | null,
  level: string
): string {
  const scenarioConfig = scenario
    ? SCENARIOS[scenario as ScenarioKey]
    : SCENARIOS["free-chat"];
  const base = scenarioConfig?.systemPrompt ?? SCENARIOS["free-chat"].systemPrompt;
  const levelInstr = LEVEL_INSTRUCTIONS[level] ?? LEVEL_INSTRUCTIONS.intermediate;

  return `${base}\n\nLanguage level: ${level}. ${levelInstr}\n\nIMPORTANT: Always respond in English. Keep responses concise (2-4 sentences typically). If the user writes in another language, gently encourage them to use English.`;
}

const MOCK_RESPONSES: Record<string, string[]> = {
  "free-chat": [
    "That's really interesting! Could you tell me more about that?",
    "I see what you mean. What do you think about it?",
    "Great point! Have you always felt that way?",
    "That sounds wonderful! How did you get into that?",
    "I'd love to hear more. What happened next?",
  ],
  restaurant: [
    "Excellent choice! Would you like anything to drink with that?",
    "That's one of our most popular dishes. Would you like it mild or spicy?",
    "Welcome! Can I start you off with something to drink?",
    "Would you like to see our dessert menu?",
    "Your order will be ready in about 15 minutes. Can I get you anything else?",
  ],
  "job-interview": [
    "That's a great answer. Can you give me a specific example of when you demonstrated that skill?",
    "Interesting. What would you say is your greatest professional achievement?",
    "Tell me about a time when you faced a challenge at work. How did you handle it?",
    "Where do you see yourself in five years?",
    "What attracted you to this position specifically?",
  ],
  airport: [
    "May I see your passport and boarding pass, please?",
    "Your flight is departing from Gate B12. Boarding begins in 30 minutes.",
    "Do you have any liquids in your carry-on bag?",
    "The flight has been delayed by approximately 45 minutes. We apologize for the inconvenience.",
    "Would you like a window seat or an aisle seat?",
  ],
  shopping: [
    "This comes in three colors: blue, red, and black. Which would you prefer?",
    "We have that in stock. Would you like to try it on?",
    "That's currently on sale - 20% off! Would you like me to hold it for you?",
    "The fitting rooms are just to the right. Let me know if you need a different size.",
    "Will that be cash or card today?",
  ],
  "doctor-visit": [
    "I see. How long have you been experiencing these symptoms?",
    "Have you taken any medication for this?",
    "Let me check your temperature and blood pressure. Please sit still for a moment.",
    "Based on your symptoms, it seems like a mild cold. I'd recommend rest and plenty of fluids.",
    "I'll prescribe some medication. Take it twice a day after meals for five days.",
  ],
};

export function getMockResponse(scenario: string | null): string {
  const key = scenario && scenario in MOCK_RESPONSES ? scenario : "free-chat";
  const responses = MOCK_RESPONSES[key]!;
  return responses[Math.floor(Math.random() * responses.length)]!;
}

export function getMockCorrections(
  content: string
): { correctedContent: string; corrections: Array<{ original: string; corrected: string; explanation: string }> } | null {
  const corrections: Array<{ original: string; corrected: string; explanation: string }> = [];
  let corrected = content;

  const words = content.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    if (words[i] === "i" && (i === 0 || /[.!?]$/.test(words[i - 1] ?? ""))) {
      continue;
    }
    if (words[i] === "i") {
      corrections.push({
        original: "i",
        corrected: "I",
        explanation: 'The pronoun "I" should always be capitalized in English.',
      });
      corrected = corrected.replace(/\bi\b/, "I");
    }
  }

  if (content.length > 0 && /^[a-z]/.test(content)) {
    const firstChar = content[0]!;
    const upper = firstChar.toUpperCase();
    if (firstChar !== upper) {
      corrections.push({
        original: firstChar,
        corrected: upper,
        explanation: "Sentences should start with a capital letter.",
      });
      corrected = upper + corrected.slice(1);
    }
  }

  if (
    content.length > 3 &&
    !/[.!?]$/.test(content.trim())
  ) {
    corrections.push({
      original: content.trim(),
      corrected: content.trim() + ".",
      explanation:
        "Sentences should end with proper punctuation (period, question mark, or exclamation mark).",
    });
    corrected = corrected.trim() + ".";
  }

  if (corrections.length === 0) return null;

  return { correctedContent: corrected, corrections };
}
