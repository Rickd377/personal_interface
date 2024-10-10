document.addEventListener('DOMContentLoaded', function() {
    const bodyBgColorInput = document.getElementById('body-bg-color');
    const boxBgColorInput = document.getElementById('box-bg-color');
    const bodyColorDisplay = document.getElementById('body-color-display');
    const boxColorDisplay = document.getElementById('box-color-display');
    const boxElement = document.querySelector('.box');

    const updateColorDisplay = (input, display) => {
        display.style.backgroundColor = input.value;
    };

    bodyBgColorInput.addEventListener('input', function() {
        document.body.style.backgroundColor = bodyBgColorInput.value;
        updateColorDisplay(bodyBgColorInput, bodyColorDisplay);
    });

    boxBgColorInput.addEventListener('input', function() {
        boxElement.style.backgroundColor = boxBgColorInput.value;
        updateColorDisplay(boxBgColorInput, boxColorDisplay);
    });

    // Add click event listeners to the color displays to trigger the hidden color inputs
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