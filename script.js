let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => 
    {
        const li = createTaskElement(task, index);
        taskList.appendChild(li);

    });
}

function createTaskElement(task, index) 
{
    const li = document.createElement('li');

    li.innerHTML = `
        <span class="task-text">${highlightSearch(task.text)}</span>
        <span class="task-date">${task.dueDate ? task.dueDate : ''}</span>
        <button onclick="editTask(${index})">✏️</button> <!-- Przycisk edycji -->
        <button onclick="deleteTask(${index})">🗑️</button> <!-- Przycisk usuwania -->
    `;

    return li;
}


function addTask() 
{
    const newTaskInput = document.getElementById('new-task');
    const dueDateInput = document.getElementById('due-date');
    const taskText = newTaskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (validateTask(taskText, dueDate)) 
    {
        tasks.push({ text: taskText, dueDate: dueDate });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        newTaskInput.value = '';
        dueDateInput.value = '';

        loadTasks();

    }
}

function validateTask(taskText, dueDate) 
{
    const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

    if (taskText.length < 3 || taskText.length > 255)
    {
        alert('Task must be between 3 and 255 characters.');
        return false;
    }

    if (dueDate && dueDate < today) 
    {
        alert('Due date must be today or later.');
        return false;
    }

    return true;

}

function deleteTask(index) 
{
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    loadTasks();

}

function editTask(index) 
{
    const taskList = document.getElementById('task-list');
    const li = taskList.children[index];
    const task = tasks[index];

    li.innerHTML = `
        <input type="text" id="edit-task" value="${task.text}" maxlength="255" />
        <input type="date" id="edit-date" value="${task.dueDate ? task.dueDate : ''}" />
        <button onclick="saveEdit(${index})">Zapisz</button>
        <button onclick="cancelEdit()">Anuluj</button>
    `;

    const editTaskInput = li.querySelector('#edit-task');
    editTaskInput.focus();
}


function saveEdit(index) 
{
    const editTaskInput = document.getElementById('edit-task');
    const editDateInput = document.getElementById('edit-date');
    const newTaskText = editTaskInput.value.trim();
    const newDueDate = editDateInput.value;

    if (newTaskText.length >= 3 && newTaskText.length <= 255) 
    {
        tasks[index].text = newTaskText;
        tasks[index].dueDate = newDueDate;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();

    } 
    else 
    {
        alert('Task must be between 3 and 255 characters.');

    }
}

function cancelEdit() 
{
    loadTasks();
}


function filterTasks() 
{
    const searchValue = document.getElementById('search').value.toLowerCase();
    if (searchValue.length >= 2) 
    {
        const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchValue));
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        filteredTasks.forEach((task, index) => 
        {
            const li = createTaskElement(task, index);
            taskList.appendChild(li);

        });
    } 
    else 
    {
        loadTasks();

    }
}

function highlightSearch(text) 
{
    const searchValue = document.getElementById('search').value;

    if (searchValue.length >= 2) 
    {
        const regex = new RegExp(`(${searchValue})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');

    }

    return text;

}
