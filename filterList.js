document.write("elo");
chrome.storage.sync.get('blockedSites', function (data){
	data.blockedSites.forEach(function(site){
		document.write(site + '<br />');
	});
});