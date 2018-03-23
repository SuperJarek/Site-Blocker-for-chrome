const ENTER_KEY_CODE = 13;

document.addEventListener('DOMContentLoaded', function() {
	let textField = document.getElementById('duration');
    let startButton = document.getElementById('start');
	chrome.storage.sync.get('timerData', function (data) {
		if(data.timerData.isTimerEnabled == true){
			startButton.disabled = true;
			textField.disabled = true;
		}
		else{
			textField.focus();
			textField.select();
		}
	});
	
	document.getElementById('duration').addEventListener('keyup', function(event) {
		event.preventDefault();
		if (event.keyCode == ENTER_KEY_CODE) {
			enableTimerMode();
		}
	});
    startButton.addEventListener('click', enableTimerMode);
	timer();
});

function enableTimerMode(){
	chrome.storage.sync.get('timerData', function (data) {
		if(!data.timerData.isTimerEnabled){
			turnFilteringOn(function(confirm){
				if(confirm){
					document.getElementById('start').disabled = true;
					document.getElementById('duration').disabled = true;
					setTimer();
				}
			});
		}
		else{
			var now = new Date().getTime();
			var timeLeft = data.timerData.blockUntilMilliseconds - now;
			var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
			alert("Timer mode enabled! You can't reset it untill time is up. " + hours + " hours " 
					+ minutes + " minutes " + seconds + " seconds left.");
		}
	});
}

function setTimer(){
		let currentDateMilliseconds = Date.now();
		let durationMilliseconds = 
			document.getElementById('duration').value * 60 * 1000;
		let blockUntil = currentDateMilliseconds + durationMilliseconds;
		let timerData = { isTimerEnabled: true, blockUntilMilliseconds: blockUntil};
		chrome.storage.sync.set({'timerData': timerData}, function() {
			console.log('Time set to ' + blockUntil);
			timer();
			// return; <- commented on "feature/instant_block_after_enabling"
 		});
}

function timer(){
	chrome.storage.sync.get('timerData', function (data) {
		if(data.timerData.isTimerEnabled){
			var timerInterval = setInterval(function() {
				var now = new Date().getTime();
				var timeLeft = data.timerData.blockUntilMilliseconds - now;
				var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
				document.getElementById("timer").innerHTML =  hours + "h " + minutes + "m " 
																							+ seconds + "s left";
				if (timeLeft < 0) {
					clearInterval(timerInterval);
					document.getElementById("timer").innerHTML = "UNBLOCKED!";
					document.getElementById('start').disabled = false;
					//turnFilteringOff();
				}
			}, 1000);
		}
	});
}
