Chat Application Backend

This repository contains the backend API for a real-time chat application built with Node.js, Express, and Socket.IO. The API provides endpoints and WebSocket connections for handling user authentication, message sending, and chat room management.

Features :

WebSocket Communication: Utilizes Socket.IO for real-time bidirectional communication between clients and the server.
User Authentication: Provides endpoints for user registration, login, and authentication using JSON Web Tokens (JWT).
Chat Room Management: Supports creating, joining, and leaving chat rooms.
Message Handling: Enables users to send and receive messages within chat rooms in real time.
Error Handling: Implements robust error handling to provide informative responses to clients.

Technologies Used :

Node.js: A runtime environment for executing JavaScript code server-side.
Express: A web application framework for Node.js, providing a robust set of features for building APIs.
Socket.IO: A library that enables real-time, bidirectional, and event-based communication between web clients and servers.
JWT: JSON Web Tokens for user authentication and authorization.
MongoDB (optional): A NoSQL database used for storing user information, chat messages, and chat room data.

Installation:

Clone the repository: git clone https://github.com/your-username/your-repo.git
Install dependencies: npm install
Set up environment variables by creating a .env file and providing required configurations.
Start the server: npm start

Usage :

Make requests to the provided endpoints for user authentication and chat room management.
Connect to the WebSocket server for real-time messaging within chat rooms.

Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to help improve the project.
