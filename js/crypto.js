const coin = localStorage.getItem("selectedCoin")

if (!coin) {

location = "dashboard.html"

throw new Error("No coin selected")

}

const coinNameUI = document.getElementById("coinName")
const coinLogo = document.getElementById("coinLogo")

const qtyInput = document.getElementById("quantity")
const totalUI = document.getElementById("total")
const priceUI = document.getElementById("livePrice")

const limitInput = document.getElementById("limitPrice")

let livePrice = 0

let tradingViewWidget = null



/* COIN → BINANCE SYMBOL */

function getSymbol(id) {

const map = {

bitcoin: "BTCUSDT",

ethereum: "ETHUSDT",

tether: "BTCUSDT",

bnb: "BNBUSDT",

xrp: "XRPUSDT",

usdc: "USDCUSDT",

solana: "SOLUSDT",

tron: "TRXUSDT",

figure_heloc: "FIGUSDT",

dogecoin: "DOGEUSDT",

whitebit_coin: "WBTUSDT",

usds: "USDSUSDT",

cardano: "ADAUSDT",

bitcoin_cash: "BCHUSDT",

leo_token: "LEOUSD",

hyperliquid: "HYPERUSDT",

monero: "XMRUSDT",

chainlink: "LINKUSDT",

ethena_usde: "USDEUSDT",

canton: "CANTONUSDT"

}

return map[id] || "BTCUSDT"

}

const symbol = getSymbol(coin)



/* LOAD COIN INFO */

async function loadCoin() {

try {

const res = await fetch(
`https://api.coingecko.com/api/v3/coins/${coin}`
)

if (!res.ok) {

throw new Error("Failed to load coin")

}

const data = await res.json()

coinNameUI.innerText = data.name || coin

coinLogo.src = data.image?.small || ""

}

catch (err) {

console.error(err)

coinNameUI.innerText = "Failed to load"

}

}



/* TRADINGVIEW BINANCE CHART */

function loadChart() {

const currentTheme = localStorage.getItem("theme")

const chartTheme =
currentTheme === "light"
? "light"
: "dark"

new TradingView.widget({

autosize: true,

symbol: `BINANCE:${symbol}`,

interval: "5",

timezone: "Etc/UTC",

theme: chartTheme,

style: "1",

locale: "en",

toolbar_bg:
chartTheme === "light"
? "#ffffff"
: "#131722",

enable_publishing: false,

hide_top_toolbar: false,

container_id: "tradingview_chart"

})

}



/* LIVE BINANCE PRICE */

function startPrice() {

const ws = new WebSocket(
`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`
)

ws.onmessage = (event) => {

const data = JSON.parse(event.data)

livePrice = parseFloat(data.p)

priceUI.innerText =
"$" + livePrice.toFixed(2)

updateTotal()

}

ws.onerror = () => {

console.log(
"WebSocket connection failed"
)

}

}



/* TOTAL CALCULATION */

function updateTotal() {

const qty = qtyInput?.value

if (!qty) {

totalUI.innerText = "$0"

return

}

totalUI.innerText =
"$" +
(qty * livePrice).toFixed(2)

}

if (qtyInput) {

qtyInput.addEventListener(
"input",
updateTotal
)

}



/* SAVE ORDER */

function saveOrder(type) {

const qty = qtyInput?.value

if (!qty) return

const price =
limitInput?.value || livePrice

let orders =
JSON.parse(
localStorage.getItem(
"orders"
)
) || []

orders.push({

coin: coin,

type: type,

price: price,

qty: qty,

time:
new Date()
.toLocaleString()

})

localStorage.setItem(
"orders",
JSON.stringify(orders)
)

renderOrders()

}



/* TRADE BUTTONS */

const buyBtn =
document.getElementById(
"buyBtn"
)

const sellBtn =
document.getElementById(
"sellBtn"
)

if (buyBtn) {

buyBtn.onclick = () => {

saveOrder("BUY")

}

}

if (sellBtn) {

sellBtn.onclick = () => {

saveOrder("SELL")

}

}



/* RENDER TRADE HISTORY */

function renderOrders() {

const list =
document.getElementById(
"ordersList"
)

if (!list) return

list.innerHTML = ""

const orders =
JSON.parse(
localStorage.getItem(
"orders"
)
) || []

orders.reverse().forEach(o => {

const li =
document.createElement(
"li"
)

li.innerHTML = `

${o.type}
${o.qty}
${o.coin}

@ $${o.price}

<span>

${o.time}

</span>

`

list.appendChild(li)

})

}



/* INITIAL LOAD */

loadCoin()

loadChart()

startPrice()

renderOrders()