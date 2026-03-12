const grid = document.getElementById("cryptoGrid")
const wishlistUI = document.getElementById("wishlist")

let favorites = JSON.parse(localStorage.getItem("favorites")) || []

async function loadCoins(){

grid.innerHTML = "Loading coins..."

try{

const res = await fetch(
"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
)

const coins = await res.json()

grid.innerHTML = ""

coins.forEach(coin=>{

const card = document.createElement("div")

card.className = "card"

card.innerHTML = `

<div class="coin-header">

<img src="${coin.image}" class="coin-img">

<h3>${coin.name}</h3>

</div>

<p class="price">Price: $${coin.current_price}</p>

<p class="market">Market Cap: ${(coin.market_cap/1000000).toFixed(1)}M</p>

<p class="change ${coin.price_change_percentage_24h < 0 ? "red" : "green"}">

24h: ${coin.price_change_percentage_24h.toFixed(2)}%

</p>

<div class="favorite">

${favorites.includes(coin.id) ? "❤️" : "🤍"}

</div>

`

card.onclick = ()=>{

localStorage.setItem("selectedCoin", coin.id)

location = "crypto.html"

}

card.querySelector(".favorite").onclick = (e)=>{

e.stopPropagation()

toggleFav(coin.id)

}

grid.appendChild(card)

})

}catch(err){

grid.innerHTML="⚠️ Failed to load data"

console.error(err)

}

}

function toggleFav(id){

if(favorites.includes(id)){

favorites = favorites.filter(c=>c!==id)

}else{

favorites.push(id)

}

localStorage.setItem("favorites", JSON.stringify(favorites))

renderWishlist()

loadCoins()

}

function renderWishlist(){

wishlistUI.innerHTML=""

favorites.forEach(c=>{

const li=document.createElement("li")

li.innerHTML=`${c} <span>❌</span>`

li.querySelector("span").onclick=()=>{

favorites=favorites.filter(x=>x!==c)

localStorage.setItem("favorites",JSON.stringify(favorites))

renderWishlist()

loadCoins()

}

wishlistUI.appendChild(li)

})

}

document.getElementById("clearAll").onclick=()=>{

favorites=[]

localStorage.setItem("favorites","[]")

renderWishlist()

loadCoins()

}

renderWishlist()
loadCoins()