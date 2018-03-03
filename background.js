chrome.runtime.onStartup.addListener(function (){
	var enabled = false;
	chrome.storage.sync.set({'enabled': enabled}, function() {
		console.log('Extension is disabled.');
	});
});

function updateIcon(){
	chrome.storage.sync.get('enabled', function(data){
		var enabled = data.enabled;
		var icon;
		if(enabled){
			icon = 'on.png';
		}else{
			icon = 'off.png';
		}
		enabled = !enabled;
		chrome.browserAction.setIcon({path: icon});
		chrome.storage.sync.set({'enabled': enabled}, function() {
			console.log('Extension has been disabled/enabled.');
		});	
	});
};

chrome.browserAction.onClicked.addListener(updateIcon);
