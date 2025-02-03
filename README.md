# AI-Assisted Collaborative Code Editor

## Overview

This is a powerful, lightweight AI-assisted code editor that offers real-time collaboration, intelligent code assistance, and a seamless development experience. Built with cutting-edge web technologies, our editor empowers developers to write, share, and improve code more efficiently.

## 🚀 Key Features

### 1. Code Editor
- Lightweight, feature-rich code editing environment
- Syntax highlighting with multiple themes
- Word wrap and line numbering
- Bracket matching and automatic indentation
- Intuitive file explorer panel

### 2. 🤖 AI-Powered Code Assistance
- Intelligent auto-completion for function names and variables
- Quick fix suggestions for syntax errors
- Code snippet generation
- Automated code documentation
- AI-driven code improvement recommendations

### 3. 🤝 Real-Time Collaboration
- Multi-user editing with live cursor tracking
- In-editor commenting system
- Comprehensive activity logging
- Auto-save and undo/redo history

### 4. 🔒 Security & Authentication
- Secure login options:
  - Email authentication
  - Google OAuth
- Two-factor authentication (2FA)
  - OTP and TOTP support
- Password reset functionality

### 5. 🎨 User Experience
- Dark and light mode
- Customizable font sizes and color themes
- Collapsible sidebar
- Intuitive, user-friendly interface

## 🛠 Technology Stack

### Frontend
- Next.js (App Router)
- Monaco Editor
- Socket.IO Client
- React Context

### Backend
- Express.js
- Socket.IO Server
- Cohere AI for intelligent code assistance
- MongoDB for data persistence

## 📦 Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB
- Cohere API Key
- Google OAuth Credentials (optional)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://your-repo-url.git
cd ai-code-editor
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
COHERE_API_KEY=your_cohere_api_key
```

Run the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file with these variables:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
MONGODB_URL=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
EMAIL_SECURE=false
```

Run the frontend development server:
```bash
npm run dev
```

## 🌐 Default Ports
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact
Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/ai-code-editor](https://github.com/yourusername/ai-code-editor)

## 🙌 Acknowledgements
- Next.js
- Monaco Editor
- Socket.IO
- Cohere AI
- React