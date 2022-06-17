console.log("javascript loaded")
populateSuites();
//populatePlayArea();

const cards = [];
const suites = ["heart", "club", "diamond", "spade"];
suites.forEach((suite)=>{
    for (let i = 2; i<14;i++){
        const newCard = createCard(i, suite);
        newCard.classList.add("front");
        cards.push(newCard);
    }
})

const playArea = document.getElementById("playArea");
cards.forEach((card)=>{
    playArea.appendChild(card);
})


function populateSuites(){
    const suiteArea = document.getElementById("suites");
    for (let i=0; i<4; i++){
        const newReciever = createCardReciever();
        newReciever.id = "Suite" + (i+1);
        newReciever.classList.add("suite-area-reciever");
        suiteArea.appendChild(newReciever);
    }
    console.log("suite area populated");
}

function populatePlayArea(){
    const playArea = document.getElementById("playArea")
    for (let i=1; i<=7; i++){
        const newStack = document.createElement("div");
        newStack.classList.add("stack");
        for (let j=0; j<i; j++){
            const newCard = createCard(2, "diamond");
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

    //stack.appendChild(createCardReciever())
}


function createCardReciever(){
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
    newCard.appendChild(createCardLabel(number, suite));
    newCard.appendChild(createCardDisplay(number, suite));
    newCard.appendChild(createCardLabel(number, suite));


    newCard.addEventListener("click", flipCard);

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
            case 10:
               return "J"
            case 11:
                return "Q"
            case 12:
               return "K"
            case 13:
                return "A"
            default:
                return "" + number;
        }
}

function createCardDisplay(number, suite){
    const newDisplay = document.createElement("div");
    newDisplay.classList.add("display");
    if (number < 10){
        for(let i = 0; i < number; i++){
            const newSymbol = document.createElement("img");
            newSymbol.src = "./" + suite + ".svg"
            newDisplay.appendChild(newSymbol);
        }
    } else{
        const newSymbol = document.createElement("div");
        newSymbol.classList.add("face");
        newSymbol.textContent = playingCardValue(number);
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

