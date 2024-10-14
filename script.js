let tasks = [];

// Function to load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        displayTasks();
    }
}

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to add a task
function addTask() {
    const taskInput = document.getElementById('taskInput').value.trim();
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;
    const alertPlaceholder = document.getElementById('alertPlaceholder');

    if (taskInput === '') {
        displayAlert('Please enter a task!', 'danger');
    } else {
        tasks.push({ task: taskInput, dueDate, priority });
        document.getElementById('taskInput').value = ''; // Clear input field
        document.getElementById('dueDate').value = '';  // Clear due date
        displayTasks();
        saveTasks();
        displayAlert('Task added successfully!', 'success');
    }
}

// Function to display tasks with priority and date
function displayTasks(filteredTasks = tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    filteredTasks.forEach((taskObj, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${taskObj.task} (Due: ${taskObj.dueDate || 'No date'}, Priority: ${taskObj.priority})`;

        // Make tasks editable on double-click
        li.addEventListener('dblclick', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = taskObj.task;
            li.textContent = ''; // Clear current text
            li.appendChild(input);

            input.addEventListener('blur', () => {
                const updatedTask = input.value.trim();
                if (updatedTask) {
                    tasks[index].task = updatedTask;
                    saveTasks();
                    displayTasks();
                }
            });
            input.focus();
        });

        // Click to toggle completed task
        li.addEventListener('click', () => {
            li.classList.toggle('completed');
        });

        taskList.appendChild(li);
    });
}

// Function to remove the last task
function removeLastTask() {
    if (tasks.length > 0) {
        tasks.pop();
        displayTasks();
        saveTasks();
        displayAlert('Last task removed!', 'warning');
    } else {
        displayAlert('No tasks to remove!', 'danger');
    }
}

// Function to clear all tasks
function clearAllTasks() {
    tasks = [];
    displayTasks();
    saveTasks();
    displayAlert('All tasks cleared!', 'warning');
}

// Function to search tasks
document.getElementById('searchTask').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const filteredTasks = tasks.filter(taskObj => taskObj.task.toLowerCase().includes(searchValue));
    displayTasks(filteredTasks);
});

// Function to toggle dark mode
document.getElementById('toggleMode').addEventListener('click', () => {
    if (document.body.getAttribute('data-theme') === 'dark') {
        document.body.removeAttribute('data-theme');
    } else {
        document.body.setAttribute('data-theme', 'dark');
    }
});


// Function to display alert messages
function displayAlert(message, type) {
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alertPlaceholder.innerHTML = alertHTML;
}

// Load tasks when DOM is loaded
document.addEventListener('DOMContentLoaded', loadTasks);
