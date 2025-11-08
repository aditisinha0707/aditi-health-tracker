const apiKey = "YOUR_API_KEY_HERE"; // Add your OpenWeatherMap API key
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loader = document.getElementById("loader");
const weatherCard = document.getElementById("weatherInfo");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});

async function getWeather(city) {
  loader.classList.remove("hidden");
  weatherCard.classList.add("hidden");
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    const today = data.list[0];
    document.getElementById("cityName").textContent = `${data.city.name}, ${data.city.country}`;
    document.getElementById("temperature").textContent = Math.round(today.main.temp);
    document.getElementById("description").textContent = today.weather[0].description;
    document.getElementById("humidity").textContent = today.main.humidity;
    document.getElementById("wind").textContent = today.wind.speed;

    const temps = data.list.slice(0, 7).map(item => item.main.temp);
    drawChart(temps);

    weatherCard.classList.remove("hidden");
  } catch (err) {
    alert(err.message);
  } finally {
    loader.classList.add("hidden");
  }
}

function drawChart(temps) {
  const ctx = document.getElementById("tempChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"],
      datasets: [{
        label: "Temp (°C)",
        data: temps,
        borderColor: "#00bfff",
        backgroundColor: "rgba(0,191,255,0.2)",
        fill: true,
        tension: 0.3
      }]
    },
    options: { scales: { y: { beginAtZero: false } } }
  });
}
