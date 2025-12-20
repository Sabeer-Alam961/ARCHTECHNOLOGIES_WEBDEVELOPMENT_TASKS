const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

const API_URL = '/api/tasks';

// Fetch all tasks from the server
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Add a new task
async function addTask() {
    const text = todoInput.value.trim();
    if (!text) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (response.ok) {
            todoInput.value = '';
            fetchTasks();
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Toggle task completion
async function toggleTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT'
        });
        if (response.ok) {
            fetchTasks();
        }
    } catch (error) {
        console.error('Error toggling task:', error);
    }
}

// Delete a task
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchTasks();
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Render tasks to the DOM
function renderTasks(tasks) {
    todoList.innerHTML = '';
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.style.animationDelay = `${index * 0.1}s`;

        li.innerHTML = `
            <div class="todo-content">
                <div class="checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
                <span class="todo-text ${task.completed ? 'completed' : ''}" onclick="toggleTask(${task.id})">${task.text}</span>
            </div>
            <div class="delete-btn" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash-can"></i>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// Event Listeners
addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Initial fetch
fetchTasks();
