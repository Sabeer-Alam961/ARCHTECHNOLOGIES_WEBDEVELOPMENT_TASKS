# Stellar Tasks | Premium TO-DO List

A modern, high-performance To-Do List application built with a focus on aesthetics and smooth user experience. This project implements a full-stack architecture with a Node.js backend and a glassmorphic frontend design.

## ✨ Features

- **Full CRUD Support**: Add, view, toggle completion, and delete tasks.
- **Persistence**: Tasks are saved to a `tasks.json` file on the server, ensuring your data survives restarts.
- **Modern UI/UX**:
  - Glassmorphism design with backdrop filters.
  - Smooth micro-animations for task entry and interactions.
  - Responsive layout for mobile and desktop.
  - Vibrant gradients and dark mode aesthetics.
- **Real-time Updates**: Instant feedback for all actions via asynchronous API calls.

## 🚀 Technology Stack

### Frontend
- **HTML5**: Semantic structure.
- **CSS3**: Vanilla CSS with modern features like variables, flexbox, and animations.
- **JavaScript**: Pure ES6+ JavaScript for DOM manipulation and API communication.
- **Icons**: Font Awesome 6.

### Backend
- **Node.js**: Server-side runtime.
- **Express**: Fast, unopinionated web framework.
- **Body-Parser**: Middleware for parsing incoming request bodies.
- **CORS**: Cross-origin resource sharing.
- **FileSystem (fs)**: For JSON file persistence.

## 📦 Project Structure

```text
TASK 2-TO-DO-LIST/
├── public/                 # Frontend assets
│   ├── index.html          # Main entry point
│   ├── style.css           # Styling with glassmorphism
│   └── script.js           # Client-side logic
├── server.js               # Node.js/Express server
├── tasks.json              # Data storage (persistence)
├── package.json            # Node.js dependencies
└── README.md               # Project documentation
```

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later) installed on your machine.

### Installation
1. Clone or download the repository.
2. Open your terminal in the project root directory.
3. Install the required dependencies:
   ```bash
   npm install
   ```

### Running the Application
1. Start the server:
   ```bash
   node server.js
   ```
2. Open your browser and navigate to:
   `http://localhost:3000`

## 📝 License
This project is licensed under the ISC License.
