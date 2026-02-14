# 🎫 API Setup Guide for Career Intelligence Engine

Follow these steps to get your **Free** API keys ready for tomorrow's implementation.

---

### **Part 1: Google Gemini API (The Brain)**
*Provides the AI logic for roadmaps, projects, and career paths.*

1. **Go to**: [aistudio.google.com](https://aistudio.google.com/)
2. **Sign in**: Use any Google/Gmail account.
3. **Get Key**: Click the **"Get API key"** button on the top left sidebar.
4. **Create**: Click **"Create API key in new project"**.
5. **Copy**: Copy the string (it starts with `AIza...`).
6. **Save**: Keep it ready for our `.env` file tomorrow.

---

### **Part 2: Google Custom Search API (The Live Data)**
*Allows the AI to search the web for real 2024-2025 career trends.*

**Step A: Get the API Key**
1. **Go to**: [Google Cloud Console](https://console.cloud.google.com/apis/library/customsearch.googleapis.com)
2. **Select Project**: Create a new project or select an existing one.
3. **Enable**: Click the **"ENABLE"** button for the Custom Search API.
4. **Credentials**: Go to the **"Credentials"** tab on the left.
5. **Create**: Click **"Create Credentials"** -> **"API Key"**.
6. **Copy**: Copy this key (this is your `GOOGLE_SEARCH_API_KEY`).

**Step B: Get the Search Engine ID (CX ID)**
1. **Go to**: [Programmable Search Engine](https://programmablesearchengine.google.com/controlpanel/create)
2. **Name**: Call it "Career Search".
3. **What to Search**: Select **"Search the entire web"**.
4. **Create**: Click Create.
5. **ID**: Look for **"Search engine ID"** (it looks like `a1bc2def3ghijk4`).
6. **Copy**: This is your `GOOGLE_SEARCH_ENGINE_ID`.

---

### **Part 3: Final Checklist for Tomorrow**

Check that you have these 3 values ready:

1.  `GEMINI_API_KEY`: _________________________
2.  `GOOGLE_SEARCH_API_KEY`: ___________________
3.  `GOOGLE_SEARCH_ENGINE_ID`: _________________

---

### **How to verify if it works? (Optional)**
You can test your Gemini key by running this in your terminal:
```bash
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY \
    -H 'Content-Type: application/json' \
    -X POST \
    -d '{
      "contents": [{
        "parts":[{
          "text": "Hello, are you ready for career planning?"
        }]
      }]
    }'
```
