"# ChatApp

A full-stack chat application built with React, Vite, Express, MongoDB, and Socket.IO. The app includes a polished chat UI, authentication endpoints, protected message routes, and backend support for future real-time messaging.

## What is included

- React + Vite frontend in the client folder
- Express + MongoDB backend in the server folder
- Signup/login/profile update flow
- Sidebar-based chat layout with message and profile views
- Cloudinary integration for profile image uploads
- Socket.IO server setup for real-time messaging

## Run locally

Frontend

```bash
cd client
npm install
npm run dev
```

Backend

```bash
cd server
npm install
npm run server
```

## Environment variables

Create a .env file in the server folder with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Current status

- UI: implemented
- Authentication API: implemented
- Message API: implemented
- Real-time chat flow: backend scaffolded and ready for UI integration

## Documentation

See the docs folder for architecture notes, progress logs, and interview prep material.
" 
