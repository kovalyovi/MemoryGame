//Variables needed for app control
let counter = 0;
let moves = 0;
let correctLeft = 8;
let openCards = [];
let timer;
let numStars = 5;

//shuffling any array
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//hide all cards on the screen
const hideCards = () => {
    const cards = document.querySelector('.deck').children;
    if (cards) {
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            card.classList.remove('open');
            card.classList.remove('show');
            card.classList.remove('match');
        }
    }
};

//increment timer every second
const timerIncrement = () => {
    let secondsContainer = document.querySelector('.seconds');
    let minutesContainer = document.querySelector('.minutes');
    let seconds = parseInt(secondsContainer.innerHTML);
    let minutes = parseInt(minutesContainer.innerHTML);

    if (++seconds >= 60) {
      seconds = 0;
      minutes++;
    }

    //when displaying numbers less then 10 - add 0 to the beginning
    let secondsString = seconds < 10 ? "0" + seconds.toString() : seconds.toString();
    let minutesString = minutes < 10 ? "0" + minutes.toString() : minutes.toString();

    secondsContainer.innerHTML = secondsString;
    minutesContainer.innerHTML = minutesString;
};

//resets the timer
const clearTimer = () => {
    document.querySelector('.seconds').innerHTML = '00';
    document.querySelector('.minutes').innerHTML = '00';
};

//stops the timer interval
const stopTimer = () =>  {
    clearInterval(timer);
    clearTimer();
};

//starting the timer
const startTimer = () => timer = setInterval(timerIncrement, 1000);

//restarting the game
function restartGame() {

    stopTimer();

    //get deck location and copy it to a variable to make manipulations for faster performance
    let oldDeck = document.querySelector('.deck');
    let deck = oldDeck.cloneNode(true);
    let cards = deck.children;

    hideCards();

    //shuffling using array
    cards = Array.from(cards);
    shuffle(cards);

    //removing all components from a new deck
    while(deck.firstChild) {
        deck.removeChild(deck.lastChild);
    }

    //reassigning new cards to the deck
    cards.forEach(card => deck.appendChild(card));

    //putting deck back to the DOM
    oldDeck.parentNode.replaceChild(deck, oldDeck);
    document.querySelector('.deck').addEventListener('click', respondToTheClick);

    //resetting game parameters
    clearScoreStars();
    hideCards();
    showCards();
    setTimeout(hideCards, 1500);
    setTimeout(() => {
        moves = 0;
        counter = 0;
        correctLeft = 8;
        openCards = [];
        document.querySelector('.moves').textContent = (moves).toString();
    }, 500);
    setTimeout(startTimer, 1500);

    //since we restart game in the beginning of the app, this statement helps us
    //control RESTART button
    let finishInterface = document.querySelector('.won');
    if (finishInterface) {
        finishInterface.parentNode.removeChild(finishInterface);
    }

    if (document.querySelector('.finished')) {
        toggleInterface();
    }

    //after the game is started - stars are on the left, not center
    document.querySelector('.score-panel').classList.remove('center');
}

//what happens when you click on a card
const respondToTheClick = (evt) => {
    const element = evt.target.nodeName === "I" ? evt.target.parentElement : evt.target;
    if  (element.nodeName !== 'UL'
         && !element.classList.contains('match')
         && !element.classList.contains('open')
         && !element.classList.contains('not-match')
         && counter < 2) {
        element.classList.add('open');
        element.classList.add('show');
        counter++;
        openCards.push(element);
    }

    //once two cards are opened:
    if (counter === 2) {
        setTimeout(() => document.querySelector('.moves').textContent = (++moves).toString(), 150);
        setTimeout(checkAnswer, 500);
        counter++;
    }
};

//checking whether the two cards match
const checkAnswer = () => {
    if (openCards[0].children[0] && openCards[1].children[0]) {
        if (openCards[0].children[0].classList.toString() === openCards[1].children[0].classList.toString()) {
            openCards.forEach((e) => {
                e.classList.add('match');
            });
            if (!--correctLeft) {
               finishGame();
            }
        }
        openCards.forEach((e) => {
            e.classList.remove('open');
            setTimeout(() => e.classList.remove('show'), 600);
            e.classList.add('not-match');
            setTimeout(() => e.classList.remove('not-match'), 800);

        });
        openCards = [];
        counter = 0;
    }
};

//clears the stars
const clearScoreStars = () => {
    const stars = document.querySelector('.stars').children;
    for (let i = 0; i < stars.length; i++) {
        stars[i].children[0].classList.remove('fas');
        stars[i].children[0].classList.add('far');
    }
};

//appending score stars
const appendScoreStars = (stars, len) => {
    clearScoreStars();
    for (let i = 0; i < len; i++) {
      stars[i].children[0].classList.replace('far', 'fas');
    }
};

//adding score stars
const addStars = () => {
    let stars = document.querySelector('.stars').children;
    if (moves < 12) {
        numStars = 5;
    } else if (moves < 16) {
        numStars--;
    } else if (moves < 19) {
        numStars -= 2;
    } else if (moves < 21) {
        numStars -= 3;
    } else if (moves < 24) {
        numStars -= 4;
    } else {
        numStars -= 5;
    }
    appendScoreStars(stars, numStars)
};

//all interface elements are either displayed or not
const toggleInterface = () => {
    const interfaces = document.querySelectorAll('.interface');
    interfaces.forEach(e => e.classList.toggle('finished'));
};

//adding the FINISHED table (after guessing all cards correct)
const addTable = (location) => {

    //first, create virtual element with class WON
    let finishTable = document.createElement('div');
    finishTable.classList.add('won');

    //trophy image
    const zero = document.createElement('img');
    zero.alt = "Golden Trophy";
    zero.width = 300;
    zero.height = 300;

    let imgSrc = "";
    if (numStars > 4) {
        imgSrc = "./img/gold_trophy.png";
    } else if (numStars > 2) {
        imgSrc = "./img/silver_trophy.png";
    } else if (numStars > 0) {
        imgSrc = "./img/bronze_trophy.png";
    } else {
        imgSrc = "./img/candies.png";
        zero.width = 600;
    }
    zero.src = imgSrc;

    //header
    const first = document.createElement('h1');
    first.innerHTML = "Congratulations! You Won!";

    //paragraphs
    const second = document.createElement('p');
    second.innerHTML = "With " + "<strong>" + moves + "</strong>" + " Moves and " + "<strong>" + numStars + "</strong>" + " Stars.";

    const third = document.createElement('p');
    third.innerHTML = "It took for you " +
        document.querySelector('.minutes').textContent + " minutes and " +
        document.querySelector('.seconds').textContent + " seconds to finish!";

    //button
    const fourth = document.createElement('button');
    fourth.textContent = "Play again!";
    fourth.addEventListener('click', restartGame);

    //appending all to the virtual element
    finishTable.appendChild(zero);
    finishTable.appendChild(first);
    finishTable.appendChild(second);
    finishTable.appendChild(third);
    finishTable.appendChild(fourth);

    //appending virtual element to real DOM (to save time)
    location.parentNode.insertBefore(finishTable, location.nextSibling);
};

//finishes the game (displays the WIN window)
const finishGame = () => {
    addStars();
    const deck = document.querySelector('.deck');
    addTable(deck);
    stopTimer();
    toggleInterface();
    document.querySelector('.score-panel').classList.add('center');
};

//displays cards when guessed right
const showCards = () => {
    const cards = document.querySelector('.deck').children;
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.add('open');
        cards[i].classList.add('show');
    }
};

//adding button to the restart method
document.querySelector('.restart').addEventListener('click', restartGame);

//once the page is loaded, starting the game
window.addEventListener('load', () => {
   showCards();
   restartGame();
   setTimeout(hideCards, 1500);
});
