
// STEP 1: Import the required packages

const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

// STEP 2: Load environment variables from .env

dotenv.config();

// STEP 3: Create the Express application

const app = express();
const PORT = 3000;

// STEP 4: Configure the application

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// STEP 5: Check whether the Groq API key exists

if (!process.env.GROQ_API_KEY) {
    console.error("ERROR: GROQ_API_KEY is missing from your .env file.");
    process.exit(1);
}

// STEP 6: Create the chat API endpoint

app.post("/api/chat", async (req, res) => {

    try {

        // Import the Groq SDK
        const { default: Groq } = await import("groq-sdk");

        // Connect to Groq using the private API key
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        // Get conversation messages from the frontend
        const { messages } = req.body;

        // Check whether messages are valid
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                error: "Please provide a valid message."
            });
        }

        // Keep only valid user and assistant messages
        const conversation = messages
            .filter(message =>
                message &&
                ["user", "assistant"].includes(message.role) &&
                typeof message.content === "string" &&
                message.content.trim() !== ""
            )
            .slice(-20)
            .map(message => ({
                role: message.role,
                content: message.content
            }));

        if (conversation.length === 0) {
            return res.status(400).json({
                error: "No valid conversation messages found."
            });
        }

        // Send the conversation to Groq
        const completion = await groq.chat.completions.create({

            messages: [
                {
                    role: "system",
                    content: "You are a friendly, helpful AI assistant. Give clear, accurate and easy-to-understand answers."
                },
                ...conversation
            ],

            model: "openai/gpt-oss-20b"

        });

        // Get the AI's response
        const aiReply = completion.choices[0].message.content;

        // Send the AI response back to the frontend
        res.json({
            reply: aiReply
        });

    } catch (error) {

        console.error("Groq API Error:", error.message);

        res.status(500).json({
            error: "Sorry, something went wrong while contacting the AI. Please try again."
        });

    }

});

// STEP 7: Start the server

app.listen(PORT, () => {

    console.log("--------------------------------");
    console.log("My AI Chatbot server is running!");
    console.log(`Open http://localhost:${PORT}`);
    console.log("--------------------------------");

});
