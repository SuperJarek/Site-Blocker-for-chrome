chrome.runtime.onInstalled.addListener(function initialization(){
	turnFilteringOff();
	var blockedSites = ["://www.onet.","://www.wp."];
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
	  id: "baFilterListMenu",
      title: "Show filter list",
      contexts: ["browser_action"]
});

chrome.contextMenus.create({
	  id: "baAddToFilterList",
      title: "Block this:",
      contexts: ["browser_action"]
});

chrome.contextMenus.create({
	  parentId: "baAddToFilterList",
	  id: "baAddSiteToFilterList",
      title: "Page",
      contexts: ["browser_action"]
});

chrome.contextMenus.create({
	  parentId: "baAddToFilterList",
	  id: "baAddDomainToFilterList",
      title: "Domain",
      contexts: ["browser_action"]
});

chrome.contextMenus.create({
	  id: "baBlockedModeTimer",
      title: "Blocked mode setup",
      contexts: ["browser_action"]
});

chrome.contextMenus.create({
	  id: "pgAddToFilterList",
      title: "Block this:",
      contexts: ["page"]
});

chrome.contextMenus.create({
	  parentId: "pgAddToFilterList",
	  id: "pgAddSiteToFilterList",
      title: "Page",
      contexts: ["page"]
});

chrome.contextMenus.create({
	  parentId: "pgAddToFilterList",
	  id: "pgAddDomainToFilterList",
      title: "Domain",
      contexts: ["page"]
});

chrome.contextMenus.onClicked.addListener(function contextMenuHandler(info, tab) {
		switch(info.menuItemId) {
			case "baFilterListMenu":
				chrome.tabs.create({ url: '/filterList.html'});
				break;
			case "baBlockedModeTimer":
				chrome.tabs.create({ url: '/blockedModeSetup.html'});
				break;
			case "baAddSiteToFilterList":
			case "pgAddSiteToFilterList":
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					let urls = tabs.map(x => x.url);
					addUrlToBlockedSites(urls[0], tab);
				});
				break;
			case "baAddDomainToFilterList":
			case "pgAddDomainToFilterList":
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
