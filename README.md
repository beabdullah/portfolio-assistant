# Riz — Portfolio Chatbot for Abdullah Rizwan

A modern, professional AI chatbot built specifically for [Abdullah Rizwan's portfolio](https://abdullahrizwan-portfolio.netlify.app/).

**Name:** Riz  
**Stack:** Python 3.11 + Flask (backend) · HTML / CSS / JavaScript (frontend) · OpenRouter API  

---

## Features

- Fully customized knowledge of Abdullah’s background, skills, experience, education, services, and contact info
- Clean dark-navy + teal design that matches the portfolio
- Streaming-ready conversation history
- Quick suggestion chips for common questions
- Typing indicator & polished message bubbles
- Easy to run locally in VS Code

---

## Prerequisites

- **Python 3.11.9** (or any 3.11+)
- **VS Code** (recommended)
- An OpenRouter API key (free tier available)

---

## Setup Instructions (VS Code)

### 1. Open the project

```bash
cd portfolio-chatbot
code .
```

### 2. Create a virtual environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Add your OpenRouter API key

1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys) and create a free API key.
2. Copy `.env.example` → `.env`:

```bash
cp .env.example .env
```

3. Open `.env` and paste your key:

```env
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
OPENROUTER_MODEL=openai/gpt-4o-mini
```

> You can change the model to any model available on OpenRouter  
> (e.g. `google/gemini-flash-1.5`, `meta-llama/llama-3.1-8b-instruct`, etc.)

### 5. Run the chatbot

```bash
python backend/app.py
```

Open your browser at: **http://localhost:5000**

---

## Project Structure

```
portfolio-chatbot/
├── backend/
│   └── app.py              # Flask server + OpenRouter integration
├── frontend/
│   ├── index.html          # Chat UI
│   ├── style.css           # Dark + teal theme
│   └── script.js           # Frontend logic
├── .env.example
├── requirements.txt
└── README.md
```

---

## How it works

1. User sends a message from the browser.
2. Frontend POSTs the message + conversation history to `/api/chat`.
3. Backend builds a rich system prompt containing Abdullah’s full portfolio data.
4. The request is sent to OpenRouter (which routes to the chosen LLM).
5. The reply is returned and rendered in the chat UI.

---

## Customization Tips

- **Update knowledge** → Edit the `SYSTEM_PROMPT` string inside `backend/app.py`.
- **Change colors** → Modify the CSS variables in `frontend/style.css` (`--accent`, `--bg`, etc.).
- **Change model** → Update `OPENROUTER_MODEL` in `.env`.
- **Deploy** → You can deploy the Flask app to Render, Railway, or any Python host. Remember to set the `OPENROUTER_API_KEY` environment variable.

---

## Contact (Abdullah Rizwan)

- Email: beabdullah61@gmail.com  
- Phone: +92 322 0689126  
- LinkedIn: [linkedin.com/in/abdullah-rizwan-183a10262](https://linkedin.com/in/abdullah-rizwan-183a10262)  
- Portfolio: [abdullahrizwan-portfolio.netlify.app](https://abdullahrizwan-portfolio.netlify.app/)

---

Made with ❤️ for Abdullah Rizwan’s portfolio.  
**Riz** is ready to answer questions about skills, experience, projects, and more.