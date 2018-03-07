document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.sync.get('blockedSites', function (data){
		let blockedSites = data.blockedSites;
		let div = document.getElementById('filterList');
		let table = "<table>";
		let counter = 0;
		blockedSites.forEach(function(site){
			
			table += "<tr><td id =\"" + counter; 
			table += "site\">";
			table += site; 
			table += "</td><td><button id =\""+ counter++ +"button\">&times;</button ></td></tr>";
		});
		table += "</table>";
		div.innerHTML = table;
		
		let bns = document.getElementsByTagName("button");
		for (i = 0; i < bns.length; i++) {
			bns[i].addEventListener("click", function() {
				let url = document.getElementById(this.id[0] + "site").innerHTML;
				blockedSites.splice(this.id[0],1);
				chrome.storage.sync.set({'blockedSites': blockedSites}, function (){
					console.log(url + "has been removed from filter list");
				});
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					if(tabs.length>1){
						alert('Something went wrong. Sorry.');
						throw new Error('passed more than one page to be blocked')
					}
					chrome.tabs.reload(tabs[0].id);
				});
			});
		}	
	});
});
