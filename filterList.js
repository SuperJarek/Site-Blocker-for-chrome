document.addEventListener('DOMContentLoaded', function renderFilterListTable() {
	drawFilterListTable(setCloseButtonsListeners);
	setAddButtonListener();
});

function setCloseButtonsListeners(){
	let buttons = document.getElementsByTagName("button");
		console.log("button number: " + buttons.length);
	for (i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener("click", function() {
			let url = document.getElementById(this.id[0] + "site").innerHTML;
			let id = this.id[0];
			chrome.storage.sync.get('blockedSites', function (data){
				let blockedSites = data.blockedSites;
				blockedSites.splice(id,1);
				console.log("selected button index: " + id);
				chrome.storage.sync.set({'blockedSites': blockedSites}, function (){
					console.log(url + " has been removed from filter list");
					drawFilterListTable(setCloseButtonsListeners);
				});
			});
		});
	};	
};

function drawFilterListTable(callback){
	chrome.storage.sync.get('blockedSites', function (data){
		let blockedSites = data.blockedSites;
		let tableDiv = document.getElementById('filterList');
		let table = "<table>";
		let counter = 0;
		blockedSites.forEach(function(site){
			table += "<tr><td id =\"" + counter + "site\">" 
				+ site + "</td><td><button id =\""+ counter++ 
				+ "button\">&times;</button ></td></tr>";
		});
		table += "</table>";
		document.getElementById('filterList').innerHTML = table;
		console.log("table drawn");
		
		if (callback === undefined){
			callback = function(){};
		}
		callback();
	});
};

function setAddButtonListener(){
	document.getElementById('urlInput').addEventListener("keypress", function(event){
		if(event.keyCode == 13){ // 13 is enter
			addUrlToFilterList();
		}
	});
    let addButton = document.getElementById('add');
    addButton.addEventListener('click', function() {
		addUrlToFilterList();
    });
};

function addUrlToFilterList(){
	let urlInput = document.getElementById('urlInput');
	if(urlInput.value != ""){
		chrome.storage.sync.get('blockedSites', function (data){
			let blockedSites = data.blockedSites;
			blockedSites.push(urlInput.value)
			chrome.storage.sync.set({'blockedSites': blockedSites}, function (){
				console.log(urlInput + " has been added to filter list");
				drawFilterListTable(setCloseButtonsListeners);
			});
		});
	}
};