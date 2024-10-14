document.addEventListener('DOMContentLoaded', function() {
    const bodyBgColorInput = document.getElementById('body-bg-color'),
          boxBgColorInput = document.getElementById('box-bg-color'),
          bodyColorDisplay = document.getElementById('body-color-display'),
          boxColorDisplay = document.getElementById('box-color-display'),
          boxElement = document.querySelector('.box'),
          backgroundImageSelector = document.getElementById('background-image-selector');

    const updateColorDisplay = (input, display) => display.style.backgroundColor = input.value,
          setBackgroundColor = color => {
              document.body.style.backgroundColor = color;
              document.body.style.backgroundImage = 'none';
              saveToCookies('bodyBgColor', color);
          },
          setBackgroundImage = image => {
              if (image === 'none') {
                  document.body.style.backgroundImage = 'none';
                  document.body.style.backgroundColor = bodyBgColorInput.value;
              } else {
                  document.body.style.backgroundImage = image;
                  document.body.style.backgroundColor = 'transparent';
              }
              saveToCookies('backgroundImage', image);
          },
          saveToCookies = (name, value) => document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${60 * 60 * 24 * 365}`,
          getFromCookies = name => {
              const cookies = document.cookie.split(';');
              for (let cookie of cookies) {
                  const [cookieName, cookieValue] = cookie.split('=');
                  if (cookieName.trim() === name) return decodeURIComponent(cookieValue);
              }
              return null;
          },
          setBoxBackgroundColor = color => {
              const rgbaColor = hexToRgba(color, 0.8);
              boxElement.style.backgroundColor = rgbaColor;
              saveToCookies('boxBgColor', color);
          },
          hexToRgba = (hex, alpha) => {
              let r = 0, g = 0, b = 0;
              if (hex.length === 4) {
                  r = parseInt(hex[1] + hex[1], 16);
                  g = parseInt(hex[2] + hex[2], 16);
                  b = parseInt(hex[3] + hex[3], 16);
              } else if (hex.length === 7) {
                  r = parseInt(hex[1] + hex[2], 16);
                  g = parseInt(hex[3] + hex[4], 16);
                  b = parseInt(hex[5] + hex[6], 16);
              }
              return `rgba(${r}, ${g}, ${b}, ${alpha})`;
          };

    bodyBgColorInput.addEventListener('input', function() {
        setBackgroundColor(bodyBgColorInput.value);
        updateColorDisplay(bodyBgColorInput, bodyColorDisplay);
    });

    boxBgColorInput.addEventListener('input', function() {
        setBoxBackgroundColor(boxBgColorInput.value);
        updateColorDisplay(boxBgColorInput, boxColorDisplay);
    });

    backgroundImageSelector.addEventListener('change', function() {
        setBackgroundImage(backgroundImageSelector.value);
    });

    bodyColorDisplay.addEventListener('click', function() {
        bodyBgColorInput.click();
    });

    boxColorDisplay.addEventListener('click', function() {
        boxBgColorInput.click();
    });

    const savedBodyBgColor = getFromCookies('bodyBgColor');
    if (savedBodyBgColor) {
        bodyBgColorInput.value = savedBodyBgColor;
        setBackgroundColor(savedBodyBgColor);
        updateColorDisplay(bodyBgColorInput, bodyColorDisplay);
    }

    const savedBoxBgColor = getFromCookies('boxBgColor');
    if (savedBoxBgColor) {
        boxBgColorInput.value = savedBoxBgColor;
        setBoxBackgroundColor(savedBoxBgColor);
        updateColorDisplay(boxBgColorInput, boxColorDisplay);
    }

    const savedBackgroundImage = getFromCookies('backgroundImage');
    if (savedBackgroundImage) {
        backgroundImageSelector.value = savedBackgroundImage;
        setBackgroundImage(savedBackgroundImage);
    }
});