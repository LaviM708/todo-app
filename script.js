const taskInput = document.getElementById("task-input");
const addTask = document.getElementById("add-task");
const todosList = document.getElementById("todos-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedButton = document.getElementById("clear-completed");
const dateElement = document.getElementById("date");

// user types task in taskInput
// user press addTask
// task is added to todosList
// Task is shown in all and active
// when task is completed user will check checkbox of todo-item
// when task is checked , it is added to the completed section
// when user press clear completed , completed section is cleared

clearCompletedButton.addEventListener("click", clearCompleted);

let todos = [];
let currentFilter = "all";

loadTodos();
forFilters();
setDate();

addTask.addEventListener("click", () => {
  if (taskInput.value.trim() === "") {
    return;
  }

  const todo = {
    id: Date.now(),
    text: taskInput.value,
    completed: false,
  };

  todos.push(todo);

  saveTodos();

  renderTodos();

  taskInput.value = "";
});

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask.click();
  }
});

function updateItemsLeft() {
  const activeTodos = todos.filter((todo) => !todo.completed);

  itemsLeft.textContent = `${activeTodos.length} items left`;
}

function updateEmptyState(filteredTodos) {
  const emptyState = document.querySelector(".empty-state");

  if (filteredTodos.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }
}

function forFilters() {
  const filters = document.querySelectorAll(".filter");
  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      currentFilter = filter.dataset.filter;

      filters.forEach((item) => {
        item.classList.remove("active");
      });

      filter.classList.add("active");

      renderTodos();
    });
  });
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

function renderTodos() {
  todosList.innerHTML = "";
  let filteredTodos = todos;

  if (currentFilter === "active") {
    filteredTodos = todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    filteredTodos = todos.filter((todo) => todo.completed);
  }

  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");

    // checkbox
    const checkboxContainer = document.createElement("label");
    checkboxContainer.classList.add("checkbox-container");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      toggleTodo(todo.id);
    });

    const checkmark = document.createElement("span");
    checkmark.classList.add("checkmark");

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkmark);

    // text
    const todoText = document.createElement("span");
    todoText.classList.add("todo-item-text");
    todoText.textContent = todo.text;

    // putting the checkbox and the text into the <li>
    todoItem.appendChild(checkboxContainer);
    todoItem.appendChild(todoText);

    // delete btn
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-times");

    deleteBtn.appendChild(deleteIcon); // adding delete Icon in deleteBtn
    todoItem.appendChild(deleteBtn); // putting deleteBtn into the <li>

    deleteBtn.addEventListener("click", () => {
      deleteTodo(todo.id);
    });

    if (todo.completed) {
      todoItem.classList.add("completed");
    }
    todosList.appendChild(todoItem);
  });
  updateItemsLeft();
  updateEmptyState(filteredTodos);
}

function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        completed: !todo.completed,
      };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const storedTodos = localStorage.getItem("todos");

  if (storedTodos) {
    todos = JSON.parse(storedTodos);
  }

  renderTodos();
}

function setDate() {
  const today = new Date();

  dateElement.textContent = today.toDateString();
}
