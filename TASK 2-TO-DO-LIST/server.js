const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend files

// Helper functions for file operations
const readTasks = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading tasks:", err);
        return [];
    }
};

const writeTasks = (tasks) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
        return true;
    } catch (err) {
        console.error("Error writing tasks:", err);
        return false;
    }
};

// API Endpoints

// GET /api/tasks - Get all tasks
app.get('/api/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Task text is required' });
    }

    const tasks = readTasks();
    const newTask = {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    if (writeTasks(tasks)) {
        res.status(201).json(newTask);
    } else {
        res.status(500).json({ error: 'Failed to save task' });
    }
});

// PUT /api/tasks/:id - Update a task (toggle complete or edit text)
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;

    let tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // Update fields if provided
    if (text !== undefined) tasks[taskIndex].text = text;
    if (completed !== undefined) tasks[taskIndex].completed = completed;

    if (writeTasks(tasks)) {
        res.json(tasks[taskIndex]);
    } else {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    let tasks = readTasks();
    const filteredTasks = tasks.filter(t => t.id !== id);

    if (tasks.length === filteredTasks.length) {
        return res.status(404).json({ error: 'Task not found' });
    }

    if (writeTasks(filteredTasks)) {
        res.status(204).send();
    } else {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
