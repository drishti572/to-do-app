const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearAllBtn = document.getElementById("clearAll");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";
let dragIndex = null;

/* Add Task */
addBtn.onclick = addTask;

function addTask() {
    const text = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (!text) return;

    tasks.push({ text, completed: false, dueDate });
    save();
    taskInput.value = "";
    dueDateInput.value = "";
    render();
}

/* Render */
function render() {
    taskList.innerHTML = "";

    let filtered = tasks.filter(t => {
        if (filter === "completed") return t.completed;
        if (filter === "pending") return !t.completed;
        return true;
    });

    filtered.forEach((task, i) => {
        const li = document.createElement("li");
        li.draggable = true;

        li.ondragstart = () => dragIndex = i;
        li.ondragover = e => e.preventDefault();
        li.ondrop = () => swap(i);

        const span = document.createElement("span");
        span.innerHTML = `${task.text}<br><small>📅 ${task.dueDate || "No date"}</small>`;
        if (task.completed) span.classList.add("completed");
        span.onclick = () => toggle(i);

        const del = document.createElement("button");
        del.textContent = "✖";
        del.onclick = () => remove(i);

        li.append(span, del);
        taskList.appendChild(li);

        checkReminder(task);
    });

    updateCount();
}

/* Features */
function toggle(i) {
    tasks[i].completed = !tasks[i].completed;
    save(); render();
}

function remove(i) {
    tasks.splice(i, 1);
    save(); render();
}

function swap(i) {
    [tasks[i], tasks[dragIndex]] = [tasks[dragIndex], tasks[i]];
    save(); render();
}

function clearAll() {
    tasks = [];
    save(); render();
}

clearAllBtn.onclick = clearAll;

function setFilter(type) {
    filter = type;
    render();
}

function updateCount() {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    taskCount.textContent = `Total: ${total} | Done: ${done}`;
}

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* 🔔 Reminder */
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

/* 🎬 Auto Background (FIXED) */
const backgrounds = [
    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1600",
    "https://media.istockphoto.com/id/1355861741/photo/father-and-son-having-fun-while-playing-with-ball-at-park.webp?a=1&b=1&s=612x612&w=0&k=20&c=Z-Hc5mK_z8JHihooHYrencHOPXpg30bW7rnbeRFw3Yc=",
    "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWF0aW5nfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1619982998302-752bc70afcff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGFuY2luZ3xlbnwwfHwwfHx8MA%3D%3D"
];

let bgIndex = 0;

function changeBackground() {
    document.body.style.backgroundImage = `url(${backgrounds[bgIndex]})`;
    bgIndex = (bgIndex + 1) % backgrounds.length;
}

/* ✅ RUN ONCE ONLY */
changeBackground();
setInterval(changeBackground, 5000);

render();
