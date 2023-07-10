document.getElementById('startButton').addEventListener('click', startGame);
let isMuted = false;
function playSound(src) {
		if (!isMuted) {
			new Audio(src).play();
		}
	}

	document.getElementById('muteButton').addEventListener('click', function() {
		isMuted = !isMuted;
		this.textContent = isMuted ? 'Unmute' : 'Mute';
});
function startGame() {
	document.getElementById('startButton').style.display = 'none';
	document.getElementById('title').style.display = 'none';
	document.getElementById('myCanvas').style.display = 'block';

	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	var x = canvas.width / 2;
	var y = canvas.height - 60;
	var dx = 4;
	var dy = -4;
	var speed = Math.sqrt(dx * dx + dy * dy);
	var ballRadius = 12;
	var paddleHeight = 20;
	var paddleWidth = 150;
	var paddleX = (canvas.width - paddleWidth) / 2;
	var rightPressed = false;
	var leftPressed = false;
	var brickRowCount = 3;
	var brickColumnCount = 5;
	var brickWidth = 150;
	var brickHeight = 70;
	var brickPadding = 30;
	var brickOffsetTop = 60;
	var brickOffsetLeft = 60;
	var score = 0;
	let timer = setInterval(function(){
		gameSeconds++;
	}, 1000);
	let gameSeconds = 0;
	var bricks = [];
	for (var c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for (var r = 0; r < brickRowCount; r++) {
			bricks[c][r] = { x: 0, y: 0, status: 1 };
		}
	}

	var brickBreakSounds = [
		'brickBreak1.mp3',
		'brickBreak2.mp3',
		'brickBreak3.mp3',
		'brickBreak4.mp3',
		'brickBreak5.mp3',
		'brickBreak6.mp3',
		'brickBreak7.mp3',
		'brickBreak8.mp3'
	];
	var gameWonSound = 'gameWon.mp3';
	var gameOverSound = 'gameOver.mp3';

	var brickImage = new Image();
	brickImage.src = 'brickImage.jpg';

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	function keyDownHandler(e) {
		if (e.key == "Right" || e.key == "ArrowRight") {
			rightPressed = true;
		} else if (e.key == "Left" || e.key == "ArrowLeft") {
			leftPressed = true;
		}
	}

	function keyUpHandler(e) {
		if (e.key == "Right" || e.key == "ArrowRight") {
			rightPressed = false;
		} else if (e.key == "Left" || e.key == "ArrowLeft") {
			leftPressed = false;
		}
	}

	function drawBall() {
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	}

	function drawPaddle() {
		ctx.beginPath();
		ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	}

	function drawBricks() {
		for (var c = 0; c < brickColumnCount; c++) {
			for (var r = 0; r < brickRowCount; r++) {
				if (bricks[c][r].status == 1) {
					var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
					var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
					bricks[c][r].x = brickX;
					bricks[c][r].y = brickY;
					ctx.beginPath();
					ctx.drawImage(brickImage, brickX, brickY, brickWidth, brickHeight);
					ctx.closePath();
				}
			}
		}
	}
	let level = 1;
    let totalBricks;
function initializeBricks() {
    if (level === 1) {
        brickRowCount = 3;
        brickColumnCount = 5;
        totalBricks = brickRowCount * brickColumnCount; // Total bricks for level 1
    } else if (level === 2) {
        brickRowCount = 3; // Change the rows and columns as you like for level 2
        brickColumnCount = 5;
        totalBricks = Math.ceil(brickRowCount * brickColumnCount / 2); // We only have half the bricks visible in level 2
    }
    bricks = [];
    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            var status = 1;
            if (level === 2 && (c + r) % 2 == 1) {
                // On level 2, every other brick's status is set to 0 (invisible), 
                // but we are still considering it in the totalBricks count.
                status = 0; 
            }
            bricks[c][r] = { x: 0, y: 0, status: status };
        }
    }
}

initializeBricks();

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (
                    x + ballRadius > b.x && 
                    x - ballRadius < b.x + brickWidth &&
                    y + ballRadius > b.y &&
                    y - ballRadius < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    var randomSoundIndex = Math.floor(Math.random() * brickBreakSounds.length);
                    playSound(brickBreakSounds[randomSoundIndex]);
                    if (score == totalBricks) { // Check the score against the totalBricks variable instead
                        if (level === 1) {
                            level++;
                            score = 0;
                            initializeBricks();
                            x = canvas.width / 2;
                            y = canvas.height - 60;
                            dx = 4;
                            dy = -4;
                            paddleX = (canvas.width - paddleWidth) / 2;
                        } else {
                            new Audio(gameWonSound).play();
                            drawMessage("YOU BROKE NONCE38, CONGRATULATIONS!!!");
                            drawMessage2("Thx to Gackibear for audio");
                            clearInterval(timer);
                            clearInterval(interval);
                            return;
                        }
                    }
                }
            }
        }
    }
}

	
	function drawMessage(message) {
		clearInterval(interval);
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.font = "40px Arial";
		ctx.fillStyle = "yellow";
		ctx.textAlign = "center";
		ctx.fillText(message, canvas.width / 2, canvas.height / 2);
	}
	function drawMessage2(message) {
		clearInterval(interval);
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.font = "30px Arial";
		ctx.fillStyle = "green";
		ctx.textAlign = "center";
		ctx.fillText(message, canvas.width / 2, canvas.height / 2 + 150);
	}

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBricks();
		drawBall();
		drawBeta();
		drawPaddle();
		ctx.font = "20px Arial";
		ctx.fillStyle = "#0095DD";
		ctx.fillText("Time: "+gameSeconds, canvas.width-100, 20);
		collisionDetection();
		if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
			dx = -dx;
		}
		if (y + dy < ballRadius) {
			dy = -dy;
		} else if (y + dy > canvas.height - ballRadius) {
			if (x > paddleX && x < paddleX + paddleWidth) {
				dy = -dy;
				var deltaX = x - (paddleX + paddleWidth / 2);
				dx = deltaX * 0.1;
				var newSpeed = Math.sqrt(dx * dx + dy * dy);
				dx *= speed / newSpeed;
				dy *= speed / newSpeed;
			} else {
				playSound(gameOverSound);
				drawMessage("GAME OVER");
				document.getElementById('startButton').style.display = 'block';
				document.getElementById('startButton').innerText = "Restart";
				return;
			}
		}

		if (rightPressed && paddleX < canvas.width - paddleWidth) {
			paddleX += 14;
		} else if (leftPressed && paddleX > 0) {
			paddleX -= 14;
		}
		x += dx;
		y += dy;
	}
	function drawBeta() {
		ctx.font = "16px Arial";
		ctx.fillStyle = "#0095DD";
		ctx.fillText("BETA v0.5", 8, 20);
	}
	var interval = setInterval(draw, 10);
}
