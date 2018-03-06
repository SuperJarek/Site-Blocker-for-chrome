document.addEventListener('DOMContentLoaded', function() {
	console.log('closing tab set0.');
	selectCurrentValues();
    let saveButton = document.getElementById('save');
    saveButton.addEventListener('click', function() {
		let closingMethodRadios = document.getElementsByName('blocking_method');
		if(closingMethodRadios[0].checked){
			chrome.storage.sync.set({'blocking_method': "close_tab"}, function() {
				console.log('closing tab set.');
			});
		}
		else if(closingMethodRadios[1].checked){
			chrome.storage.sync.set({'blocking_method': "clear_tab"}, function() {
				console.log('clearing tab set.');
			});
		}
    });
});

function selectCurrentValues(){
	console.log('closing tab set0.');
	chrome.storage.sync.get('blocking_method', function (data){
		switch(data.blocking_method){
			case "close_tab":
				document.getElementById("close_tab").checked = true;
				console.log('closing tab set2.');
				break;
			case "clear_tab":
				document.getElementById("clear_tab").checked = true;
				console.log('clearing tab set2.');
				break;
		}
	});
}