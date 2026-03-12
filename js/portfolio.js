const favs = JSON.parse(localStorage.getItem("favorites")) || [];

const grid = document.getElementById("favoriteCards");

async function loadPortfolio() {

    if (favs.length === 0) {
        grid.innerHTML = "<p>No favorites added</p>";
        return;
    }

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${favs.join(",")}&vs_currencies=usd`;

    try {

        const res = await fetch(url);
        const data = await res.json();

        let names = [];
        let prices = [];
        let html = "";

        favs.forEach(coin => {

            const price = data[coin]?.usd;

            names.push(coin);
            prices.push(price);

            html += `
                <div class="card">
                    <h3>${coin.toUpperCase()}</h3>
                    <p>$${price}</p>
                </div>
            `;

        });

        grid.innerHTML = html;

        renderChart(names, prices);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function renderChart(names, prices) {

    new Chart(document.getElementById("portfolioChart"), {

        type: "doughnut",

        data: {
            labels: names,
            datasets: [{
                data: prices
            }]
        }

    });

}

loadPortfolio();