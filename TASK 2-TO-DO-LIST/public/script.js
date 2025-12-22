const API_URL = 'http://localhost:3000/api/tasks';
const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const emptyState = document.getElementById('empty-state');
const dateDisplay = document.getElementById('date-display');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    setDate();
});

// Set Date
function setDate() {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const today = new Date();
    dateDisplay.textContent = today.toLocaleDateString('en-US', options);
}

// Fetch Tasks
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
    }
}

// Render Tasks
function renderTasks(tasks) {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        emptyState.style.display = 'flex';
        return;
    }
    emptyState.style.display = 'none';

    tasks.forEach(task => {
        const li = createTaskElement(task);
        taskList.appendChild(li);
    });
}

// Create Task Element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
        <div class="checkbox-wrapper">
            <input type="checkbox" class="custom-checkbox" 
                ${task.completed ? 'checked' : ''} 
                onchange="toggleTask('${task.id}', this.checked)">
        </div>
        <input type="text" class="task-text" value="${task.text}" 
            onchange="updateTaskText('${task.id}', this.value)"
            ${task.completed ? 'disabled' : ''}>
        <button class="delete-btn" onclick="deleteTask('${task.id}')" aria-label="Delete Task">
            <i class="fas fa-trash"></i>
        </button>
    `;
    return li;
}

// Add Task
async function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (response.ok) {
            taskInput.value = '';
            fetchTasks();
        }
    } catch (err) {
        console.error('Error adding task:', err);
    }
}

// Toggle Task Complete
window.toggleTask = async (id, completed) => {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        fetchTasks();
    } catch (err) {
        console.error('Error toggling task:', err);
    }
};

// Update Task Text
window.updateTaskText = async (id, text) => {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        // We generally don't need to re-fetch here if it's just a text update, 
        // but it's safer for consistency.
    } catch (err) {
        console.error('Error updating task text:', err);
    }
};

// Delete Task
window.deleteTask = async (id) => {
    // Add exit animation
    const li = document.querySelector(`li[data-id="${id}"]`);
    if (li) {
        li.style.animation = 'deleteItem 0.3s ease forwards';
    }

    try {
        // Wait for animation
        await new Promise(r => setTimeout(r, 300));

        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        fetchTasks();
    } catch (err) {
        console.error('Error deleting task:', err);
    }
};

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
