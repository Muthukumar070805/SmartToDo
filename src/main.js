const todoForm = document.querySelector('form');
const clearBtn = document.querySelector('.cls-btn');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');
const doneListUL = document.getElementById('done-list');


let allTodos = getTodos();
let allDones = getDones();
updateTodoList();
updateDoneList();

todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addTodo();
});

clearBtn.addEventListener('click', function(e) {
    e.preventDefault();
    allDones = [];
    saveDone();
    updateDoneList();
});

function addTodo() {
    const todoText = todoInput.value.trim();
    const prioritySelect = document.getElementById('priority'); 
    const priorityValue = prioritySelect.value;
    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false,
            priority: priorityValue,
        };
        allTodos.push(todoObject);
        updateTodoList();
        saveTodo();
        todoInput.value = "";
        prioritySelect.value = "2"; 
    }
}

function updateTodoList() {
    allTodos = allTodos.sort((a, b) => a.priority - b.priority);
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex) => {
         const todoItem = createTodoItem(todo, todoIndex);
         todoListUL.appendChild(todoItem);
     });
}

function createTodoItem(todo, todoIndex) {
    const todoID = "todo-" + (todoIndex + 1);
    const todoLI = document.createElement('li');
    todoLI.style.backgroundColor=todo.priority==="1"?"var(--prority-color1)":todo.priority==="2"?"var(--prority-color2)":"var(--prority-color3)";
    const todoText = todo.text;
    todoLI.className = "todo";
    todoLI.innerHTML = `<input type="checkbox" class="checkbox" id="${todoID}" title="Mark as completed">
          <label for="${todoID}" class="custom-checkbox">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
          </label>
          <label class="todo-text">
            ${todoText}
          </label>
          <button class="delete-button" title="Delete ToDo">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
          </button>
          `;
    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todoIndex);
    });
    const checkbox = todoLI.querySelector("input");
    let time=new Date().toLocaleString(); 
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            const doneObject = {
                textdone: todo.text,
                completed: true,
                times:time,
            };
            // console.log(doneObject)
            allDones.push(doneObject);
            saveDone();
            updateDoneList();
            allTodos = allTodos.filter((_, i) => i !== todoIndex);
            saveTodo();
            updateTodoList();
        }
    });
    checkbox.checked = todo.completed;
    return todoLI;
}

function createDoneItem(done, doneIndex) {
    const doneLI = document.createElement('li');
    const doneText = done.textdone;
    const doneTime=done.times;
    doneLI.className = "done";
    doneLI.innerHTML = `
        <label class="done-text">
            ${doneText}
        </label>
        <button class="delete-button" title="Delete Done">Completed at ${doneTime}&nbsp;&nbsp;
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </button>
    `;
    
    const deleteButton = doneLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
        allDones = allDones.filter((_, i) => i !== doneIndex);
        saveDone();
        updateDoneList();
    });
    return doneLI;
}

function updateDoneList() {
    doneListUL.innerHTML = "";
    allDones.forEach((done, doneIndex) => {
        const doneItem = createDoneItem(done, doneIndex);
        doneListUL.appendChild(doneItem);
    });
}

function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodo();
    updateTodoList();
}

function saveTodo() {
    const todoJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todoJson);
}

function getTodos() {
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}

function saveDone() {
    const doneJson = JSON.stringify(allDones);
    localStorage.setItem("dones", doneJson);
}

function getDones() {
    const dones = localStorage.getItem("dones") || "[]";
    return JSON.parse(dones);
}