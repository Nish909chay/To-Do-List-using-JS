// Modern, minimalist To-Do List app with animations, localStorage, motivational quotes, and dark/light mode
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const addBtn = document.getElementById("add-btn");
const quoteBox = document.getElementById("motivational-quote");
const taskCounter = document.getElementById("task-counter");
const modeToggle = document.getElementById("mode-toggle");

const QUOTES = [
  "You got this!",
  "One task at a time!",
  "Stay focused, stay zen.",
  "Progress, not perfection.",
  "Small steps every day.",
  "Your future self will thank you.",
  "Keep going!",
  "Make it happen!",
  "Dream. Plan. Do.",
  "Done is better than perfect."
];

function showRandomQuote() {
  const idx = Math.floor(Math.random() * QUOTES.length);
  quoteBox.textContent = QUOTES[idx];
}

function updateTaskCounter() {
  const tasks = document.querySelectorAll('.task-item');
  const count = tasks.length;
  taskCounter.textContent = count === 1 ? '1 task' : `${count} tasks`;
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('.task-item').forEach(li => {
    tasks.push({
      text: li.querySelector('.task-text').textContent,
      completed: li.classList.contains('completed')
    });
  });
  localStorage.setItem('zenTasks', JSON.stringify(tasks));
}

function loadTasks() {
  listContainer.innerHTML = '';
  const tasks = JSON.parse(localStorage.getItem('zenTasks') || '[]');
  tasks.forEach(task => addTaskToDOM(task.text, task.completed));
  updateTaskCounter();
}

function addTaskToDOM(text, completed = false) {
  const li = document.createElement('li');
  li.className = 'task-item' + (completed ? ' completed' : '');
  li.innerHTML = `
    <button class="task-checkbox" title="Mark as done">
      <i class="fa-regular fa-circle${completed ? '-check' : ''}"></i>
    </button>
    <span class="task-text">${text}</span>
    <button class="delete-btn" title="Delete task"><i class="fa-solid fa-trash"></i></button>
  `;
  // Animation
  li.style.opacity = '0';
  listContainer.appendChild(li);
  setTimeout(() => { li.style.opacity = '1'; }, 10);
  updateTaskCounter();
}

function handleAddTask() {
  const text = inputBox.value.trim();
  if (!text) {
    inputBox.classList.add('input-error');
    inputBox.placeholder = 'Please enter a task!';
    setTimeout(() => {
      inputBox.classList.remove('input-error');
      inputBox.placeholder = 'Add your task...';
    }, 1200);
    return;
  }
  addTaskToDOM(text);
  inputBox.value = '';
  saveTasks();
}

addBtn.addEventListener('click', handleAddTask);
inputBox.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleAddTask();
});

listContainer.addEventListener('click', e => {
  const li = e.target.closest('.task-item');
  if (!li) return;
  if (e.target.closest('.delete-btn')) {
    // Animate removal
    li.classList.add('removing');
    setTimeout(() => {
      li.remove();
      saveTasks();
      updateTaskCounter();
    }, 300);
  } else if (e.target.closest('.task-checkbox')) {
    li.classList.toggle('completed');
    // Change icon
    const icon = li.querySelector('.task-checkbox i');
    icon.className = 'fa-regular ' + (li.classList.contains('completed') ? 'fa-circle-check' : 'fa-circle');
    saveTasks();
    updateTaskCounter();
  }
});

// Dark/Light mode toggle
function setMode(dark) {
  document.body.classList.toggle('dark', dark);
  const icon = modeToggle.querySelector('i');
  icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('zenTasksMode', dark ? 'dark' : 'light');
}
modeToggle.addEventListener('click', () => {
  setMode(!document.body.classList.contains('dark'));
});
(function initMode() {
  const mode = localStorage.getItem('zenTasksMode');
  setMode(mode === 'dark');
})();

// On load
showRandomQuote();
loadTasks();

// Optional: Show a new quote on refresh
window.addEventListener('focus', showRandomQuote);
