
// ==========================================
// MY AI CHATBOT - FRONTEND JAVASCRIPT
// Connected to Groq AI through our backend
// ==========================================


// STEP 1: Select HTML elements

const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const messagesContainer = document.getElementById("messages");
const newChatButton = document.getElementById("new-chat-btn");
const welcomeSection = document.getElementById("welcome-section");
const themeToggle = document.getElementById("theme-toggle");


// STEP 1.1: Apply and smoothly switch the selected theme

function getTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function updateThemeControl(theme) {
    const isDark = theme === "dark";

    themeToggle.setAttribute("aria-checked", String(isDark));
    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}

updateThemeControl(getTheme());

themeToggle.addEventListener("click", (event) => {
    const nextTheme = getTheme() === "dark" ? "light" : "dark";
    const rect = themeToggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    document.documentElement.style.setProperty("--theme-x", `${x}px`);
    document.documentElement.style.setProperty("--theme-y", `${y}px`);

    const applyTheme = () => {
        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem("chatbot-theme", nextTheme);
        updateThemeControl(nextTheme);
    };

    if (
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        document.startViewTransition
    ) {
        document.startViewTransition(applyTheme);
    } else {
        applyTheme();
    }
});


// STEP 2: Store conversation history

const conversationHistory = [];

console.log("Chatbot JavaScript connected successfully!");


// STEP 3: Function to display messages

function displayMessage(message, sender) {

    const messageElement = document.createElement("div");

    messageElement.classList.add("message");

    if (sender === "user") {
        messageElement.classList.add("user-message");
    } else {
        messageElement.classList.add("ai-message");
    }

    if (sender === "ai" && window.marked && window.DOMPurify) {
        const renderedMarkdown = window.marked.parse(message, {
            breaks: true,
            gfm: true
        });

        messageElement.innerHTML = window.DOMPurify.sanitize(renderedMarkdown, {
            USE_PROFILES: { html: true }
        });
    } else {
        messageElement.textContent = message;
    }

    messagesContainer.appendChild(messageElement);

    // Hide welcome screen
    welcomeSection.style.display = "none";

    // Scroll to the latest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

}


// STEP 4: Create typing indicator

function showTypingIndicator() {

    const typingIndicator = document.createElement("div");

    typingIndicator.classList.add(
        "message",
        "ai-message",
        "typing-indicator"
    );

    typingIndicator.textContent = "AI is thinking...";

    messagesContainer.appendChild(typingIndicator);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return typingIndicator;

}


// STEP 5: Send message to Groq through our backend

async function sendMessage() {

    const message = userInput.value.trim();

    // Don't send an empty message
    if (message === "") {
        return;
    }

    // Prevent multiple messages while waiting
    if (sendButton.disabled) {
        return;
    }

    // Display user's message
    displayMessage(message, "user");

    // Add message to conversation history
    conversationHistory.push({
        role: "user",
        content: message
    });

    // Clear input box
    userInput.value = "";

    // Disable button while AI responds
    sendButton.disabled = true;

    // Show typing indicator
    const typingIndicator = showTypingIndicator();


    try {

        // Send conversation to our backend
        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                messages: conversationHistory
            })

        });


        // Read backend response
        const data = await response.json();


        // Check for errors
        if (!response.ok) {

            throw new Error(
                data.error || "Unable to get an AI response."
            );

        }


        // Get Groq's actual response
        const aiReply = data.reply;

        if (typeof aiReply !== "string" || aiReply.trim() === "") {
            throw new Error("The AI returned an empty response.");
        }


        // Remove typing indicator
        typingIndicator.remove();


        // Save AI response in conversation history
        conversationHistory.push({
            role: "assistant",
            content: aiReply
        });


        // Display AI response
        displayMessage(aiReply, "ai");


    } catch (error) {

        // Remove typing indicator
        typingIndicator.remove();

        // Remove unanswered user message from history
        conversationHistory.pop();

        console.error("Chatbot Error:", error);

        // Display a friendly error
        displayMessage(
            "Sorry! I couldn't connect to the AI. " +
            "Please check your server and API key, then try again.",
            "ai"
        );

    } finally {

        // Enable button again
        sendButton.disabled = false;

        // Focus on input box
        userInput.focus();

    }

}


// STEP 6: Handle Send button click

sendButton.addEventListener("click", sendMessage);


// STEP 7: Send message using Enter key

userInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();

    }

});


// STEP 8: Start a new chat

newChatButton.addEventListener("click", function () {

    // Clear displayed messages
    messagesContainer.innerHTML = "";

    // Clear conversation history
    conversationHistory.length = 0;

    // Show welcome screen
    welcomeSection.style.display = "block";

    // Clear input
    userInput.value = "";

    // Enable send button
    sendButton.disabled = false;

    // Focus on input
    userInput.focus();

    console.log("New chat started!");

});
