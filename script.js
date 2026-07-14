const dashboard = document.querySelector(".dashboard");
const featureCards = document.querySelectorAll(".feature-card");
const featurePages = document.querySelectorAll(".feature-page");
const backButtons = document.querySelectorAll(".back-btn");
const greeting = document.getElementById("greeting");
const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");

function updateDateTime() {
  const now = new Date();
  currentTime.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  currentDate.textContent = now.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
updateDateTime();
setInterval(updateDateTime, 1000);

function updateGreeting() {
  const hour = new Date().getHours();

  let text = "";
  if (hour >= 5 && hour < 12) {
    text = "Good Morning ☀️";
  } else if (hour >= 12 && hour < 17) {
    text = "Good Afternoon 🌤";
  } else if (hour >= 17 && hour < 21) {
    text = "Good Evening 🌇";
  } else {
    text = "Good Night 🌙";
  }
  greeting.textContent = text;
}
updateGreeting();

featureCards.forEach((card) => {
  card.addEventListener("click", () => {
    const feature = card.dataset.feature;
    dashboard.classList.add("hidden");
    featurePages.forEach((page) => {
      page.classList.add("hidden");
    });
    document.getElementById(`${feature}Page`).classList.remove("hidden");
  });
});

backButtons.forEach((button) => {
  button.addEventListener("click", () => {
    featurePages.forEach((page) => {
      page.classList.add("hidden");
    });

    dashboard.classList.remove("hidden");
  });
});

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyState = document.getElementById("emptyState");

let tasks = [];

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    alert("Please enter a task.");
    return;
  }

  const task = {
    id: Date.now(),

    text: text,

    completed: false,
  };

  tasks.push(task);

  taskInput.value = "";

  renderTasks();
}


function renderTasks() {
  taskList.innerHTML = "";

  emptyState.style.display = tasks.length === 0 ? "block" : "none";

  taskCount.textContent = `Total Tasks : ${tasks.length}`;

  tasks.forEach((task) => {
    const li = document.createElement("li");

    li.className = "task";

    li.dataset.id = task.id;

    li.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    class="complete-checkbox"
                    ${task.completed ? "checked" : ""}
                >

                <span class="${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>

            </div>

            <div class="task-right">

                <button class="edit-btn">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button class="delete-btn">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;

    taskList.appendChild(li);
  });
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTask();
    saveTasks();
  }
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
}
taskList.addEventListener("click", function (e) {
  const taskElement = e.target.closest(".task");

  if (!taskElement) return;

  const id = Number(taskElement.dataset.id);


  if (e.target.closest(".delete-btn")) {
    tasks = tasks.filter((task) => task.id !== id);

    saveTasks();

    renderTasks();
  }


  if (e.target.closest(".edit-btn")) {
    const task = tasks.find((task) => task.id === id);

    const updatedText = prompt("Edit Task", task.text);

    if (updatedText && updatedText.trim() !== "") {
      task.text = updatedText.trim();

      saveTasks();

      renderTasks();
    }
  }
});
taskList.addEventListener("change", function (e) {
  if (!e.target.classList.contains("complete-checkbox")) return;

  const taskElement = e.target.closest(".task");

  const id = Number(taskElement.dataset.id);

  const task = tasks.find((task) => task.id === id);

  task.completed = e.target.checked;

  saveTasks();

  renderTasks();
});


loadTasks();

renderTasks();


const plannerContainer = document.getElementById("plannerContainer");

const plannerData = JSON.parse(localStorage.getItem("planner")) || {};


const hours = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
];


function createPlanner() {
  plannerContainer.innerHTML = "";

  hours.forEach((hour, index) => {
    const slot = document.createElement("div");

    slot.className = "time-slot";

    slot.innerHTML = `
        
            <div class="slot-time">
                ${hour}
            </div>

            <input
                type="text"
                class="slot-input"
                data-index="${index}"
                placeholder="What's your plan?"
                value="${plannerData[index] || ""}"
            >

            <button
                class="save-slot"
                data-index="${index}"
            >
                Save
            </button>

        `;

    plannerContainer.appendChild(slot);
  });
}

createPlanner();


plannerContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("save-slot")) return;

  const index = e.target.dataset.index;

  const input = plannerContainer.querySelector(
    `.slot-input[data-index="${index}"]`,
  );

  plannerData[index] = input.value;

  localStorage.setItem("planner", JSON.stringify(plannerData));

  e.target.textContent = "Saved ✓";

  setTimeout(() => {
    e.target.textContent = "Save";
  }, 1000);
});


function highlightCurrentHour() {
  const currentHour = new Date().getHours();

  let plannerHour = currentHour;


  if (plannerHour >= 6 && plannerHour <= 22) {
    const index = plannerHour - 6;

    const slots = document.querySelectorAll(".time-slot");

    slots.forEach((slot) => {
      slot.classList.remove("current-slot");
    });

    if (slots[index]) {
      slots[index].classList.add("current-slot");
    }
  }
}

highlightCurrentHour();


const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalList = document.getElementById("goalList");
const goalEmpty = document.getElementById("goalEmpty");
const progressFill = document.getElementById("progressFill");
const goalProgressText = document.getElementById("goalProgressText");

let goals = JSON.parse(localStorage.getItem("goals")) || [];

function addGoal() {
  const text = goalInput.value.trim();

  if (text === "") {
    alert("Please enter a goal.");

    return;
  }

  const goal = {
    id: Date.now(),

    text,

    completed: false,
  };

  goals.push(goal);

  goalInput.value = "";

  saveGoals();

  renderGoals();
}

function saveGoals() {
  localStorage.setItem(
    "goals",

    JSON.stringify(goals),
  );
}

function updateProgress() {
  const completedGoals = goals.filter((goal) => goal.completed).length;

  goalProgressText.textContent = `${completedGoals} / ${goals.length}`;

  const percentage =
    goals.length === 0 ? 0 : (completedGoals / goals.length) * 100;

  progressFill.style.width = percentage + "%";
}

function renderGoals() {
  goalList.innerHTML = "";

  goalEmpty.style.display = goals.length === 0 ? "block" : "none";

  goals.forEach((goal) => {
    const li = document.createElement("li");

    li.className = "goal-item";

    li.dataset.id = goal.id;

    li.innerHTML = `

            <div class="goal-left">

                <input

                    type="checkbox"

                    class="goal-checkbox"

                    ${goal.completed ? "checked" : ""}

                >

                <span class="${goal.completed ? "goal-completed" : ""}">

                    ${goal.text}

                </span>

            </div>

            <div class="goal-actions">

                <button class="delete-goal">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;

    goalList.appendChild(li);
  });

  updateProgress();
}

addGoalBtn.addEventListener(
  "click",

  addGoal,
);

goalInput.addEventListener(
  "keydown",

  function (e) {
    if (e.key === "Enter") {
      addGoal();
    }
  },
);

goalList.addEventListener(
  "click",

  function (e) {
    const item = e.target.closest(".goal-item");

    if (!item) return;

    const id = Number(item.dataset.id);

    if (e.target.closest(".delete-goal")) {
      goals = goals.filter((goal) => goal.id !== id);

      saveGoals();

      renderGoals();
    }
  },
);

goalList.addEventListener(
  "change",

  function (e) {
    if (!e.target.classList.contains("goal-checkbox")) return;

    const item = e.target.closest(".goal-item");

    const id = Number(item.dataset.id);

    const goal = goals.find((goal) => goal.id === id);

    goal.completed = e.target.checked;

    saveGoals();

    renderGoals();
  },
);
renderGoals();


const timerDisplay = document.getElementById("timerDisplay");

const startBtn = document.getElementById("startTimer");

const pauseBtn = document.getElementById("pauseTimer");

const resetBtn = document.getElementById("resetTimer");

const sessionType = document.getElementById("sessionType");

let timer;

let workTime = 25 * 60;

let breakTime = 5 * 60;

let timeLeft = workTime;

let isRunning = false;

let isWorkSession = true;


function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);

  const seconds = timeLeft % 60;

  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

updateTimer();


startBtn.addEventListener("click", () => {
  if (isRunning) return;

  isRunning = true;

  timer = setInterval(() => {
    timeLeft--;

    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(timer);

      isRunning = false;

      alert("Session Complete!");

      if (isWorkSession) {
        isWorkSession = false;

        sessionType.textContent = "Break Session";

        timeLeft = breakTime;
      } else {
        isWorkSession = true;

        sessionType.textContent = "Work Session";

        timeLeft = workTime;
      }

      updateTimer();
    }
  }, 1000);
});


pauseBtn.addEventListener("click", () => {
  clearInterval(timer);

  isRunning = false;
});


resetBtn.addEventListener("click", () => {
  clearInterval(timer);

  isRunning = false;

  isWorkSession = true;

  sessionType.textContent = "Work Session";

  timeLeft = workTime;

  updateTimer();
});


const quoteText = document.getElementById("quoteText");

const quoteAuthor = document.getElementById("quoteAuthor");

const newQuoteButton = document.getElementById("newQuoteButton");

const quote = document.querySelector("#quote");
const author = document.querySelector("#author");
async function getQuote() {
  try {
    quoteText.textContent = "Loading...";

    quoteAuthor.textContent = "";

    const response = await fetch("https://dummyjson.com/quotes/random");

    const data = await response.json();

    quoteText.textContent = `"${data.quote}"`;
    quote.textContent = data.quote;

    quoteAuthor.textContent = `- ${data.author}`;
    author.textContent = data.author;
  } catch (error) {
    quoteText.textContent = "Failed to load quote.";

    quoteAuthor.textContent = "";

    console.error(error);
  }
}


newQuoteButton.addEventListener(
  "click",

  getQuote,
);


getQuote();


const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");

  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem(
      "theme",

      "dark",
    );
  } else {
    localStorage.setItem(
      "theme",

      "light",
    );
  }
});
navigator.geolocation.getCurrentPosition((position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  getLocation(latitude, longitude);
  getWeather(latitude,longitude);
});

const temperature = document.getElementById('temperature');
const userLocation = document.getElementById('location');
const weatherCondition = document.getElementById("weatherCondition"); 

async function getLocation(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch location");
    }
    const data = await response.json();
    const city =
    data.address.city ||
    data.address.town ||
    data.address.village;

   const state = data.address.state;
   const country = data.address.country;
   console.log(data);

   userLocation.innerText = city + " , " +state ;

  } catch (error) {
    console.error("Error fetching location:", error);
  }
}

async function getWeather(latitude,longitude){
    try{
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`)
        if(!response.ok){
            throw new Error("Failed to fetch location");
        }
        const data = await response.json();
        console.log(data);
        console.log(data.current.temperature_2m);
        temperature.innerText = data.current.temperature_2m + data.current_units.temperature_2m;

    }
    catch(error){
        console.log("Failed to fetch the weather!!!");

    }
}



