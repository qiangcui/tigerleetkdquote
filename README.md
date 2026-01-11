# Tiger Lee’s World Class Tae Kwon Do - Proposal & Booking Platform

This repository contains the codebase for the Tiger Lee’s World Class Tae Kwon Do proposal and booking platform.

## 🚀 Live Deployment
The app is automatically deployed to GitHub Pages:
**[View Live Site](https://qiangcui.github.io/gloriacloud-tigerleetkd/)**

## 🛠 Features
- **Modern Proposal Document**: Professional design with dynamic content loading via URL parameters.
- **Digital Acceptance**: Client can sign the proposal directly in the browser.
- **Automated Workflow**: acceptance triggers PDF generation and email notification via Google Apps Script.
- **CI/CD**: Automated deployment via GitHub Actions.

## 💻 Local Development

**Prerequisites:** Node.js

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Environment Variables:**
    Create a `.env.local` file and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```
3.  **Run the app:**
    ```bash
    npm run dev
    ```

## 📦 Deployment

This project uses GitHub Actions for CI/CD. Any push to the `main` branch will automatically trigger a build and deploy to GitHub Pages.

**Note on Custom Domains:**
If you wish to use a custom domain like `tigerleetkd.gloriacloud.com`:
1. Add the custom domain in GitHub Repository Settings -> Pages.
2. Update the `base` in `vite.config.ts` to `'/'`.

