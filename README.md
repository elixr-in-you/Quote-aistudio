# QuoteGenius AI (Vanilla JS)

A lightweight, professional quotation generator powered by Google Gemini AI. Built with Vanilla JavaScript, Tailwind CSS, and Vite.

## Features

*   **Real-time Preview:** See your quote update instantly as you type.
*   **AI Enhancement:**
    *   **Rewrite Descriptions:** Use AI to make your line items sound more professional.
    *   **Generate Terms:** Auto-generate standard terms based on your industry.
    *   **Draft Emails:** Create professional email drafts to send with your quote.
*   **Print/PDF:** Export your quotation directly to PDF using the browser's print function.
*   **Responsive:** Works on desktop and mobile.

## Prerequisites

*   **Node.js** (v16 or higher) installed on your machine.
*   A **Google Gemini API Key**. You can get one at [aistudio.google.com](https://aistudio.google.com/).

## Setup & Installation

1.  **Clone or Download** this project folder.

2.  **Install Dependencies:**
    Open your terminal in the project directory and run:
    ```bash
    npm install
    ```

3.  **Configure API Key:**
    *   Create a new file named `.env` in the root directory.
    *   Add your API Key to it (see `.env.example` for reference).
    
    **Example `.env` file content:**
    ```env
    API_KEY=AIzaSyYourSecretKeyHere...
    ```

4.  **Run the App:**
    Start the development server:
    ```bash
    npm run dev
    ```
    
5.  **Open in Browser:**
    Click the link shown in the terminal (usually `http://localhost:5173`).

## Project Structure

*   `index.html` - The main entry point and UI layout.
*   `app.js` - Contains all application logic (state management, rendering, event listeners).
*   `services/geminiService.js` - Handles interactions with the Google GenAI SDK.
*   `constants.js` - Default data and configuration.

## Technologies

*   Vanilla JavaScript (ES Modules)
*   Tailwind CSS (via CDN)
*   Lucide Icons
*   Vite (Dev Server & Environment Variables)
*   Google GenAI SDK