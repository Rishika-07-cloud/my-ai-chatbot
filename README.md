
# 🤖 My AI Chatbot

A modern, responsive AI chatbot built using HTML, CSS, JavaScript, Node.js, Express, and the Groq API.

This project allows users to interact with an AI assistant through a clean and user-friendly chat interface.

## ✨ Features

- Real-time AI responses using Groq API
- Interactive chatbot interface
- Conversation context and follow-up questions
- Typing indicator while the AI generates a response
- Markdown formatting for AI replies, including lists, code blocks, tables, links, and blockquotes
- New Chat functionality
- Responsive design
- Secure API key handling using environment variables

## 🛠️ Technologies Used

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js

**AI Integration**
- Groq API
- Groq JavaScript SDK

**Other Tools**
- dotenv
- npm
- Git and GitHub

## 📁 Project Structure

```text
AI-Chatbot/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project folder

```bash
cd AI-Chatbot
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure your Groq API key

Create a `.env` file in the main project folder.

Copy the content from `.env.example` into `.env`.

Replace the placeholder with your own Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

**Important:** Never share or upload your actual API key.

### 5. Start the application

```bash
node server.js
```

### 6. Open the chatbot

Visit:

http://localhost:3000

## ▲ Deploy to Vercel

1. Push this project to GitHub.
2. Import the GitHub repository at [vercel.com/new](https://vercel.com/new).
3. Add `GROQ_API_KEY` as an Environment Variable in the Vercel project settings.
4. Deploy. Vercel will use `vercel.json` and `server.js` automatically.

The project includes a deployment health endpoint at `/api/health`.

## 🔐 Security

- API keys are stored in environment variables.
- The `.env` file is excluded using `.gitignore`.
- Never expose your API key in frontend JavaScript or public repositories.

## 🚀 Future Improvements

- Chat history and saved conversations
- Markdown formatting for AI responses
- Copy response functionality
- Regenerate response feature
- Dark and light themes
- Improved mobile experience

## 👩‍💻 Author

Created as a beginner-friendly AI chatbot development project.

## 📄 License

This project is open-source and available under the MIT License.
