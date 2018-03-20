chrome.runtime.onInstalled.addListener(function initialization(){
	turnFilteringOff();

	chrome.storage.sync.set({'blockingMethod': "close_tab"});
	let timerData = { isTimerEnabled: false, blockUntilMilliseconds: 0};
	chrome.storage.sync.set({'timerData': timerData});
	
	chrome.storage.sync.get('blockedSites', function(data) {
		blockedSites = data.blockedSites;
		if(typeof blockedSites != "undefined" && blockedSites != null 
			&& blockedSites.length != null && blockedSites.length > 0){
			var defaultListConfirm = confirm("We detected that our extension" 
				+ " was installed once on this device.\nDo you want to load your old filter list?");
			if (defaultListConfirm == true) {
				console.log("User confirmed keeping a previous filter list");
			} 
			else {
				console.log("User cancelled loading a previous filter list.");
				addDefaultFilters();
			}
		} 
		else {
			console.log("User didn't have any previous filters");
			addDefaultFilters();
		}

	});

});

function addDefaultFilters(){
	var blockedSites = ["://www.onet.pl","://www.wp.pl"];
	chrome.storage.sync.set({'blockedSites': blockedSites}, function() {
		console.log('Default blocked sites has been loaded.');
	});
};

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
						runPageThroughFilter(tab);
					}
				}
				else{
					runPageThroughFilter(tab);
				}
			});
		}
	});
});

function runPageThroughFilter(tab){
	chrome.storage.sync.get('blockedSites', function (data) {
		data.blockedSites.forEach(function (site) {
			if (tab.url.includes(site)) {
				denyPage(tab.id);
			}
		});
	});
};

chrome.contextMenus.create({
	  id: "FilterListMenu",
      title: "Show filter list",
      contexts: ["browser_action"]
});

chrome.contextMenus.create({
	  id: "AddToFilterList",
      title: "Block this:",
      contexts: ["browser_action"]
});

chrome.contextMenus.create({
	  parentId: "AddToFilterList",
	  id: "AddSiteToFilterList",
      title: "Page",
      contexts: ["browser_action"]
});

chrome.contextMenus.create({
	  parentId: "AddToFilterList",
	  id: "AddDomainToFilterList",
      title: "Domain",
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
					let urls = tabs.map(x => x.url);
					addUrlToBlockedSites(urls[0], tab);
				});
				break;
			case "AddDomainToFilterList":
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					let urls = tabs.map(x => x.url);
					var domain = urls[0].match(/^[\w]+:\/{2}([\w\.:-]+)/)[1];
					addUrlToBlockedSites(domain, tab);
				});
				break;
		}
});

function addUrlToBlockedSites(url, tab){
	chrome.storage.sync.get('blockedSites', function (data){
		data.blockedSites.push(url); // urls.hostname
		chrome.storage.sync.set({'blockedSites':data.blockedSites}, function(data){
			console.log(url + ' added to blocked sites');
			chrome.storage.sync.get('isEnabled', function(data) {
				if(data.isEnabled){
					denyPage(tab.id);
				}
			});
		});
	});	
}
