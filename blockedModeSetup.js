document.addEventListener('DOMContentLoaded', function() {
	let textField = document.getElementById('duration');
	textField.focus();
	textField.select();
	
	document.getElementById('duration').addEventListener('keyup', function(event) {
		event.preventDefault();
		if (event.keyCode === 13) {
			document.getElementById("start").click();
		}
	});
	
    let startButton = document.getElementById('start');
    startButton.addEventListener('click', function() {
		console.log("klikniete");
		let currentDateMilliseconds = Date.now();
		let durationMilliseconds = 
			document.getElementById('duration').value * 60 * 1000;
		let blockUntil = currentDateMilliseconds + durationMilliseconds;
		chrome.storage.sync.set({'blockUntilMilliseconds': blockUntil}, function() {
				console.log('Time set to ' + blockUntil);
		});
		chrome.storage.sync.set({'isEnabled': true}, function() {
		chrome.browserAction.setIcon({path: 'on.png'});
				console.log('Set to enabled');
		});
    });
});

