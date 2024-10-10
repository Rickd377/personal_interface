document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '4f91d01bf628ee6b33156de0a0248545'; // Replace with your OpenWeatherMap API key
    const city = 'Amsterdam'; // Replace with your desired city
    const weatherContainer = document.querySelector('.weather');
    const weatherSliderContainer = document.querySelector('.weather-slider .swiper-wrapper');

    function fetchWeather() {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
                setWeatherBackground(data.weather[0].main);
            })
            .catch(error => {
                console.error('Error fetching current weather data:', error);
            });

        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                displayForecast(data);
                initializeSwiper();
            })
            .catch(error => {
                console.error('Error fetching weather forecast data:', error);
            });
    }

    function displayCurrentWeather(data) {
        const temperature = Math.round(data.main.temp); // Round to whole number
        const description = data.weather[0].description;
        const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

        weatherContainer.querySelector('.current-weather').innerHTML = `
            <div class="weather-icon">
                <img src="${icon}" alt="Weather Icon">
            </div>
            <div class="weather-info">
                <h2>${temperature}°C</h2>
                <p>${description}</p>
            </div>
        `;
    }

    function displayForecast(data) {
        // Filter the forecast data to get one entry per day at 12:00 PM
        const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

        dailyForecasts.forEach(forecast => {
            const date = new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const temperature = Math.round(forecast.main.temp); // Round to whole number
            const description = forecast.weather[0].description;
            const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

            const forecastElement = document.createElement('div');
            forecastElement.className = 'swiper-slide';
            forecastElement.innerHTML = `
                <div class="forecast-date">${date}</div>
                <div class="forecast-icon">
                    <img src="${icon}" alt="Weather Icon">
                </div>
                <div class="forecast-info">
                    <h3>${temperature}°C</h3>
                    <p>${description}</p>
                </div>
            `;
            weatherSliderContainer.appendChild(forecastElement);
        });
    }

    function setWeatherBackground(weatherCondition, temperature) {
        let backgroundImage;
        if (temperature > 20) {
            backgroundImage = 'images/weather-hot.png';
        } else {
            switch (weatherCondition.toLowerCase()) {
                case 'clear':
                    backgroundImage = 'images/weather-clear.png';
                    break;
                case 'clouds':
                    backgroundImage = 'images/weather-cloudy.png';
                    break;
                case 'rain':
                    backgroundImage = 'images/weather-rainy.png';
                    break;
                case 'snow':
                    backgroundImage = 'images/weather-snowy.png';
                    break;
                default:
                    backgroundImage = 'images/weather-default.png';
                    break;
            }
        }
        weatherContainer.style.backgroundImage = `url(${backgroundImage})`;
    }

    function initializeSwiper() {
        new Swiper('.weather-slider', {
            slidesPerView: 3,
            spaceBetween: 15,
            navigation: {
                nextEl: '#weather-button-next',
                prevEl: '#weather-button-prev',
            },
        });
    }

    fetchWeather();
});