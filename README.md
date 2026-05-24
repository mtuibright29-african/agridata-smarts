# AgriData Smarts

AgriData Smarts is a Tanzanian-focused agriculture management platform that combines farm monitoring, marketplace listings, real-time chat support, and admin management tools.

## Project structure

- `backend/` - Express API server built with Node.js and MongoDB models.
- `frontend/` - React application using Vite, Material UI, and client-side routing.
- `database/` - Placeholder for database assets and scripts.

## What is included

- User authentication with JWT token support
- Farmer dashboard UI
- Marketplace listing and creation flow
- AI-style Swahili chatbot endpoint
- Admin panel with user management
- Farm data model and backend API routes

## Setup

### Backend

1. Open a terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with values such as:
   ```text
   MONGODB_URI=mongodb://localhost:27017/agridata
   JWT_SECRET=your-secret-key
   ZERNIO_API_KEY=your-zernio-api-key
   WHATSAPP_ACCESS_TOKEN=your-token
   WHATSAPP_CHANNEL_ID=your-channel-id
   ```
4. Start the backend:
   ```bash
   npm start
   ```

### Frontend

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:3000`

## GitHub deployment

This workspace has been prepared for git tracking. To publish the project to GitHub:

1. Create a new repository on GitHub.
2. In the project root, add the remote:
   ```bash
   git remote add origin https://github.com/<username>/<repository>.git
   ```
3. Push the main branch:
   ```bash
   git push -u origin master
   ```

## Notes

- The frontend is configured to proxy `/api` requests to `http://localhost:5000` via Vite.
- Ensure MongoDB is running before starting the backend.
- The chatbot endpoint currently returns static Swahili responses and can be extended with AI or WhatsApp integration.

## Next steps

- Add UI for farm data submission and analytics charts
- Connect the marketplace listings to real buyer workflows
- Harden authentication, validation, and production deployment
- Add tests for backend routes and frontend components

## Improved context (from product conversations)

This project was developed following detailed stakeholder conversations about building an agricultural data business in Tanzania focused on pineapple farmers (Chalinze). Key takeaways integrated into the app:

- Support for Kiswahili-first UX and WhatsApp integration for low-connectivity access.
- Chatbot commands: `hali ya hewa`, `bei`, `chunguza <picha>`, `mazao yangu`, `mafunzo`, `msaada` are supported in the chatbot UI.
- Data collection model: support for sensors, drone/satellite imagery, and farmer-reported data; explicit consent and farmer data ownership are emphasized in the UI.
- Roadmap: start with advisory and marketplace modules, then add financial services (credit scoring, insurance) and carbon/market intelligence later.
- Partnerships: suggested integration points with local players (MazaoHub, KijaniSpace) and APIs (Zernio for social posting) are documented for future work.

These context-driven improvements are reflected in the landing page, chatbot, and seed data scripts in this repository.
