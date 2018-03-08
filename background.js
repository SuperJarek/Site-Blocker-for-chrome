chrome.runtime.onInstalled.addListener(function initialization(){
	turnFiltereingOff();
	var blockedSites = ["://www.facebook","://twitter",
		"://www.youtube","://www.instagram"];
	chrome.storage.sync.set({'blockedSites': blockedSites}, function() {
			console.log('Blocked sites are loaded.');
	});
	chrome.storage.sync.set({'blockingMethod': "close_tab"}, function() {});
	let timerData = { isTimerEnabled: false, blockUntilMilliseconds: 0};
	chrome.storage.sync.set({'timerData': timerData}, function() {});
});

chrome.browserAction.onClicked.addListener(function toggleBlocking(){
	chrome.storage.sync.get('isEnabled', function(data){

		if(data.isEnabled){
			turnFilteringOff();
		}
		else{
			turnFilteringOn();
		}
	});
});

chrome.tabs.onUpdated.addListener(function blockIfEnabled(tabId, info, tab) {
	chrome.storage.sync.get('isEnabled', function (data) {
		if (data.isEnabled) {
			chrome.storage.sync.get('timerData', function (data) {
				if(data.timerData.isTimerEnabled){
					let timeLeft = data.timerData.blockUntilMilliseconds - Date.now();
					if (timeLeft <= 0){  //unblock
						data.timerData.isTimerEnabled = false;
						chrome.storage.sync.set({'timerData': data.timerData}, function() {
							turnFilteringOff();
						});
						return;
					}
					else{
						filterPage(tabId, tab);
					}
				}
				else{
					filterPage(tabId, tab);
				}
			});
		}
	});
});

function turnFilteringOff(){
	chrome.storage.sync.set({'isEnabled': false}, function() {
		chrome.browserAction.setIcon({path: 'off.png'});
		console.log('Filtering disabled');
	});
}

function turnFilteringOn(){
	chrome.storage.sync.set({'isEnabled': true}, function() {
		chrome.browserAction.setIcon({path: 'on.png'});
		console.log('Filtering enabled.');
	});
}

function filterPage(tabId, tab){
	chrome.storage.sync.get('blockedSites', function (data) {
		data.blockedSites.forEach(function (site) {
			if (tab.url.includes(site)) {
				denyPage(tabId); 
			}
		});
	});
}

function denyPage(tabId){
	chrome.storage.sync.get('blockingMethod', function (data) {
		switch (data.blockingMethod) {
			case "close_tab":
				chrome.tabs.remove(tabId);
				break;
			case "clear_tab":
				chrome.tabs.discard(tabId);
				break;
			/* Alternative way of dealing with tab
				chrome.tabs.executeScript(tabId, {
				code: 'document.body.innerHTML = "No facebook for you!"'
			}); */
		}
	});
}

chrome.contextMenus.create({
	  id: "FilterListMenu",
      title: "Show Filter List",
      contexts: ["browser_action"]
});

chrome.contextMenus.create({
	  id: "AddSiteToFilterList",
      title: "Block this page",
      contexts: ["browser_action"]
});

chrome.contextMenus.create({
	  id: "BlockedModeTimer",
      title: "Blocked mode setup",
      contexts: ["browser_action"]
});

chrome.contextMenus.onClicked.addListener(function contextMenuHandler(info, tab) {
		switch(info.menuItemId) {
			case "FilterListMenu":
				chrome.tabs.create({ url: '/filterList.html'});
				break;
			case "BlockedModeTimer":
				chrome.tabs.create({ url: '/blockedModeSetup.html'});
				break;
			case "AddSiteToFilterList":
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.storage.sync.get('blockedSites', function (data){
						if(tabs.length>1){
							alert('Something went wrong. Sorry.');
							throw new Error('More than one active page in current window')
						}
						let urls = tabs.map(x => x.url);
						data.blockedSites.push(urls);
						chrome.storage.sync.set({'blockedSites':data.blockedSites}, function(data){
							console.log(urls + ' added to blocked sites');
							chrome.storage.sync.get('isEnabled', function (data){
								if(data.isEnabled){
									denyPage(tab.id);
								}
							});	
						});
					});	
				});
				break;
		}
});






