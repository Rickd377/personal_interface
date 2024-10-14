document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '4f91d01bf628ee6b33156de0a0248545'; // Replace with your OpenWeatherMap API key
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const getCityFromCookies = () => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name.trim() === 'city') {
                return decodeURIComponent(value);
            }
        }
        return null;
    };

    const saveCityToCookies = (city) => {
        document.cookie = `city=${encodeURIComponent(city)};path=/;max-age=${60 * 60 * 24 * 365}`;
    };

    const checkCityExists = async (city) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
            if (response.ok) {
                return true;
            } else {
                alert("City not found");
                return false;
            }
        } catch (error) {
            console.error('Error checking city:', error);
            alert("City not found");
            return false;
        }
    };

    const promptForCity = async () => {
        await delay(1000); // Delay for 1 second
        let city = prompt("Enter your city", "New York");
        if (!city) {
            city = 'New York'; // Default to New York if no input is provided
        }
        return city;
    };

    const updateCityInTopBar = (city) => {
        const cityElement = document.getElementById('city-name');
        if (cityElement) {
            cityElement.textContent = city;
        }
    };

    const initializeWeather = async () => {
        let city = getCityFromCookies();
        if (!city) {
            city = await promptForCity();
            const cityExists = await checkCityExists(city);
            if (cityExists) {
                saveCityToCookies(city);
            } else {
                city = await promptForCity();
                if (!city) {
                    city = 'New York'; // Default to New York if no input is provided
                }
                saveCityToCookies(city);
            }
        }
        updateCityInTopBar(city);
        fetchWeather(city);
    };

    const fetchWeather = async (city) => {
        try {
            const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            const currentWeatherData = await currentWeatherResponse.json();
            displayCurrentWeather(currentWeatherData);
            setWeatherBackground(currentWeatherData.weather[0].main, currentWeatherData.main.temp);

            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData);
            initializeSwiper();
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const displayCurrentWeather = (data) => {
        const { temp } = data.main;
        const { description, icon } = data.weather[0];
        const weatherContainer = document.querySelector('.weather');
        weatherContainer.querySelector('.current-weather').innerHTML = `
            <div class="weather-icon">
                <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
            </div>
            <div class="weather-info">
                <h2>${Math.round(temp)}°C</h2>
                <p>${description}</p>
            </div>
        `;
    };

    const displayForecast = (data) => {
        const weatherSliderContainer = document.querySelector('.weather-slider .swiper-wrapper');
        weatherSliderContainer.innerHTML = ''; // Clear previous forecast
        const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));
        dailyForecasts.forEach(forecast => {
            const date = new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const { temp } = forecast.main;
            const { description, icon } = forecast.weather[0];
            const forecastElement = document.createElement('div');
            forecastElement.className = 'swiper-slide';
            forecastElement.innerHTML = `
                <div class="forecast-date">${date}</div>
                <div class="forecast-icon">
                    <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
                </div>
                <div class="forecast-info">
                    <h3>${Math.round(temp)}°C</h3>
                    <p>${description}</p>
                </div>
            `;
            weatherSliderContainer.appendChild(forecastElement);
        });
    };

    const setWeatherBackground = (weatherCondition, temperature) => {
        const weatherContainer = document.querySelector('.weather');
        const weatherImages = {
            clear: 'images/weather-clear.png',
            clouds: 'images/weather-cloudy.png',
            rain: 'images/weather-rainy.png',
            snow: 'images/weather-snowy.png',
            default: 'images/weather-default.png',
            hot: 'images/weather-hot.png'
        };
        const backgroundImage = temperature > 20 ? weatherImages.hot : weatherImages[weatherCondition.toLowerCase()] || weatherImages.default;
        weatherContainer.style.backgroundImage = `url(${backgroundImage})`;
    };

    const initializeSwiper = () => {
        new Swiper('.weather-slider', {
            slidesPerView: 3,
            spaceBetween: 10,
            navigation: {
                nextEl: '#weather-button-next',
                prevEl: '#weather-button-prev',
            },
        });
    };

    // Function to change the city
    const changeCity = async () => {
        const newCity = await promptForCity();
        const cityExists = await checkCityExists(newCity);
        if (cityExists) {
            saveCityToCookies(newCity);
            updateCityInTopBar(newCity);
            fetchWeather(newCity);
        }
    };

    // Example usage: Add a button to change the city in the top bar
    const changeCityButton = document.getElementById('change-city-button');
    if (changeCityButton) {
        changeCityButton.addEventListener('click', changeCity);
    }

    initializeWeather();
});