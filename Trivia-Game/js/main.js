

window.onload = (e) => {
    //set defult values for local storage if not null
    if (localStorage.getItem("number") !== null) {
        document.querySelector("#questionNumber").value = localStorage.getItem("number") 
    } else {
        document.querySelector("#questionNumber").value = 10
    }
    if(localStorage.getItem("topic") !== null) {
        document.querySelector("#topics").value = localStorage.getItem("topic")
    } else {
        document.querySelector("#topics").value = 9
    }
    if (localStorage.getItem("mode") !== null) {
        document.querySelector("#modes").value = localStorage.getItem("mode")
    } else {
        document.querySelector("#modes").value = 'easy'
    }

//store the values when they are changed
    document.querySelector("#questionNumber").addEventListener("change", saveToLocalStorage);
    document.querySelector("#topics").addEventListener("change", saveToLocalStorage);
    document.querySelector("#modes").addEventListener("change", saveToLocalStorage);

    //for start button
    document.querySelector("#startButton").onclick = startButtonClicked
};

//array to store questions
let questions = [];
//question index
let currentQuestion = 0;
//number of corrent answers
let correctNum = 0;

//when the start button is clicked
function startButtonClicked() {
    hide("start");
    unhide("setup");
    unhide("box");

    // Remove previous event listener
    document.querySelector("#goButton").removeEventListener("click", goButtonClicked);

    // Add a new event listener
    document.querySelector("#goButton").addEventListener("click", goButtonClicked);


}

function goButtonClicked() {

    //url for trivia (no key needed)
    const triviaUrl = "https://opentdb.com/api.php?";
    //https://opentdb.com/api.php?amount=3&category=25&difficulty=easy&type=multiple

    //url
    let url = triviaUrl;

    //get number of questions
    number = document.querySelector("#questionNumber").value;

    //get topic
    topic = document.querySelector("#topics").value;

    //get mode
    mode = document.querySelector("#modes").value;

    //add them to url
    url += "amount=" + number;
    url += "&category=" + topic;
    url += "&difficulty=" + mode;

    //make it multiple choice
    url += "&type=multiple";


    //check if quation number is less than 50
    if (number <= 50) {
        //request data
        getData(url)
        console.log(url);

        //goto next page
        hide("setup");
        unhide("questions");

    } else {
        //tell user to pick less than 50
        document.querySelector("p#warning").innerHTML = "Must be 50 questions or less."

    }

}

//when next button is pressed
function nextButtonClicked() {
    hide("result");

    //increment question
    currentQuestion = currentQuestion + 1;

    document.getElementById("box").style.borderColor = "rgb(216, 161, 64)";
    unhide("questions");

    //check for more qu3stions
    if (currentQuestion < questions.length) {
        getQuestion(currentQuestion);

    } else {
        //go to the final screen
        getResult();

    }

}

//if play again button clicked
function againButtonClicked() {
    //reload the page
    location.reload();

}

function getResult() {
    hide("questions");
    unhide("final");

    document.querySelector("#final h1").innerHTML = correctNum + "/" + number

    // Remove previous event listener
    document.querySelector("#againButton").removeEventListener("click", againButtonClicked);

    // Add a new event listener
    document.querySelector("#againButton").addEventListener("click", againButtonClicked);

}


//hide the content
function hide(content) {
    document.getElementById(content).classList.add("hidden");

}
//make content show back up
function unhide(content) {
    document.getElementById(content).classList.remove("hidden");

}

//get data
function getData(url) {
    //create new XHR
    let xhr = new XMLHttpRequest();

    //set onload
    xhr.onload = dataLoaded;

    //set onerror
    xhr.onerror = dataError;

    //open connection and send request
    xhr.open("GET", url);
    xhr.send();

}

//if data cant load
function dataError() {
    console.log("An error occurred")
}

//function for loading the data into the page
function dataLoaded(e) {

    //e is the event
    let xhr = e.target;

    //turn text to js object
    let obj = JSON.parse(xhr.responseText);

    let results = obj.results

    //loop through questions
    for (let i = 0; i < results.length; i++) {

        //put each question into an array
        questions.push(results[i]);

    }

    //get first question
    getQuestion(currentQuestion)

}

//function for shuffling the answers array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//function to check for correct answer
function checkAnswer(ans, x) {
    //if correct
    if (ans == questions[x].correct_answer) {
        //use correct function
        correct();
    } else {
        //use incorrect function
        incorrect();
    }

}

//function for if correct
function correct() {
    //change title
    document.getElementById("box").style.borderColor = "rgb(105, 199, 152)";
    document.querySelector("#result h1").innerHTML = "CORRECT"
    document.querySelector("#result h1").style.color = "rgb(105, 199, 152)";
    //go to the screen
    hide("questions");
    unhide("result");

    //add amount to answers correct (FIX THIS)
    correctNum = correctNum + 1;
    console.log("correct: " + correctNum)

    // Remove previous event listener
    document.querySelector("#nextButton").removeEventListener("click", nextButtonClicked);

    // Add a new event listener
    document.querySelector("#nextButton").addEventListener("click", nextButtonClicked);

}

//function for if incorrect
function incorrect() {
    //change title
    document.getElementById("box").style.borderColor = "rgb(199, 105, 105)";
    document.querySelector("#result h1").innerHTML = "WRONG"
    document.querySelector("#result h1").style.color = "rgb(199, 105, 105)";
    //go to the screen
    hide("questions");
    unhide("result");

    // Remove previous event listener
    document.querySelector("#nextButton").removeEventListener("click", nextButtonClicked);

    // Add a new event listener
    document.querySelector("#nextButton").addEventListener("click", nextButtonClicked);
}

//function to get the specific question
function getQuestion(x) {

    //display the question
    document.querySelector("#questions h2").innerHTML = questions[x].question;

    //create an array of the answers
    let answers = []
    answers.push(questions[x].correct_answer)
    answers.push(...questions[x].incorrect_answers)

    //randomly sort them
    shuffle(answers)

    //display the answers
    const button = document.querySelectorAll("#answers button")

    for (let a = 0; a < button.length; a++) {
        button[a].innerHTML = answers[a];

        button[a].removeEventListener("click", checkAnswer);

        //use eventlistener to click buttons
        button[a].addEventListener("click", function () {
            //use the current answer
            const clicked = this.innerHTML;
            //call on function to check answers
            checkAnswer(clicked, x);
        })

    }
}

//function to save to storage
function saveToLocalStorage() {
    // store values in localStorage
    localStorage.setItem("number", document.querySelector("#questionNumber").value);
    localStorage.setItem("topic", document.querySelector("#topics").value);
    localStorage.setItem("mode", document.querySelector("#modes").value);
}