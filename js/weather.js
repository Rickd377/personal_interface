document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '4f91d01bf628ee6b33156de0a0248545'; // Replace with your OpenWeatherMap API key
    let city = prompt("Enter your city", "New York"); // Prompt for city input
    if (!city) {
        city = 'New York'; // Default to New York if no input is provided
    }

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

    (async () => {
        const cityExists = await checkCityExists(city);
        if (!cityExists) {
            city = prompt("Enter your city", "New York");
            if (!city) {
                city = 'New York'; // Default to New York if no input is provided
            }
        }
    })();

    const weatherContainer = document.querySelector('.weather');
    const weatherSliderContainer = document.querySelector('.weather-slider .swiper-wrapper');

    const fetchWeather = async () => {
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

    fetchWeather();
});