const grid = document.getElementById("cryptoGrid")
const wishlistUI = document.getElementById("wishlist")

let favorites =
JSON.parse(
localStorage.getItem(
"favorites"
)
) || []

window.currentCoins = []



/* LOAD COINS */

async function loadCoins(){

grid.innerHTML =
"Loading coins..."

try{

const res = await fetch(
"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
)

if(!res.ok){

throw new Error(
"API Failed"
)

}

const coins =
await res.json()

window.currentCoins =
coins

grid.innerHTML = ""

coins.forEach(coin=>{

const card =
document.createElement(
"div"
)

card.className =
"card"

const price =
coin.current_price != null
? coin.current_price
: 0

const marketCap =
coin.market_cap != null
? (
coin.market_cap
/1000000
).toFixed(1)
: "0"

const change =
coin.price_change_percentage_24h
!= null
? coin
.price_change_percentage_24h
.toFixed(2)
: "0.00"

card.innerHTML = `

<div class="coin-header">

<img
src="${coin.image}"
class="coin-img"
>

<h3>

${coin.name}

</h3>

</div>

<p class="price">

Price:
$${price}

</p>

<p class="market">

Market Cap:
${marketCap}M

</p>

<p class="change ${
coin
.price_change_percentage_24h
!= null
&&
coin
.price_change_percentage_24h
< 0
? "red"
: "green"
}">

24h:
${change}%

</p>

<div class="favorite">

${
favorites.includes(
coin.id
)
? "❤️"
: "🤍"
}

</div>

`

card.onclick = ()=>{

localStorage.setItem(
"selectedCoin",
coin.id
)

location =
"crypto.html"

}

card
.querySelector(
".favorite"
)
.onclick = (e)=>{

e.stopPropagation()

toggleFav(
coin.id
)

}

grid.appendChild(
card
)

})

}

catch(err){

grid.innerHTML =
"⚠️ Failed to load data"

console.error(
err
)

}

}



/* FAVORITES */

function toggleFav(id){

if(
favorites.includes(
id
)
){

favorites =
favorites.filter(
c =>
c !== id
)

}

else{

favorites.push(
id
)

}

localStorage.setItem(
"favorites",
JSON.stringify(
favorites
)
)

renderWishlist()

updateFavoriteIcons()

}



/* UPDATE HEARTS */

function updateFavoriteIcons(){

document
.querySelectorAll(
".card"
)
.forEach(card=>{

const title =
card
.querySelector(
"h3"
)
?.innerText
.toLowerCase()

const fav =
card.querySelector(
".favorite"
)

if(!fav) return

const coin =
window.currentCoins
.find(
c =>
c.name
.toLowerCase()
=== title
)

if(!coin) return

fav.innerHTML =
favorites.includes(
coin.id
)
? "❤️"
: "🤍"

})

}



/* WISHLIST */

function renderWishlist(){

wishlistUI.innerHTML=""

favorites.forEach(c=>{

const li =
document.createElement(
"li"
)

li.innerHTML=`

${c}

<span>

❌

</span>

`

li
.querySelector(
"span"
)
.onclick=()=>{

favorites =
favorites.filter(
x =>
x !== c
)

localStorage.setItem(
"favorites",
JSON.stringify(
favorites
)
)

renderWishlist()

updateFavoriteIcons()

}

wishlistUI
.appendChild(
li
)

})

}



/* CLEAR */

document
.getElementById(
"clearAll"
)
.onclick=()=>{

favorites=[]

localStorage.setItem(
"favorites",
"[]"
)

renderWishlist()

updateFavoriteIcons()

}



/* START */

renderWishlist()

loadCoins()