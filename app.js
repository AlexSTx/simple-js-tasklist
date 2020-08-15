const taskForm = document.querySelector('.task-form');
const taskInput = document.getElementById('task-field')
const tasksContainer = document.querySelector('.tasks-container');
const finishedTasksContainer = document.querySelector('.finished-tasks');

const filterIcon = document.querySelector('.filter-icon');
const filterInput = document.querySelector('.filter-input');

const unfinishedTasksBin = document.querySelector('.delUnf');
const finishedTasksBin = document.querySelector('.delFin');

taskForm.addEventListener('submit', addTask);

tasksContainer.addEventListener('click', deleteTask); 
tasksContainer.addEventListener('click', completeTask); 

finishedTasksContainer.addEventListener('click', deleteTask);
finishedTasksContainer.addEventListener('click', uncompleteTask);

filterIcon.addEventListener('click', showFilter);
filterInput.addEventListener('keyup', filterTasks);

unfinishedTasksBin.addEventListener('click', deleteAllTasks);
finishedTasksBin.addEventListener('click', deleteAllTasks);

document.addEventListener('DOMContentLoaded', restoreTasks);

function addTask(event) {
    if (taskInput.value) {
        createTask(taskInput.value, tasksContainer);
        saveTask(taskInput.value, 0);

        taskInput.value = '';
    } 

    event.preventDefault();
}

function createTask (taskText, container) {
    const newTask = document.createElement('li');
    newTask.className = 'task-card';

    const taskCheckbox = document.createElement('input');
    taskCheckbox.className = 'task-checkbox';
    taskCheckbox.setAttribute('type', 'checkbox');

    (container === finishedTasksContainer)? taskCheckbox.checked = true: 0;

    newTask.appendChild(taskCheckbox);

    const taskLabel = document.createElement('div');
    taskLabel.textContent = taskText;
    taskLabel.className = 'task-label';
    newTask.appendChild(taskLabel);

    const deleteTaskBtn = document.createElement('a');
    deleteTaskBtn.className = 'delete-task';
    deleteTaskBtn.textContent = '❌';
    
    newTask.appendChild(deleteTaskBtn);

    container.appendChild(newTask);
}

function deleteTask () {
    if (event.target.className === 'delete-task') {
        const task = event.target.parentElement.querySelector('.task-label').textContent;

        removeTaskFromStorage(event.target.parentElement, event.target.parentElement.parentElement);

        event.target.parentElement.remove()
    }
}

function completeTask (event) {
    if (event.target.className === 'task-checkbox') {
        removeTaskFromStorage(event.target.parentElement, event.target.parentElement.parentElement);

        finishedTasksContainer.appendChild(event.target.parentElement);

        saveTask(event.target.parentElement.querySelector('.task-label').textContent, 1);
    }   
}

function uncompleteTask(event) {
    if (event.target.className === 'task-checkbox') {
        removeTaskFromStorage(event.target.parentElement, event.target.parentElement.parentElement);

        tasksContainer.appendChild(event.target.parentElement);

        saveTask(event.target.parentElement.querySelector('.task-label').textContent, 0);
    }
}

function showFilter (event) {  
    if (filterInput.classList.contains('invisible'))
        filterInput.classList.remove('invisible');
    else 
        filterInput.classList.add('invisible');
}

function filterTasks (event) {
    const query = filterInput.value.toLowerCase();

    Array.from(tasksContainer.children).forEach((task) => {
        if (!task.querySelector('.task-label').textContent.toLowerCase().includes(query)) {
            task.classList.add('invisible');
        } else {
            if (task.classList.contains('invisible')) {
                task.classList.remove('invisible');
            }
        }
    });
}

const arrow = document.querySelector('.arrow');

arrow.addEventListener('click', switchFinishedTasks);

function switchFinishedTasks(element) {
    if (finishedTasksContainer.classList.contains('invisible')) {
        finishedTasksContainer.classList.remove('invisible');
        arrow.style.transform = 'rotate(90deg)';
    } else {
        finishedTasksContainer.classList.add('invisible');
        arrow.style.transform = 'rotate(270deg)'
    }
}

function deleteAllTasks(event) {
    if (event.target.classList.contains('delUnf')) {
        if (confirm('Tem certeza que deseja deletar todas as tarefas pendentes?')) {
            Array.from(tasksContainer.children).forEach((child) => {
                child.remove();
            })
            localStorage.removeItem('undoneTasks');
        } 
    } else {
        if (confirm('Tem certeza que deseja deletar todas as tarefas concluídas?')) {
            Array.from(finishedTasksContainer.children).forEach((child) => {
                child.remove();
            })
            localStorage.removeItem('finishedTasks');
        } 
    }
}

function restoreTasks () {
    // Pending tasks
    undoneTasks = checkLocalStorage(0)
    
    undoneTasks.forEach((task) => {
        createTask(task, tasksContainer);
    });

    // Finished Tasks
    finishedTasks = checkLocalStorage(1)

    finishedTasks.forEach((task) => {
        createTask(task, finishedTasksContainer);
    });

}

function checkLocalStorage (type) {
    const item = (!type)? 'undoneTasks': 'finishedTasks';
    let tasks;
    // type 0 = não feitas
    // type 1 = feitas

    if (!localStorage.getItem(item)) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem(item))
    }
    
    return tasks;
}

function saveTask (newTask, type) {
    const tasks = checkLocalStorage(type);
    const item = (!type)? 'undoneTasks': 'finishedTasks';

    tasks.push(newTask);
    localStorage.setItem(item, JSON.stringify(tasks));
}

function removeTaskFromStorage(taskElement, container) {
    const type = (container === tasksContainer) ? 0: 1;
    
    const tasks = checkLocalStorage(type);
    const item = (!type)? 'undoneTasks': 'finishedTasks';

    let index = Array.from(container.children).indexOf(taskElement);
    tasks.splice(index, 1);
    
    localStorage.setItem(item, JSON.stringify(tasks));
}