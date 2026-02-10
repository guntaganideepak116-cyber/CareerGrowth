require(\"dotenv\").config();
const { GoogleGenerativeAI } = require(\"@google/generative-ai\");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
(async () => {
  try {
    const model = genAI.getGenerativeModel({ model: \"gemini-1.5-flash\" });
    const result = await model.generateContent(\"Say hello world\");
    console.log(\"SUCCESS:\", result.response.text());
  } catch(e) {
    console.error(\"Error:\", e.message);
  } finally {
    process.exit(0);
  }
})();
