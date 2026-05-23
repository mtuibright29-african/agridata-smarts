# Database Setup

This folder contains a seed script to populate the MongoDB database with sample users and farm data.

## Usage

1. Ensure MongoDB is running.
2. Confirm `backend/.env.txt` contains a valid `MONGODB_URI`.
3. From the root project folder, run:
   ```bash
   cd backend
   node ../database/seed.js
   ```

The script will create:
- an admin user
- a sample farmer user
- a sample buyer user
- sample farm data for the farmer

## Notes

- The script uses the backend models defined in `backend/models/`.
- Change or extend the sample data directly in `database/seed.js`.
