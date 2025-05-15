
Chat Application README
Overview
This is a simple web-based chat application that allows users to register, add friends, and exchange text messages. The application uses HTTP protocol with a Node.js backend and SQLite database.
Setup Instructions

Prerequisites

Node.js (v14+ recommended)
IIS installed on Windows
SQLite

Installation Steps

Install Dependencies
Copynpm install
This will install all required packages defined in package.json.
Database Setup

The application automatically creates an SQLite database file (chat.db) on first run
No additional setup is required for the database


Configure IIS

Install iisnode: https://github.com/Azure/iisnode/releases
Create a new site in IIS Manager pointing to the application directory
Set the application pool to "No Managed Code"
Ensure the IIS user has write permissions to the application directory

Adding Friends

Search for other users by username
Send friend requests
Accept incoming requests to add users to your contacts


Messaging

Click on a friend in your contact list to start a conversation
Type messages and press send
Messages will be delivered in real-time using polling


Technical Details
Frontend: HTML, CSS, JavaScript
Backend: Node.js with Express
Database: SQLite
Authentication: JWT-based token system

For any issues or questions, please contact the repository owner.
