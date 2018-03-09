function turnFilteringOff(){
	chrome.storage.sync.set({'isEnabled': false}, function() {
		chrome.browserAction.setIcon({path: 'off.png'});
		console.log('Filtering disabled');
	});
}

function turnFilteringOn(callback){
	if (callback === undefined){
		callback = function(confirm){};
	}
	var tabsToDeny = [];
	chrome.storage.sync.get('blockedSites', function (data) {
		chrome.tabs.query({}, function(tabs){
			tabs.forEach(function(tab){
				data.blockedSites.forEach(function (site) {
					if (tab.url.includes(site)) {
						tabsToDeny.push(tab);
					}
				});
			});
			if(tabsToDeny.length > 0){
				var switchOnConfirm = confirm("There are: " + tabsToDeny.length 
					+ " sites to be closed" + "\n Are you sure you want to switch the blocking on?", "Site Blocker");
				if (switchOnConfirm == true) {
					console.log("User confirmed switching on");
					chrome.storage.sync.set({'isEnabled': true}, function() {
						chrome.browserAction.setIcon({path: 'on.png'});
						console.log('Filtering enabled.');
						tabsToDeny.forEach(function(tab){
							denyPage(tab.id);
						});
						callback(true);
					});
				} 
				else {
					console.log("User cancelled the prompt.");
					return false;
					callback(true);
				}
			}
			else{
				chrome.storage.sync.set({'isEnabled': true}, function() {
					chrome.browserAction.setIcon({path: 'on.png'}, function(){
						console.log('Filtering enabled.');
						callback(true);
					});
				});
			}
		});
	});
};

function runPageThroughFilter(tab){
	chrome.storage.sync.get('blockedSites', function (data) {
		data.blockedSites.forEach(function (site) {
			if (tab.url.includes(site)) {
				denyPage(tab.id);
			}
		});
	});
};