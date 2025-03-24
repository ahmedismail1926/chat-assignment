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


Start the Application

If testing locally without IIS: npm start
If using IIS: Access the application through the configured URL



Using the Application

Registration

Navigate to the registration page
Create an account with a username and password


Login

Log in with your credentials
The application uses JWT tokens for authentication


Adding Friends

Search for other users by username
Send friend requests
Accept incoming requests to add users to your contacts


Messaging

Click on a friend in your contact list to start a conversation
Type messages and press send
Messages will be delivered in real-time using polling



Troubleshooting

If you encounter connection issues, ensure the server is running
Check browser console (F12) for JavaScript errors
Verify IIS configurations if hosting through IIS
Check permissions for the SQLite database file

Security Notes

This is a demonstration application
For production use, enable HTTPS
Consider adding additional security measures like rate limiting and enhanced input validation

Technical Details

Frontend: HTML, CSS, JavaScript
Backend: Node.js with Express
Database: SQLite
Authentication: JWT-based token system

For any issues or questions, please contact the repository owner.
