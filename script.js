const startButton = document.querySelector('.start')
const info = document.querySelector('.info')
const heading = document.querySelector('.heading')
const tileContainer = document.querySelector('.container')
const highScoreBoard= document.querySelector('.highScore');

let highScore = localStorage.getItem('game1HighScore') || 0;
highScoreBoard.textContent= 'HIGH SCORE: ' + highScore;

let sequence = []
let humanSequence = []
let level = 0
let score = 0

function resetGame(text){
    alert(text)
    sequence = []
    humanSequence= []
    level= 0
    checkHighScore(score)
    startButton.classList.remove('hidden')
    heading.textContent = 'Simon Game'
    info.classList.add('hidden')
    tileContainer.classList.add('unclickable')
}

function humanTurn(level){
    tileContainer.classList.remove('unclickable')
    info.textContent = `Your turn: ${level} Tap${level > 1 ? 's' : ''}`
}

function activateTile(color){
    const tile = document.querySelector(`[data-tile='${color}']`)
    const sound = document.querySelector(`[data-sound='${color}']`)

    tile.classList.add('activated')
    sound.play()
    
    setTimeout(() => {
        tile.classList.remove('activated')
    }, 300)
}


function playRound(nextSequence){
    nextSequence.forEach((color, index) =>{
        //to add delay or else all tiles will activate at once 
        setTimeout(() => {
            activateTile(color)
        }, (index + 1) * 600)
    })
}

function nextStep(){
    const tiles = ['red', 'green', 'blue', 'yellow']
    const random = tiles[Math.floor(Math.random() * tiles.length)]

    return random
}

//next level
function nextRound(){
    level +=1
    
//add unclickable when the round starts and update info and heading
tileContainer.classList.add('unclickable')
info.textContent = 'Computer\'s turn'
heading.textContent = `Level ${level} of 35`
//copy elements from sequence to nextSequence, this takes the former 
//last round and adds a new random to it 
const nextSequence = [...sequence]
//return value of nextStep is used here
nextSequence.push(nextStep())
playRound(nextSequence)

//add time between computer's turn and human turn
sequence= [...nextSequence]
setTimeout(()=>{
    humanTurn(level)
}, level * 600 + 1000)
}

function handleClick(tile){
    const index = humanSequence.push(tile) -1
    const sound = document.querySelector(`[data-sound='${tile}']`)
    sound.play()

    const remainingTaps = sequence.length - humanSequence.length
  //for reseting
    if(humanSequence[index] !== sequence[index]){
        resetGame('Game Over! You pressed the wrong color')
        return 
    }
    
    //if they're equal start next round
    if(humanSequence.length === sequence.length){
        score++
        //how many levels and if completed, you win
    if(humanSequence.length === 35){
        resetGame('Congrats! You\'ve completed the levels!!')
        highScoreBoard = highScore
        score = highScoreBoard
        return 
    }
    //humanSequence is back to 
    //an empty array
        humanSequence = []
        info.textContent = 'Good Job!'
        setTimeout(()=> {
            nextRound()
        },1000)
        return 
    }

    info.textContent = `Your turn: ${remainingTaps} Tap${remainingTaps > 1 ? 's' : ''}`
}

//function will be executed when start button is clicked
function startGame(){
    startButton.classList.add('hidden')
//we need the .info to be displayed as the start button goes hidden
    info.classList.remove('hidden')
//change the text
    info.textContent = 'Computer\'s turn'
    nextRound()
}
startButton.addEventListener('click', startGame)

//detect the players click to see if it moves to next round or not
tileContainer.addEventListener('click', event => {
    const {tile} = event.target.dataset 

    if(tile) handleClick(tile)
})

function checkHighScore(){
    if (score > localStorage.getItem('game1HighScore')) {
        localStorage.setItem('game1HighScore', score);
        highScore = score;
        highScoreBoard.textContent = 'HIGH SCORE: ' + highScore;
    }
}

