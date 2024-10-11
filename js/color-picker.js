document.addEventListener('DOMContentLoaded', function() {
    const bodyBgColorInput = document.getElementById('body-bg-color');
    const boxBgColorInput = document.getElementById('box-bg-color');
    const bodyColorDisplay = document.getElementById('body-color-display');
    const boxColorDisplay = document.getElementById('box-color-display');
    const boxElement = document.querySelector('.box');
    const backgroundImageSelector = document.getElementById('background-image-selector');

    const updateColorDisplay = (input, display) => {
        display.style.backgroundColor = input.value;
    };

    const setBackgroundColor = (color) => {
        document.body.style.backgroundColor = color;
        document.body.style.backgroundImage = 'none';
    };

    const setBackgroundImage = (image) => {
        if (image === 'none') {
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundColor = bodyBgColorInput.value;
        } else {
            document.body.style.backgroundImage = image;
            document.body.style.backgroundColor = 'transparent';
        }
    };

    bodyBgColorInput.addEventListener('input', function() {
        setBackgroundColor(bodyBgColorInput.value);
        updateColorDisplay(bodyBgColorInput, bodyColorDisplay);
    });

    boxBgColorInput.addEventListener('input', function() {
        boxElement.style.backgroundColor = boxBgColorInput.value;
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

    // Initialize color displays
    updateColorDisplay(bodyBgColorInput, bodyColorDisplay);
    updateColorDisplay(boxBgColorInput, boxColorDisplay);
});