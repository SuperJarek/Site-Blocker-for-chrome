document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('urlInput').addEventListener("keypress", function(event){
		if(event.keyCode == 13){ // 13 is enter
			addUrlToFilterList();
		}
	});
    let addButton = document.getElementById('add');
    addButton.addEventListener('click', function() {
		addUrlToFilterList();
    });
});

function addUrlToFilterList(){
	let urlInput = document.getElementById('urlInput');
	if(urlInput.value != ""){
		chrome.storage.sync.get('blockedSites', function (data){
			let blockedSites = data.blockedSites;
			blockedSites.push(urlInput.value)
			chrome.storage.sync.set({'blockedSites': blockedSites}, function (){
				console.log(urlInput + " has been added to filter list");
			});
		});
	}
};