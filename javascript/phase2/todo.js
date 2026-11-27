// ==========================================
// DAY 7: Mini Project - Interactive To-Do List
// ==========================================

// 1. Application State
let tasks = [
  { id: 1, text: "Learn DOM Manipulation", completed: true },
  { id: 2, text: "Build Interactive To-Do List", completed: false }
];
let currentFilter = "all"; // "all" | "active" | "completed"
let searchQuery = "";
let editingId = null;

// 2. DOM Elements
const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const errorMsg = document.getElementById("errorMsg");
const searchInput = document.getElementById("searchInput");
const filterContainer = document.getElementById("filterContainer");
const taskList = document.getElementById("taskList");
const totalCountEl = document.getElementById("totalCount");
const remainingCountEl = document.getElementById("remainingCount");

// 3. Render Function (Builds UI safely from State)
function renderTasks() {
  // Filter by Status + Search Query using Array.filter()
  const filteredTasks = tasks.filter(task => {
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && !task.completed) ||
      (currentFilter === "completed" && task.completed);

    const matchesSearch = task.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Clear existing list
  taskList.innerHTML = "";

  // Empty State
  if (filteredTasks.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "empty-msg";
    emptyLi.textContent = "No tasks found.";
    taskList.append(emptyLi);
  } else {
    // Build each task item safely using createElement & textContent
    filteredTasks.forEach(task => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      li.dataset.id = task.id;

      if (editingId === task.id) {
        // --- EDIT MODE UI ---
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.className = "edit-input";
        editInput.value = task.text;

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "task-actions";

        const saveBtn = document.createElement("button");
        saveBtn.className = "btn-sm btn-save";
        saveBtn.textContent = "Save";
        saveBtn.dataset.action = "save";

        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn-sm btn-cancel";
        cancelBtn.textContent = "Cancel";
        cancelBtn.dataset.action = "cancel";

        actionsDiv.append(saveBtn, cancelBtn);
        li.append(editInput, actionsDiv);
      } else {
        // --- NORMAL VIEW UI ---
        const leftDiv = document.createElement("div");
        leftDiv.className = "task-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.dataset.action = "toggle";

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        leftDiv.append(checkbox, span);

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "task-actions";

        const editBtn = document.createElement("button");
        editBtn.className = "btn-sm btn-edit";
        editBtn.textContent = "Edit";
        editBtn.dataset.action = "edit";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn-sm btn-delete";
        deleteBtn.textContent = "Delete";
        deleteBtn.dataset.action = "delete";

        actionsDiv.append(editBtn, deleteBtn);
        li.append(leftDiv, actionsDiv);
      }

      taskList.append(li);
    });
  }

  // Update Stats
  const remaining = tasks.filter(t => !t.completed).length;
  totalCountEl.textContent = `Total: ${tasks.length}`;
  remainingCountEl.textContent = `Remaining: ${remaining}`;
}

// 4. Add Task (Form Submit)
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();

  if (text === "") {
    errorMsg.textContent = "Please enter a task before adding.";
    return;
  }

  errorMsg.textContent = "";
  tasks.push({
    id: Date.now(), // Unique ID based on timestamp
    text: text,
    completed: false
  });

  taskInput.value = "";
  taskInput.focus();
  renderTasks();
});

// 5. Event Delegation on Task List (Complete, Edit, Save, Cancel, Delete)
taskList.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  const li = e.target.closest(".task-item");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (action === "toggle") {
    tasks = tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
    renderTasks();
  } else if (action === "delete") {
    tasks = tasks.filter(t => t.id !== id);
    if (editingId === id) editingId = null;
    renderTasks();
  } else if (action === "edit") {
    editingId = id;
    renderTasks();
    const editInput = taskList.querySelector(".edit-input");
    if (editInput) editInput.focus();
  } else if (action === "save") {
    saveEditedTask(li, id);
  } else if (action === "cancel") {
    editingId = null;
    errorMsg.textContent = "";
    renderTasks();
  }
});

// Support pressing Enter to Save or Escape to Cancel while editing
taskList.addEventListener("keydown", (e) => {
  if (!e.target.classList.contains("edit-input")) return;

  const li = e.target.closest(".task-item");
  const id = Number(li.dataset.id);

  if (e.key === "Enter") {
    saveEditedTask(li, id);
  } else if (e.key === "Escape") {
    editingId = null;
    errorMsg.textContent = "";
    renderTasks();
  }
});

function saveEditedTask(li, id) {
  const editInput = li.querySelector(".edit-input");
  const updatedText = editInput.value.trim();

  if (updatedText === "") {
    errorMsg.textContent = "Task cannot be empty!";
    editInput.focus();
    return;
  }

  errorMsg.textContent = "";
  tasks = tasks.map(t => (t.id === id ? { ...t, text: updatedText } : t));
  editingId = null;
  renderTasks();
}

// 6. Live Search Task
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  renderTasks();
});

// 7. Filter Tasks (Event Delegation on Filter Container)
filterContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter-btn")) return;

  // Update active button class
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  e.target.classList.add("active");

  currentFilter = e.target.dataset.filter;
  renderTasks();
});

// Initial Render on Page Load
renderTasks();