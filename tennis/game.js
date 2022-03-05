var canvas;
var canvasContext;
var ballX = 400;
var ballY = 300;
var ballSpeedX = 10;
var ballSpeedY = 10;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 10;

var showWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
const PADDLE_OFFSET = 20;
const PADDLE_AI_SPEED = 15;

const BALL_RADIUS = 10;


function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x: mouseX,
		y: mouseY
	};
}

function handleMouseClick(evt) {
	if(showWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showWinScreen = false;
	}
}

function limitPaddle(paddleY) {
	if(paddleY < 20) {
		return 20;
	}
	if(paddleY + PADDLE_HEIGHT > canvas.height - 20) {
		return canvas.height - PADDLE_HEIGHT - 20;
	}
	return paddleY;
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	var framesPerSecond = 30;
	setInterval(callBoth, 1000/framesPerSecond);
	canvas.addEventListener('mousedown',handleMouseClick);
	canvas.addEventListener('mousemove',
			function(evt) {
					var mousePos = calculateMousePos(evt);
					paddle1Y = limitPaddle(mousePos.y - (PADDLE_HEIGHT/2));
			});
}

function callBoth() {
	moveEverything();
	drawEverything();
}

function ballReset() {
	if(player1Score >= WINNING_SCORE ||
		player2Score >= WINNING_SCORE) {
		showWinScreen = true;
	}
	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function computerMovement(){
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter < ballY - 35) {
			paddle2Y = limitPaddle(paddle2Y += PADDLE_AI_SPEED);
	} else if(paddle2YCenter > ballY + 35) {
			paddle2Y = limitPaddle(paddle2Y -= PADDLE_AI_SPEED);
	}
}

function moveEverything() {
	if(showWinScreen) {
		return;
	}
	computerMovement();
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	var ballSurfaceLeft = ballX - BALL_RADIUS;
	var ballSurfaceRight = ballX + BALL_RADIUS;
	var ballSurfaceBottom = ballY - BALL_RADIUS;
	var ballSurfaceTop = ballY + BALL_RADIUS;
	if(ballSurfaceLeft < PADDLE_THICKNESS + PADDLE_OFFSET) {
		if(ballSurfaceTop > paddle1Y &&
			ballSurfaceBottom < paddle1Y + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			if(ballSurfaceLeft < 0) {
				player2Score++; // MUST: before ballReset()
				ballReset();
			}
		}
	}
	if(ballSurfaceRight > canvas.width - PADDLE_THICKNESS - PADDLE_OFFSET) {
		if(ballSurfaceTop > paddle2Y &&
			ballSurfaceBottom < paddle2Y + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			if(ballSurfaceRight > canvas.width) {
				player1Score++; // MUST: before ballReset()
				ballReset();
			}
		}
	}
	if(ballSurfaceBottom < 20) {
		ballSpeedY = -ballSpeedY;
	}
	if(ballSurfaceTop > canvas.height - 20) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet() {
	for(var i = 0; i < canvas.height; i += 40) {
		colorRect(canvas.width/2 - 1, i, 2, 20, 'white')
	}
}

function drawEverything() {
	// blacks out screen
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	if(showWinScreen) {
		canvasContext.fillStyle = 'white';
		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillText("Left Player won!", 350, 200);
		} else if(player2Score >= WINNING_SCORE) {
			canvasContext.fillText("Right Player won!", 350, 200);
		}
		canvasContext.fillText("Click to Continue", 350, 500);
		return;
	}

	drawNet();

	// border
	colorRect(0, 10, canvas.width, 10, 'white');
	colorRect(0, canvas.height - 20, canvas.width, 10, 'white');

	// left player paddle
	colorRect(PADDLE_OFFSET, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

	// right computer paddle
	colorRect(canvas.width - PADDLE_THICKNESS - PADDLE_OFFSET, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

	// ball
	colorCircle(ballX, ballY, BALL_RADIUS, 'white');

	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}