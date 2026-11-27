// ==========================================
// DAY 7: Mini Project - Weather Application
// Uses Open-Meteo Free Geocoding & Forecast APIs (No API Key required)
// ==========================================

const STORAGE_KEY = "weather_recent_searches";
const MAX_RECENT = 5;

// DOM Elements
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loadingBox = document.getElementById("loadingBox");
const errorBox = document.getElementById("errorBox");
const weatherCard = document.getElementById("weatherCard");
const recentSection = document.getElementById("recentSection");
const recentList = document.getElementById("recentList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// Weather Result Elements
const cityNameEl = document.getElementById("cityName");
const weatherIconEl = document.getElementById("weatherIcon");
const temperatureEl = document.getElementById("temperature");
const conditionEl = document.getElementById("condition");
const feelsLikeEl = document.getElementById("feelsLike");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("windSpeed");

// 1. Helper: Convert WMO Weather Code to Icon & Description
function getWeatherInfo(code) {
  if (code === 0) return { icon: "☀️", text: "Clear Sky" };
  if (code <= 3) return { icon: "⛅", text: "Partly Cloudy" };
  if (code === 45 || code === 48) return { icon: "🌫️", text: "Foggy" };
  if (code >= 51 && code <= 55) return { icon: "🌦️", text: "Drizzle" };
  if (code >= 61 && code <= 67) return { icon: "🌧️", text: "Rainy" };
  if (code >= 71 && code <= 77) return { icon: "❄️", text: "Snowy" };
  if (code >= 80 && code <= 82) return { icon: "🌧️", text: "Rain Showers" };
  if (code >= 95) return { icon: "⛈️", text: "Thunderstorm" };
  return { icon: "🌡️", text: "Unknown" };
}

// 2. UI State Helpers (Loading & Errors)
function setLoading(isLoading) {
  searchBtn.disabled = isLoading;
  loadingBox.classList.toggle("hidden", !isLoading);
  if (isLoading) {
    errorBox.classList.add("hidden");
    weatherCard.classList.add("hidden");
  }
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
  weatherCard.classList.add("hidden");
}

// 3. Fetch City Coordinates -> Fetch Weather Data
async function searchCityWeather(cityQuery) {
  setLoading(true);

  try {
    // Step A: Geocoding API (Convert city name to latitude & longitude)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);

    if (!geoRes.ok) {
      throw new Error(`Geocoding failed (Status: ${geoRes.status})`);
    }

    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City "${cityQuery}" not found. Please check the spelling.`);
    }

    const { name, country, latitude, longitude } = geoData.results[0];
    const cityLabel = country ? `${name}, ${country}` : name;

    // Step B: Fetch Weather Forecast using Coordinates
    await fetchWeatherByCoords(latitude, longitude, cityLabel);

    // Step C: Save to LocalStorage recent searches
    saveRecentSearch({ label: cityLabel, latitude, longitude });

  } catch (error) {
    showError(error.message || "Unable to fetch weather. Check your internet connection.");
  } finally {
    setLoading(false);
  }
}

async function fetchWeatherByCoords(lat, lon, cityLabel) {
  setLoading(true);

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
    const res = await fetch(weatherUrl);

    if (!res.ok) {
      throw new Error(`Weather service error (Status: ${res.status})`);
    }

    const data = await res.json();
    displayWeather(cityLabel, data.current, data.current_units);
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
}

// 4. Display Weather on UI
function displayWeather(cityLabel, current, units) {
  const { icon, text } = getWeatherInfo(current.weather_code);

  cityNameEl.textContent = cityLabel;
  weatherIconEl.textContent = icon;
  temperatureEl.textContent = `${Math.round(current.temperature_2m)}${units.temperature_2m}`;
  conditionEl.textContent = text;
  feelsLikeEl.textContent = `${Math.round(current.apparent_temperature)}${units.apparent_temperature}`;
  humidityEl.textContent = `${current.relative_humidity_2m}${units.relative_humidity_2m}`;
  windSpeedEl.textContent = `${current.wind_speed_10m} ${units.wind_speed_10m}`;

  weatherCard.classList.remove("hidden");
}

// 5. Recent Searches with LocalStorage (JSON.parse & JSON.stringify)
function getRecentSearches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(cityObj) {
  const existing = getRecentSearches();
  // Remove if already exists so we can move it to the front
  const filtered = existing.filter(item => item.label !== cityObj.label);
  const updated = [cityObj, ...filtered].slice(0, MAX_RECENT);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  renderRecentSearches();
}

function renderRecentSearches() {
  const searches = getRecentSearches();
  recentList.innerHTML = "";

  if (searches.length === 0) {
    recentSection.classList.add("hidden");
    return;
  }

  recentSection.classList.remove("hidden");
  searches.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "recent-chip";
    btn.textContent = item.label;
    btn.addEventListener("click", () => {
      fetchWeatherByCoords(item.latitude, item.longitude, item.label);
    });
    recentList.append(btn);
  });
}

// 6. Event Listeners
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  searchCityWeather(city);
  cityInput.value = "";
});

clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  renderRecentSearches();
});

// Initialize recent searches on page load
renderRecentSearches();