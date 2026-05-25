const favs =
JSON.parse(
localStorage.getItem(
"favorites"
)
) || []

const grid =
document.getElementById(
"favoriteCards"
)

let chartInstance = null



async function loadPortfolio(){

if(favs.length===0){

grid.innerHTML=
"<p>No favorites added</p>"

return

}

const url=
`https://api.coingecko.com/api/v3/simple/price?ids=${favs.join(",")}&vs_currencies=usd`

try{

const res=
await fetch(url)

if(!res.ok){

throw new Error(
"Failed API"
)

}

const data=
await res.json()

let names=[]
let prices=[]

let html=""

favs.forEach(coin=>{

const price=
data[coin]?.usd ?? 0

html += `

<div class="card">

<h3>

${coin.toUpperCase()}

</h3>

<p>

$${price}

</p>

</div>

`

if(price>0){

names.push(
coin.toUpperCase()
)

prices.push(
price
)

}

})

grid.innerHTML=
html

if(
names.length>0
){

renderChart(
names,
prices
)

}

else{

document
.getElementById(
"portfolioChart"
)
.parentElement
.innerHTML=
"<p>No chart data available</p>"

}

}

catch(error){

console.error(error)

grid.innerHTML=
"⚠️ Failed loading portfolio"

}

}



function renderChart(
names,
prices
){

const canvas=
document.getElementById(
"portfolioChart"
)

if(!canvas) return

if(chartInstance){

chartInstance.destroy()

}

chartInstance=
new Chart(
canvas,
{

type:"doughnut",

data:{

labels:names,

datasets:[{

data:prices,

borderWidth:1

}]

},

options:{

responsive:true,

maintainAspectRatio:false

}

}

)

}



loadPortfolio()