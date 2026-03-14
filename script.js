let goal=[1,2,3,4,5,6,7,8,0]

let board=[...goal]

let difficulty=parseInt(localStorage.getItem("difficulty"))||20
let algo=localStorage.getItem("algo")||"bfs"
let mode=localStorage.getItem("mode")||"play"

let started=false
let moves=0
let solutionPath=[]
let currentStep=0

document.getElementById("diff").innerText=difficulty
document.getElementById("algo").innerText=algo
document.getElementById("mode").innerText=mode


function draw(){

let puzzle=document.getElementById("puzzle")
puzzle.innerHTML=""

board.forEach((n,i)=>{

let tile=document.createElement("div")
tile.className="tile"

if(n===0){
tile.classList.add("empty")
}else{
tile.innerText=n
tile.onclick=()=>move(i)
}

puzzle.appendChild(tile)

})

}


function startGame(){

if(started) return

started=true

shuffle()

solutionPath = bfs(board)

let optimalMoves = solutionPath.length - 1

document.getElementById("optimal").innerText = optimalMoves

document.getElementById("status").innerText = "Game Started"

if(mode==="ai"){
setTimeout(()=>solveAI(),500)
}

}


function shuffle(){

for(let i=0;i<difficulty;i++){

let e=board.indexOf(0)
let adj=getAdj(e)

let r=adj[Math.floor(Math.random()*adj.length)]

let temp=board[e]
board[e]=board[r]
board[r]=temp

}

moves=0
document.getElementById("moves").innerText=moves

draw()

}


function move(i){

if(!started || mode==="ai") return

let e=board.indexOf(0)

let adj=getAdj(e)

if(adj.includes(i)){

let temp=board[i]

board[i]=0
board[e]=temp

/* PLAY MOVE SOUND */
let moveSound=document.getElementById("moveSound")
if(moveSound){
moveSound.currentTime=0
moveSound.play()
}

moves++

document.getElementById("moves").innerText=moves

let optimal = solutionPath.length - 1

let efficiency = Math.round((optimal/moves)*100)

document.getElementById("efficiency").innerText = efficiency + "%"

draw()

checkWin()

}

}


function hint(){

if(solutionPath.length<2)return

let next=solutionPath[1]

let tile

for(let i=0;i<9;i++){

if(board[i]!==next[i] && board[i]!==0){
tile=board[i]
}

}

document.getElementById("status").innerText="Move tile "+tile

}


function solveAI(){

let i=0

let interval=setInterval(()=>{

board=[...solutionPath[i]]

draw()

i++

if(i>=solutionPath.length){
clearInterval(interval)
}

},400)

}


function showSteps(){

currentStep=0

document.getElementById("stepsBox").style.display="flex"

displayStep()

}


function displayStep(){

let steps=document.getElementById("steps")

steps.innerHTML=""

let state=solutionPath[currentStep]

let grid=document.createElement("div")
grid.className="mini"

state.forEach(v=>{

let cell=document.createElement("div")
cell.innerText=v===0?"":v

grid.appendChild(cell)

})

steps.appendChild(grid)

document.getElementById("stepCounter").innerText=
"Step "+currentStep+" / "+(solutionPath.length-1)

}


function nextStep(){

if(currentStep<solutionPath.length-1){

currentStep++

displayStep()

}

}


function prevStep(){

if(currentStep>0){

currentStep--

displayStep()

}

}


function closeSteps(){

document.getElementById("stepsBox").style.display="none"

}


function restart(){

location.reload()

}


function checkWin(){

if(board.toString()===goal.toString()){

/* PLAY WIN SOUND */

let winSound=document.getElementById("winSound")

if(winSound){
winSound.currentTime=0
winSound.play()
}

document.getElementById("winBox").style.display="flex"

}

}


function getAdj(i){

let a=[]

if(i%3!==0)a.push(i-1)
if(i%3!==2)a.push(i+1)
if(i>2)a.push(i-3)
if(i<6)a.push(i+3)

return a

}


function bfs(start){

let visited=new Set()
let queue=[[start]]

while(queue.length){

let path=queue.shift()
let node=path[path.length-1]

if(node.toString()===goal.toString()) return path

visited.add(node.toString())

let e=node.indexOf(0)

let adj=getAdj(e)

adj.forEach(a=>{

let newNode=[...node]

let temp=newNode[e]

newNode[e]=newNode[a]
newNode[a]=temp

if(!visited.has(newNode.toString())){
queue.push([...path,newNode])
}

})

}

return []

}

draw()