document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.sync.get('blockedSites', function (data){
		let div = document.getElementById('filterList');
		let table = "<table>";
		let counter = 0;
		data.blockedSites.forEach(function(site){
			
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
				alert(document.getElementById(this.id[0] + "site").innerHTML);
			});
		}	
	});
});
