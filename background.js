chrome.runtime.onInstalled.addListener(function initialization(){
	var isEnabled = false;
	chrome.storage.sync.set({'isEnabled': isEnabled}, function() {
		console.log('Extension is disabled.');
	});
	var blockedSites = ["://www.facebook","://twitter",
		"://www.youtube","://www.instagram"];
	chrome.storage.sync.set({'blockedSites': blockedSites}, function() {
			console.log('Blocked sites are loaded.');
	});
});

chrome.browserAction.onClicked.addListener(function updateIcon(){
	chrome.storage.sync.get('isEnabled', function(data){
		var isEnabled = data.isEnabled;
		isEnabled = !isEnabled;
		var icon;
		if(isEnabled){
			icon = 'on.png';
		}else{
			icon = 'off.png';
		}
		chrome.browserAction.setIcon({path: icon});
		chrome.storage.sync.set({'isEnabled': isEnabled}, function() {
			console.log('Extension has been disabled/enabled.');
		});	
	});
});

chrome.tabs.onUpdated.addListener(function closeFacebook(tabId , info , tab) {
	chrome.storage.sync.get('isEnabled', function(data){
		if(data.isEnabled){
			console.log(tab.url);
			chrome.storage.sync.get('blockedSites', function (data){
					data.blockedSites.forEach(function(site){
					if(tab.url.includes(site)){
						chrome.tabs.discard(tabId);

					/* Alternative way of dealing with tab no. 1
						chrome.tabs.executeScript(tabId, {
							code: 'document.body.innerHTML = "No facebook for you!"'
						});
					*/
				
					/* Alternative way no. 2
						chrome.tabs.remove(tabId);
					*/


					}


				});
			});

		}
	});
});

chrome.contextMenus.create({
      title: "Show Filter List",
      contexts: ["browser_action"],
      onclick: function() {
        chrome.tabs.create({ url: '/filterList.html'});
      }
});




