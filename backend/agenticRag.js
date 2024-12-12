// Usage: node agenticRAG.js
// import dotenv from 'dotenv';
const dotenv = require('dotenv');
dotenv.config();

// Import the required libraries
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
// import natural from 'natural';
// import { TextLoader } from "langchain/document_loaders/fs/text";

const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const natural = require('natural');
const { TextLoader } = require("langchain/document_loaders/fs/text");

// Create a new instance of the ChatGoogleGenerativeAI model
const model = new ChatGoogleGenerativeAI({
    model: "gemini-pro",
    maxOutputTokens: 2048,
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
    ],
});

// Create a new instance of the WordTokenizer
const tokenizer = new natural.WordTokenizer();

// Function to load documents
async function loadDocuments() {
    const loader = new TextLoader("./data/symptoms.txt");
    const docs = await loader.load();
    console.log("Loaded documents:", docs);
    return docs;
}

// Function to retrieve relevant data from documents
async function retrieveData(query, documents) {
    const queryTokens = tokenizer.tokenize(query.toLowerCase());
    let bestMatch = null;
    let highestScore = 0;

    documents.forEach(document => {
        const sentences = document.pageContent.split(/[\r\n]+/).filter(line => line.trim() !== '');
        sentences.forEach(sentence => {
            const sentenceTokens = tokenizer.tokenize(sentence.toLowerCase());
            const intersection = sentenceTokens.filter(token => queryTokens.includes(token));
            const score = intersection.length;

            if (score > highestScore) {
                highestScore = score;
                bestMatch = sentence;
            }
        });
    });

    return bestMatch || "No relevant information found.";
}

// Agentic RAG Function
async function agenticRAG(query) {
    try {
        const documents = await loadDocuments();

        if (!documents.length) {
            return "Failed to load documents or documents are empty.";
        }

        // Step 1: Retrieve relevant data
        const retrievedData = await retrieveData(query, documents);
        console.log("Retrieved Data:", retrievedData);

        // Step 2: Generate the first response
        const augmentedQuery = retrievedData ? `Considering the following facts: ${retrievedData} \n\n
         if someone had these symptoms: ${query} \n\n
         Should someone with these symptoms see a doctor? Explain` : query;
        const initialResponse = await model.invoke([["human", augmentedQuery]]);
        console.log("Initial Response:", initialResponse.content);

        // Step 3: Dynamic follow-up based on response
        if (
            initialResponse.content.toLowerCase().includes("clarify") ||
            initialResponse.content.toLowerCase().includes("example")
        ) {
            console.log("Agent: Asking clarifying question...");
            const followUpQuery = "Can you provide a step-by-step practical example?";
            const followUpRetrievedData = await retrieveData(followUpQuery, documents);

            const followUpAugmentedQuery = followUpRetrievedData
                ? `${followUpQuery} Based on this fact: ${followUpRetrievedData}`
                : followUpQuery;

            const followUpResponse = await model.invoke([["human", followUpAugmentedQuery]]);
            console.log("Follow-Up Response:", followUpResponse.content);
            return followUpResponse.content;
        } else {
            console.log("Agent: Task Complete.");
            return initialResponse.content
        }

    } catch (error) {
        console.error("Error during RAG process:", error);
        return "An error occurred while processing the request.";
    }
}

module.exports = {agenticRAG};
