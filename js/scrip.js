class Todo {
    constructor(task, done = false) {
      this.task = task;
      this.done = done;
    }
  
    set setTask(task) {
      this.task = task;
    }
  
    get getTask() {
      return this.task;
    }
  
    set setDone(done) {
      this.done = done;
    }
  
    get isDone() {
      return this.done;
    }
  }
  
  class TodoApp {
    constructor() {
      this.todos = JSON.parse(localStorage.getItem("todos")) || [];
      this.todos = this.todos.map((todo) => new Todo(todo.task, todo.done));
      console.log("Loaded todos from localStorage:", this.todos);
      this.todoListElement = document.getElementById("todo-list");
      this.newTodoInput = document.getElementById("new-todo");
      this.addTodoButton = document.getElementById("add-todo");
  
      this.addTodoButton.addEventListener("click", () => this.addTodo());
      this.renderTodos();
    }
  
    addTodo() {
      const task = this.newTodoInput.value.trim();
      if (task) {
        const newTodo = new Todo(task);
        this.todos.push(newTodo);
        this.updateLocalStorage();
        this.renderTodos();
        this.newTodoInput.value = "";
      }
    }
  
    toggleTodoDone(index) {
      this.todos[index].setDone = !this.todos[index].isDone;
      this.updateLocalStorage();
      this.renderTodos();
    }
  
    deleteTodo(index) {
      this.todos.splice(index, 1);
      this.updateLocalStorage();
      this.renderTodos();
    }
  
    editTodoText(index, newTask) {
      if (newTask !== null && newTask.trim() !== "") {
        this.todos[index].setTask = newTask.trim();
        this.updateLocalStorage();
        this.renderTodos();
      }
    }
  
    updateLocalStorage() {
      localStorage.setItem("todos", JSON.stringify(this.todos));
      console.log("Saved todos to localStorage:", JSON.stringify(this.todos));
    }
  
    renderTodos() {
      this.todoListElement.innerHTML = "";
      this.todos.forEach((todo, index) => {
        console.log(`Rendering todo: ${todo.getTask}, done: ${todo.isDone}`);
  
        const li = document.createElement("li");
        li.classList.add("todo");
        li.classList.toggle("done", todo.isDone);
        li.classList.toggle("done-hovered", todo.isDone);
  
        li.addEventListener("mouseover", () => {
          li.classList.add("hovered");
        });
        li.addEventListener("mouseout", () => {
          li.classList.remove("hovered");
        });
  
        const taskSpan = document.createElement("span");
        taskSpan.textContent = todo.getTask;
        taskSpan.classList.add("task-span");
        taskSpan.classList.toggle("done", todo.isDone);
        taskSpan.addEventListener("click", () => this.editTodoMode(index, taskSpan));
  
        const deleteIcon = document.createElement("img");
        deleteIcon.src = "/img/basket.png";
        deleteIcon.classList.add("delete-icon");
        deleteIcon.addEventListener("click", (event) => {
          event.stopPropagation();
          this.deleteTodo(index);
        });
  
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.isDone;
        checkbox.classList.add("checkbox");
        checkbox.addEventListener("change", () => this.toggleTodoDone(index));
  
        li.appendChild(taskSpan);
        li.appendChild(checkbox);
        li.appendChild(deleteIcon);
        this.todoListElement.appendChild(li);
      });
    }
  
    editTodoMode(index, taskSpan) {
      const input = document.createElement("input");
      input.type = "text";
      input.value = this.todos[index].getTask;
      input.classList.add("task-span");
      input.addEventListener("blur", () => this.finishEditing(index, input));
      input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          this.finishEditing(index, input);
        }
      });
  
      taskSpan.replaceWith(input);
      input.focus();
    }
  
    finishEditing(index, input) {
      const newTask = input.value.trim();
      if (newTask !== "") {
        this.todos[index].setTask = newTask;
        this.updateLocalStorage();
      }
      this.renderTodos();
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    new TodoApp();
    console.log("Current localStorage data:", localStorage.getItem("todos"));
  });
  