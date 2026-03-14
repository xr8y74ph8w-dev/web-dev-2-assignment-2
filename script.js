const apiKey = "YOUR_API_KEY";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const historyList = document.getElementById("historyList");

console.log("Script Loaded");

// Load search history
window.onload = function(){
    console.log("Page Loaded");
    loadHistory();
}

// Event Listener
searchBtn.addEventListener("click", function(){
    const city = cityInput.value.trim();
    
    if(city === ""){
        alert("Please enter a city name");
        return;
    }

    console.log("Search button clicked");
    getWeather(city);
});

// Async Fetch Function
async function getWeather(city){

    console.log("Fetching weather for:", city);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try{

        console.log("Before fetch");

        const response = await fetch(url);

        console.log("After fetch response received");

        if(!response.ok){
            throw new Error("City not found");
        }

        const data = await response.json();

        console.log("Weather Data:", data);

        displayWeather(data);

        saveCity(city);

    }
    catch(error){
        console.log("Error occurred:", error);
        weatherResult.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }

}

// Display Weather
function displayWeather(data){

    const cityName = data.name;
    const temp = data.main.temp;
    const condition = data.weather[0].main;

    weatherResult.innerHTML = `
        <h2>${cityName}</h2>
        <p>Temperature: ${temp} °C</p>
        <p>Condition: ${condition}</p>
    `;
}

// Save to Local Storage
function saveCity(city){

    let cities = JSON.parse(localStorage.getItem("cities")) || [];

    if(!cities.includes(city)){
        cities.push(city);
    }

    localStorage.setItem("cities", JSON.stringify(cities));

    loadHistory();
}

// Load History
function loadHistory(){

    historyList.innerHTML = "";

    let cities = JSON.parse(localStorage.getItem("cities")) || [];

    cities.forEach(city => {

        const li = document.createElement("li");
        li.textContent = city;

        li.addEventListener("click", function(){
            getWeather(city);
        });

        historyList.appendChild(li);

    });

}