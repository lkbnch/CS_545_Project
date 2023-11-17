fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Ctether%2Cethereum%2Clitecoin%2Ccardano%2Cdogecoin&vs_currencies=usd&include_24hr_change=true')
    .then(res => res.json())
    .then(json => {
        const container = document.querySelector('.container');
        const coins = Object.getOwnPropertyNames(json);

        for (let coin of coins) {
            const coinInfo = json[`${coin}`];
            const price = coinInfo.usd;
            const change = coinInfo.usd_24h_change.toFixed(5);
            
};


            container.innerHTML += `
                <div class="coin ${change < 0 ? 'falling' : 'rising'}" onclick="goToChartPage('${coin}')">
                    <div class="coin-logo">
                        <img src="images/${coin}.png">
                    </div>
                    <div class="coin-name">
                        <h3>${coin}</h3>
                        <span>/USD</span>
                    </div>
                    <div class="coin-price">
                        <span class="price">$${price}</span>
                        <span class="change">${change}</span>
                    </div>
                </div>
            `;

            // Retrieve market chart data for the current coin
            fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=7`)
                .then(res => res.json())
                .then(json => {
                    // Create a new page for the chart and append it to the body
                    const chartPage = document.createElement('div');
                    chartPage.classList.add('chart-page', coin);
                    chartPage.innerHTML = `
                        <div class="chart-container"></div>
                        <button onclick="goBack()">Go Back</button>
                    `;
                    document.body.appendChild(chartPage);

                    // Create a new chart using the chart data and append it to the chart container
                    const chartData = {
                        labels: json.prices.map(price => new Date(price[0]).toLocaleDateString()),
                        datasets: [{
                            label: `${coin.toUpperCase()} Price`,
                            data: json.prices.map(price => price[1]),
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    };
                    const chartContainer = chartPage.querySelector('.chart-container');
                    const chart = new Chart(chartContainer, {
                        type: 'line',
                        data: chartData,
                        options: {
                            scales: {
                                x: {
                                    ticks: {
                                        source: 'labels'
                                    }
                                }
                            }
                        }
                    });
                });
        }
    );

// Function to navigate to the chart page for the specified coin
function goToChartPage(coin) {
    const chartPage = document.querySelector(`.chart-page.${coin}`);
    chartPage.style.display = 'block';
}


updateChart(coin);




// Function to navigate back to the main page
function goBack() {
    const chartPages = document.querySelectorAll('.chart-page');
    chartPages.forEach(chartPage => chartPage.style.display = 'none');
}
