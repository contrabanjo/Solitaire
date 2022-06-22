console.log("javascript loaded")

const cards = [];
const suites = ["heart", "club", "diamond", "spade"];
const suiteValues = {
    heart: 0,
    diamond: 0,
    club: 0,
    spade: 0
}

suites.forEach((suite)=>{
    for (let i = 1; i<14; i++){
        const newCard = createCard(i, suite);
        cards.push(newCard);
    }
})

//credit: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}
//shuffle(cards);

populateSuites();
populatePlayArea();

let deck = cards.slice();
let temporaryDeck = cards.slice();

// const playArea = document.getElementById("playArea");
// cards.forEach((card)=>{
//     playArea.appendChild(card);
// })

const deckElement = document.getElementById("deck");
deckElement.addEventListener("click", deckClickHandler);

function deckClickHandler(e){
    const reciever = document.getElementById("deck-reciever");
    if (temporaryDeck.length > 0){
        const nextCard = temporaryDeck.pop();
        nextCard.classList.add("front");
        console.log("temporary deck", temporaryDeck);
        console.log("deck", deck)
        console.log("next card", nextCard);
        reciever.appendChild(nextCard);
    } else {
        temporaryDeck = deck.slice();
    }
}

function removeCardFromDeck(removedCard){
    deck = deck.filter((card)=>card.id !==removedCard.id);
}

function populateSuites(){
    const suiteArea = document.getElementById("suites");
    suites.forEach((suite)=>{
        const newReciever = createCardReciever();
        newReciever.id = suite;
        newReciever.classList.add("suite-area-reciever");
        suiteArea.appendChild(newReciever);
    })
    console.log("suite area populated");
}

function populatePlayArea(){
    const playArea = document.getElementById("playArea")
    for (let i=1; i<=7; i++){
        const newStack = document.createElement("div");
        newStack.classList.add("stack");
        newStack.addEventListener("dragover", (e)=>{
            e.preventDefault();
        })

        newStack.addEventListener("dragenter", (e)=>{
            e.preventDefault();
        })
        newStack.addEventListener("drop", (e)=>{
            const card = document.getElementById(e.dataTransfer.getData("text/HTML"));
            const topCard = newStack.lastChild;
            if (canBeStacked(card, topCard)){
                addCardToStack(card, newStack);
                removeCardFromDeck(card);
            }
        })
        for (let j=0; j<i; j++){
            const newCard = cards.pop();
            newCard.classList.add("back");

            addCardToStack(newCard, newStack);
        }
        playArea.appendChild(newStack);
    }
    console.log("play area populated");
}

function addCardToStack(card, stack){
    card.style.top = stack.children.length * 20 + "px";
    stack.appendChild(card);
}

function parseCardID(id){
    const parts = id.split("-")
    return {
        number: Number(parts[0]),
        suite: parts[1]
    }
}

function canBePlacedInSuites(card){
    card = parseCardID(card.id);

    console.log(card.number, " : ", suiteValues[card.suite]);
    if (card.number === (suiteValues[card.suite] + 1)){
        return true;
    } else {
        return false;
    }
}

function doubleClickHandler(e){
    console.log(e.target.id, " has been double clicked:", )
    const card = e.target;
    if (canBePlacedInSuites(card)){
        addCardToSuites(card);
        removeCardFromDeck(card);
    }

}

function addCardToSuites(card){
    card.style.top = "0";
    suite = parseCardID(card.id).suite;
    const suiteReciever = document.getElementById(suite);
    suiteValues[suite]+= 1;
    suiteReciever.appendChild(card);

}

function canBeStacked(draggedCard, dropCard){
    const drag = parseCardID(draggedCard.id)
    if (!dropCard) {
        if (drag.number === 13) return true;
        else return false;
    }
    const drop = parseCardID(dropCard.id);

    const red = ["diamond", "heart"];
    const black = ["spade", "club"];


    if (drag.number === drop.number - 1){
        if (red.includes(drag.suite) && black.includes(drop.suite)){
            return true;
        }
        else if (red.includes(drop.suite) && black.includes(drag.suite)){
            return true;
        }
    } else {
        return false;
    }
}

function createCardReciever(dropFunction){
    const newReciever = document.createElement("div");
    newReciever.classList.add("card");
    newReciever.addEventListener("dragover", (e)=>{
        e.preventDefault();
    })

    newReciever.addEventListener("dragenter", (e)=>{
        e.preventDefault();
    })

    newReciever.addEventListener("drop", (e)=>{
        console.log("card has been dropped on ", newReciever.id)
    })

    return newReciever;
}

function createCard(number, suite){
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.draggable = "true";
    newCard.id = number + "-" + suite;
    newCard.appendChild(createCardLabel(number, suite));
    newCard.appendChild(createCardDisplay(number, suite));
    newCard.appendChild(createCardLabel(number, suite));

    newCard.addEventListener("dragstart", (e)=>{
        e.dataTransfer.setData("text/HTML", e.target.id);
    })

    newCard.addEventListener("dragover", (e)=>{
        e.preventDefault();
    })

    newCard.addEventListener("dragenter", (e)=>{
        e.preventDefault();
    })

    newCard.addEventListener("drop", (e)=>{
        console.log(e.dataTransfer.getData("text/HTML") + " card has been dropped on ", newCard.id)
    })

    newCard.addEventListener("click", flipCard);

    newCard.addEventListener("dblclick", doubleClickHandler);



    return newCard;
}

function createCardLabel(number, suite){
    const newCardLabel = document.createElement("div");
    newCardLabel.classList.add("label");
    newCardLabel.textContent = playingCardValue(number);
    const newCardLabelImage = document.createElement("img");
    newCardLabelImage.src = "./" + suite + ".svg";
    newCardLabel.appendChild(newCardLabelImage);
    return newCardLabel;
}

function playingCardValue(number){
    switch(number){
            case 11:
               return "J"
            case 12:
                return "Q"
            case 13:
               return "K"
            case 1:
                return "A"
            default:
                return "" + number;
        }
}

function createCardDisplay(number, suite){
    const newDisplay = document.createElement("div");
    newDisplay.classList.add("display");
    if (number < 11 && number !== 1){
        for(let i = 0; i < number; i++){
            const newSymbol = document.createElement("img");
            newSymbol.src = "./" + suite + ".svg"
            newDisplay.appendChild(newSymbol);
        }
    } else{
        const newSymbol = document.createElement("div");
        newSymbol.classList.add("face");
        newSymbol.textContent = playingCardValue(number);
        newSymbol.style.backgroundImage = "url('./" + suite + ".svg')";
        newDisplay.appendChild(newSymbol);
    }
    return newDisplay;
}

function flipCard(e){
    if (e.target.classList.contains("back")){
        e.target.classList.remove("back");
        e.target.classList.add("front");
    }
    console.log("card has been flipped")
}

