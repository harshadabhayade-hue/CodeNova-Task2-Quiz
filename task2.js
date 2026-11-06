
// Get HTML elements
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const questionNumber = document.getElementById("questionNumber");
const scoreElement = document.getElementById("score");
const progressBar = document.getElementById("progressBar");
const feedback = document.getElementById("feedback");

// Quiz variables
let questions = [];
let currentQuestion = 0;
let score = 0;
let answered = false;

// Start quiz
startBtn.addEventListener("click", startQuiz);

async function startQuiz() {
    startBtn.disabled = true;
    startBtn.textContent = "Loading...";

    try {
        const response = await fetch("questions.json");

        if (!response.ok) {
            throw new Error("Could not load questions.");
        }

        questions = await response.json();

        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error("Question bank is empty.");
        }

        currentQuestion = 0;
        score = 0;

        startScreen.classList.add("hidden");
        resultScreen.classList.add("hidden");
        quizScreen.classList.remove("hidden");

        showQuestion();

    } catch (error) {
        alert("Unable to load questions. Please run the website using Live Server.");
        console.error(error);
    } finally {
        startBtn.disabled = false;
        startBtn.textContent = "Start Quiz";
    }
}

// Display question
function showQuestion() {
    answered = false;

    const q = questions[currentQuestion];

    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    scoreElement.textContent = `Score: ${score}`;

    progressBar.style.width =
        `${(currentQuestion / questions.length) * 100}%`;

    questionElement.textContent = q.question;

    optionsElement.innerHTML = "";
    feedback.textContent = "";
    nextBtn.disabled = true;

    q.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.textContent = option;
        button.classList.add("option");

        button.addEventListener("click", () => {
            checkAnswer(index);
        });

        optionsElement.appendChild(button);
    });
}

// Check selected answer
function checkAnswer(selectedIndex) {
    if (answered) return;

    answered = true;

    const q = questions[currentQuestion];
    const optionButtons = optionsElement.querySelectorAll(".option");

    optionButtons.forEach((button, index) => {
        button.disabled = true;

        if (index === q.answer) {
            button.classList.add("correct");
        }
    });

    if (selectedIndex === q.answer) {
        score++;
        feedback.textContent =
            "Correct! " + q.explanation;
    } else {
        optionButtons[selectedIndex].classList.add("wrong");

        feedback.textContent =
            "Incorrect! " + q.explanation;
    }

    scoreElement.textContent = `Score: ${score}`;

    progressBar.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    nextBtn.disabled = false;

    if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = "See Results";
    } else {
        nextBtn.textContent = "Next Question →";
    }
}

// Move to next question
nextBtn.addEventListener("click", () => {
    if (!answered) return;

    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

// Show final result
function showResult() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    const percentage = (score / questions.length) * 100;

    document.getElementById("finalScore").textContent =
        `You scored ${score} out of ${questions.length} (${percentage}%)`;

    let message;

    if (percentage >= 80) {
        message = "Excellent work! You did amazing! 🎉";
    } else if (percentage >= 50) {
        message = "Good job! Keep practising! 👍";
    } else {
        message = "Keep learning and try again! 💪";
    }

    document.getElementById("resultMessage").textContent = message;
}

// Restart quiz without reloading the page
restartBtn.addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;

    resultScreen.classList.add("hidden");
    quizScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");

    progressBar.style.width = "0%";
    nextBtn.textContent = "Next Question →";
});
