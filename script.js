const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearAllBtn = document.getElementById("clearAll");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";
let dragIndex = null;

// ==========================
// ADD TASK
// ==========================
addBtn.onclick = addTask;

function addTask() {
    const text = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (!text) {
        alert("⚠ Please enter a task");
        return;
    }

    tasks.push({
        text,
        completed: false,
        dueDate
    });

    save();
    taskInput.value = "";
    dueDateInput.value = "";

    render();
}

// ==========================
// RENDER TASKS
// ==========================
function render() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = "<p style='text-align:center;'>✨ No tasks found</p>";
        return;
    }

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add("task-item");
        li.draggable = true;

        // Drag events
        li.ondragstart = () => dragIndex = index;
        li.ondragover = e => e.preventDefault();
        li.ondrop = () => swap(index);

        const span = document.createElement("span");
        span.innerHTML = `
            ${task.text}
            <br>
            <small>📅 ${task.dueDate || "No date"}</small>
        `;

        if (task.completed) span.classList.add("completed");

        span.onclick = () => toggle(index);

        const delBtn = document.createElement("button");
        delBtn.innerHTML = "🗑";
        delBtn.onclick = () => remove(index);

        li.append(span, delBtn);
        taskList.appendChild(li);

        checkReminder(task);
    });

    updateCount();
}

// ==========================
// FEATURES
// ==========================
function toggle(index) {
    tasks[index].completed = !tasks[index].completed;
    save();
    render();
}

function remove(index) {
    tasks.splice(index, 1);
    save();
    render();
}

function swap(index) {
    [tasks[index], tasks[dragIndex]] = [tasks[dragIndex], tasks[index]];
    save();
    render();
}

function clearAll() {
    if (confirm("Delete all tasks?")) {
        tasks = [];
        save();
        render();
    }
}

clearAllBtn.onclick = clearAll;

function setFilter(type) {
    filter = type;
    render();
}

// ==========================
// STORAGE
// ==========================
function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ==========================
// TASK COUNT
// ==========================
function updateCount() {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    taskCount.textContent = `Total: ${total} | Done: ${done}`;
}

// ==========================
// REMINDER SYSTEM
// ==========================
function checkReminder(task) {
    if (!task.dueDate) return;

    const now = Date.now();
    const due = new Date(task.dueDate).getTime();
    const diff = due - now;

    if (diff > 0 && diff < 10000) {
        setTimeout(() => {
            alert("⏰ Reminder: " + task.text);
        }, diff);
    }
}

// ==========================
// BACKGROUND ROTATION
// ==========================
const backgrounds = [
    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1600",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600"
];

let bgIndex = 0;

function changeBackground() {
    document.body.style.backgroundImage = `url(${backgrounds[bgIndex]})`;
    bgIndex = (bgIndex + 1) % backgrounds.length;
}

changeBackground();
setInterval(changeBackground, 5000);

// INITIAL RENDER
render();
