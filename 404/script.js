document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const upButton = document.getElementById('upButton');
    const downButton = document.getElementById('downButton');
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');
    const mobileControls = document.querySelector('.controls-container');
    const homepageButton = document.getElementById('homepageButton');
    const message = document.getElementById('message');

    const gridSize = 10;
    let snake = [{ x: 10, y: 10 }];
    let food = {};
    let direction = 'right';
    let score = 0;
    let gameOver = true;
    let gameSpeed = 100;

    function resizeCanvas() {
        canvas.width = window.innerWidth <= 600 ? window.innerWidth * 0.8 : 300;
        canvas.height = window.innerWidth <= 600 ? window.innerHeight * 0.6 : 150;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
    }

    function drawSnake() {
        ctx.fillStyle = 'green';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    function updateSnake() {
        const head = { ...snake[0] };

        if (direction === 'right') head.x++;
        if (direction === 'left') head.x--;
        if (direction === 'up') head.y--;
        if (direction === 'down') head.y++;

        if (
            head.x < 0 || 
            head.x >= canvas.width / gridSize || 
            head.y < 0 || 
            head.y >= canvas.height / gridSize ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            gameOver = true;
        }

        if (head.x === food.x && head.y === food.y) {
            score++;
            generateFood();
        } else {
            snake.pop();
        }

        snake.unshift(head);
    }

    function gameLoop() {
        if (!gameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateSnake();
            drawSnake();
            drawFood();
            ctx.fillStyle = 'white';
            ctx.fillText('Score: ' + score, 10, 20);
            setTimeout(gameLoop, gameSpeed);
        } else {
            ctx.fillStyle = 'white';
            ctx.fillText('Game Over', canvas.width / 2 - 40, canvas.height / 2);
            restartButton.classList.remove('d-none');
            mobileControls.classList.add('d-none');
        }
    }

    startButton.addEventListener('click', () => {
        gameOver = false;
        score = 0;
        snake = [{ x: 10, y: 10 }];
        direction = 'right';
        generateFood();
        startButton.classList.add('d-none');
        restartButton.classList.add('d-none');
        homepageButton.classList.remove('d-none');
        mobileControls.classList.remove('d-none');
        message.classList.add('d-none');
        gameLoop();
    });

    restartButton.addEventListener('click', () => {
        gameOver = false;
        score = 0;
        snake = [{ x: 10, y: 10 }];
        direction = 'right';
        generateFood();
        restartButton.classList.add('d-none');
        mobileControls.classList.remove('d-none');
        gameLoop();
    });

    upButton.addEventListener('click', () => (direction = direction !== 'down' ? 'up' : 'down'));
    downButton.addEventListener('click', () => (direction = direction !== 'up' ? 'down' : 'up'));
    leftButton.addEventListener('click', () => (direction = direction !== 'right' ? 'left' : 'right'));
    rightButton.addEventListener('click', () => (direction = direction !== 'left' ? 'right' : 'left'));

    generateFood();
});
