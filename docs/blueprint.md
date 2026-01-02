# **App Name**: Annaprasanna

## Core Features:

- Image-Based Food Identification: Identify food items from uploaded images using the Google Gemini 1.5 Flash API.
- Nutritional Analysis: Calculate nutritional information (calories, protein, carbs, fats) for identified food items using the AI tool, formatted in JSON from the model's output.
- Vedic Guna Classification: Classify food items based on Vedic Gunas (Sattvic, Rajasic, Tamasic) using AI reasoning, also as part of the JSON from the AI model's output. And apply Vedic dietary wisdom as part of the classification using an AI tool.
- Offline Data Storage: Store all meal data locally in the browser using IndexedDB for privacy and offline access. This includes meal details, nutritional information, and Guna classifications.
- Daily Summary Dashboard: Display a daily summary of calorie intake, macro breakdown (Protein/Carbs/Fats), and Guna balance on the home screen, updating in real-time as meals are added.
- Meal History Timeline: Present a chronological timeline of meals, grouped by date, with expandable meal cards showing detailed nutritional information.
- Real-time Data Synchronization: Implement real-time state synchronization using IndexedDB to update the UI (dashboard and history) automatically upon saving a meal, without page reloads.

## Style Guidelines:

- Primary color: Soft Saffron (#FF9933) to evoke a sense of warmth and Vedic tradition.
- Background color: Ivory White (#FFFDF8) for a clean, spacious, and calming feel.
- Text color: Deep Charcoal (#1F1F1F) for high readability and a modern look.
- Font: 'Inter' (sans-serif) for a modern, clean, and readable UI, suitable for both headlines and body text.
- Use minimal, line-based icons for a clean and uncluttered interface.
- Implement rounded cards (16-20px radius) with subtle shadows to create a gentle, inviting interface. Follow Vedic Minimalism.
- Use a lotus bloom loader animation and gentle fade & slide transitions for a smooth and engaging user experience.