document.addEventListener('DOMContentLoaded', function() {
    const updateClock = () => {
        const clockElement = document.getElementById('clock'),
              now = new Date(),
              hours = now.getHours().toString().padStart(2, '0'),
              minutes = now.getMinutes().toString().padStart(2, '0'),
              seconds = now.getSeconds().toString().padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    };

    const setupDrawingBoard = () => {
        const canvas = document.getElementById('drawing-board'),
              ctx = canvas.getContext('2d');
        let drawing = false;

        const resizeCanvas = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        };

        const startDrawing = e => {
            drawing = true;
            draw(e);
        };

        const endDrawing = () => {
            drawing = false;
            ctx.beginPath();
        };

        const draw = e => {
            if (!drawing) return;
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#000';
            const rect = canvas.getBoundingClientRect(),
                  x = e.clientX - rect.left,
                  y = e.clientY - rect.top;
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', endDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseleave', endDrawing);
        document.getElementById('clear-drawing').addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    };

    const fetchJoke = () => {
        fetch('https://icanhazdadjoke.com/', { headers: { 'Accept': 'application/json' } })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const jokeQuestion = document.getElementById('joke-question'),
                      jokeAnswer = document.getElementById('joke-answer'),
                      revealText = document.querySelector('.reveal-text'),
                      flipBoxBack = document.querySelector('.flip-box-back'),
                      flipBoxInner = document.querySelector('.flip-box-inner');
                if (data && data.joke) {
                    const jokeParts = data.joke.split('?');
                    if (jokeParts.length > 1) {
                        const jokeQuestionText = jokeParts[0] + '?',
                              jokeAnswerText = jokeParts[1].trim(),
                              totalLength = jokeQuestionText.length + jokeAnswerText.length;
                        if (totalLength <= 60) {
                            jokeQuestion.textContent = jokeQuestionText;
                            jokeAnswer.textContent = jokeAnswerText;
                            revealText.style.display = 'none';
                            flipBoxBack.style.display = 'block';
                            flipBoxInner.classList.remove('show-answer');
                        } else {
                            fetchJoke();
                        }
                    } else {
                        fetchJoke();
                    }
                } else {
                    fetchJoke();
                }
            })
            .catch(error => {
                console.error('Error fetching joke data:', error);
                document.getElementById('joke-question').textContent = 'Unable to load joke';
                document.getElementById('joke-answer').textContent = '';
                document.querySelector('.reveal-text').style.display = 'none';
                document.querySelector('.flip-box-back').style.display = 'none';
            });
    };

    updateClock();
    setInterval(updateClock, 1000);
    setupDrawingBoard();
    fetchJoke();

    const flipBox = document.querySelector('.flip-box'),
          flipBoxInner = document.querySelector('.flip-box-inner');
    let clickTimeout;

    flipBox.addEventListener('click', () => {
        clickTimeout = setTimeout(() => {
            flipBoxInner.classList.toggle('show-answer');
        }, 300);
    });

    document.querySelector('.reveal-icon').addEventListener('click', event => {
        event.stopPropagation();
        const revealText = document.querySelector('.reveal-text');
        revealText.style.display = revealText.style.display === 'none' ? 'block' : 'none';
    });
});