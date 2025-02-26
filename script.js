const startgamecontainer = document.querySelector(".startgame"),
      startgamecards = document.querySelectorAll(".startgame .card"),
      startgame = document.querySelector(".startgame button"),
      playground = document.querySelector(".playground"),
      faRepeat = document.querySelector(".fa-repeat"),
      timeDisplay = document.querySelector(".time"),  // To display the timer
      attemptsDisplay = document.querySelector(".attempts"); // To display the attempts

let levels = 2, columns = 2, rows = 2, matched = 0, cardOne, cardTwo, isPreventClick = true, attempts = 0, timer, seconds = 0;

startgamecards.forEach((element) => {
   element.addEventListener("click", (e) => {
       startgamecards.forEach((el) => {
           el.classList.remove("active");
       });
       e.target.parentElement.classList.add("active");
       levels = e.target.parentElement.getAttribute("level");
       columns = e.target.parentElement.getAttribute("column");
       rows = e.target.parentElement.getAttribute("row");

       console.log(levels, columns, rows);
   });
});

startgame.addEventListener("click", (e) => {
    startgamecontainer.style.display = "none";
    playground.style.display = "grid";

    playground.style.gridTemplateColumns = `repeat(${columns}, 100px)`;
    playground.style.gridTemplateRows = `repeat(${rows}, 100px)`;
    createCards();

    // Start the timer
    startTimer();
});

function createCards() {
    const totalCards = columns * rows;
    const cardArr = [
        "house",
        "bomb",
        "poo",
        "gift",
        "egg",
        "dragon",
        "person-biking",
        "jet-fighter-up",
    ].slice(0, totalCards / 2); // Only use the required number of unique cards
    shuffleArray(cardArr);
    shuffleCards([...cardArr.slice(0,levels), ...cardArr.slice(0,levels)]);
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));  // Fixed this line
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
};

function shuffleCards(cards) {
    playground.innerHTML = "";
    shuffleArray(cards);
    for (let i = 0; i < cards.length; i++) {
        playground.innerHTML += `
            <div class="card" onclick='flipCard(this)'>
                <div class="front"><i class="fas fa-question"></i></div>
                <div class="back"><i class="fas fa-${cards[i]}"></i></div>
            </div>
        `;
    }

    // Show reset button after the cards are shuffled
    faRepeat.style.display = "block";
}

function flipCard(card) {
    if (cardOne !== card && isPreventClick) {
        card.classList.add('flip');
        if (!cardOne) {
            cardOne = card;
            return;
        }
        cardTwo = card;
        isPreventClick = false;
        attempts++;  // Increment attempts each time a player clicks two cards
        attemptsDisplay.textContent = `Attempts: ${attempts}`;

        let cardOneValue = cardOne.querySelector(".back").innerHTML,
            cardTwoValue = cardTwo.querySelector(".back").innerHTML;
        matchCards(cardOneValue, cardTwoValue);
    }
}

function matchCards(cardOneValue, cardTwoValue) {
    if (cardOneValue === cardTwoValue) {
        matched++;
        if (matched === levels) {
            setTimeout(() => {
                alert(`Congratulations you won! Time: ${seconds}s, Attempts: ${attempts}`);
                stopTimer();  // Stop the timer when game is won
            }, 500);
        }
        cardOne.classList.add("match");
        cardTwo.classList.add("match");
        cardOne.removeAttribute("onclick");
        cardTwo.removeAttribute("onclick");

        cardOne = "";
        cardTwo = "";
        isPreventClick = true;
        return;
    }

    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 500);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = "";
        cardTwo = "";
        isPreventClick = true;
    }, 1200);
}

faRepeat.addEventListener("click", () => {
    startgamecontainer.style.display = "grid";
    playground.style.display = "none";
    faRepeat.style.display = "none";
    matched = 0;
    cardOne = "";
    cardTwo = "";
    isPreventClick = true;
    attempts = 0;
    attemptsDisplay.textContent = `Attempts: ${attempts}`;
    seconds = 0;
    timeDisplay.textContent = `Time: 0s`;  // Reset the time display
    stopTimer();  // Stop the previous timer if there is one
});

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        timeDisplay.textContent = `Time: ${seconds}s`;  // Update the time display
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);  // Stop the timer when the game ends
}
