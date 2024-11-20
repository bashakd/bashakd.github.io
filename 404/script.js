document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const upButton = document.getElementById('upButton');
    const downButton = document.getElementById('downButton');
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');
    const mobileControls = document.querySelector('.mobile-controls');

    // Snake variables
    const gridSize = 10;
    let snake = [{ x: 10, y: 10 }];
    let food = {};
    let direction = 'right';
    let score = 0;
    let gameOver = true; // Game starts paused
    let gameSpeed = 100; // Adjust this for speed (lower is slower)
    let lastMoveTime = 0; // Track the last move time to control movement speed

    // Function to resize the canvas based on the window size
    function resizeCanvas() {
        // Adjust width percentage as needed
        if (window.innerWidth <= 600) {
            // For mobile, use percentage-based sizing
            canvas.width = window.innerWidth * 0.8; 
            canvas.height = window.innerHeight * 0.6; 
        } else {
            // For PC, use fixed size
            canvas.width = 300;
            canvas.height = 150;
        }

        // Adjust mobile controls visibility based on screen width
        if (window.innerWidth <= 600) {
            mobileControls.style.display = 'block';
        } else {
            mobileControls.style.display = 'none';
        }
    }

    // Call resizeCanvas on window resize
    window.addEventListener('resize', resizeCanvas);

    // Initial canvas resize
    resizeCanvas();

    // Generate food
    function generateFood() {
        // Adjust food generation based on canvas size 
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)), 
            y: Math.floor(Math.random() * (canvas.height / gridSize)) 
        };
    }

    // Draw snake
    function drawSnake() {
        ctx.fillStyle = 'green';
        snake.forEach((segment, index) => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
    }

    // Draw food
    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    // Update snake position
    function updateSnake() {
        const head = { x: snake[0].x, y: snake[0].y };

        if (direction === 'right') {
            head.x += 1; // Add 1 to x to move right
        } else if (direction === 'left') {
            head.x -= 1; // Subtract 1 from x to move left
        } else if (direction === 'up') {
            head.y -= 1; // Subtract 1 from y to move up
        } else if (direction === 'down') {
            head.y += 1; // Add 1 to y to move down
        }

        // Check for collision with self
        if (snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)) {
            gameOver = true;
        }

        // Check for collision with walls
        if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
            gameOver = true;
        }

        // Eat food
        if (head.x === food.x && head.y === food.y) {
            score++;
            generateFood();
        } else {
            snake.pop();
        }

        snake.unshift(head);
    }

    // Game loop
    function gameLoop(currentTime) {
        if (!gameOver) {
            // Check if enough time has passed since the last move
            if (currentTime - lastMoveTime >= gameSpeed) {
                lastMoveTime = currentTime; 
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                updateSnake();
                drawSnake();
                drawFood();
                ctx.fillStyle = 'white';
                ctx.font = '16px Arial';
                ctx.fillText('Score: ' + score, 10, 20);
            }
        } else {
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.fillText('Game Over', canvas.width / 2 - 60, canvas.height / 2);
            restartButton.style.display = 'block'; // Show restart button
        }

        requestAnimationFrame(gameLoop); // Use requestAnimationFrame for smooth animation
    }

    // Event listeners for keyboard controls
    document.addEventListener('keydown', (event) => {
        if (!gameOver) {
            switch (event.key) {
                case 'ArrowRight':
                    if (direction !== 'left') {
                        direction = 'right';
                    }
                    break;
                case 'ArrowLeft':
                    if (direction !== 'right') {
                        direction = 'left';
                    }
                    break;
                case 'ArrowUp':
                    if (direction !== 'down') {
                        direction = 'up';
                    }
                    break;
                case 'ArrowDown':
                    if (direction !== 'up') {
                        direction = 'down';
                    }
                    break;
            }
        }
    });

    // Mobile button event listeners
    upButton.addEventListener('click', () => {
        if (!gameOver && direction !== 'down') {
            direction = 'up';
        }
    });
    downButton.addEventListener('click', () => {
        if (!gameOver && direction !== 'up') {
            direction = 'down';
        }
    });
    leftButton.addEventListener('click', () => {
        if (!gameOver && direction !== 'right') {
            direction = 'left';
        }
    });
    rightButton.addEventListener('click', () => {
        if (!gameOver && direction !== 'left') {
            direction = 'right';
        }
    });

    // Start button event listener
    startButton.addEventListener('click', () => {
        if (gameOver) {
            gameOver = false;
            score = 0;
            snake = [{ x: 10, y: 10 }];
            direction = 'right';
            generateFood();
            gameLoop(0); // Pass initial time to gameLoop
            startButton.style.display = 'none'; // Hide the button
            restartButton.style.display = 'none'; // Hide the restart button
        } else {
            gameOver = true;
            startButton.style.display = 'block'; // Show the button
        }
    });

    // Restart button event listener
    restartButton.addEventListener('click', () => {
        gameOver = false;
        score = 0;
        snake = [{ x: 10, y: 10 }];
        direction = 'right';
        generateFood();
        gameLoop(0);
        restartButton.style.display = 'none';
        startButton.style.display = 'none';
    });

    // Initialize game
    generateFood();
});