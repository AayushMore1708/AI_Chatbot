const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

class BardAPI {
  constructor() {
    this.safetySettings = [];
    this.generationConfig = {};
    this.chat = null;
    this.defaultSettings();
  }

  defaultSettings() {
    const generationConfig = {
      temperature: 0.5,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      }
    ];

    this.setResponseGenerationConfig(generationConfig);
    this.setSafetySettings(safetySettings);
  }

  setResponseGenerationConfig(generationConfig = null) {
    if (generationConfig) {
      this.generationConfig = generationConfig;
    }
  }

  setSafetySettings(safetySettings = null) {
    if (safetySettings) {
      this.safetySettings = safetySettings;
    }
  }

  async initializeChat(apiKey) {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.chat = await model.startChat({
      generationConfig: this.generationConfig,
      safetySettings: this.safetySettings,
    });
  }

  async getBardResponse(input) {
    let bardAnswer = { response: {}, text: '' };
    try {
      const result = await this.chat.sendMessage(input);
      const response = result.response;
      bardAnswer.response = response;
      bardAnswer.text = response.text();
    } catch (error) {
      bardAnswer.response = error.response || {};
      bardAnswer.text = error.message;
    }
    return bardAnswer;
  }
}

module.exports = BardAPI;
