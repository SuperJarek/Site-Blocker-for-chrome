document.addEventListener('DOMContentLoaded', function() {
	selectCurrentValues();
    let saveButton = document.getElementById('save');
    saveButton.addEventListener('click', function() {
		let closingMethodRadios = document.getElementsByName('blocking_method');
		if(closingMethodRadios[0].checked){
			chrome.storage.sync.set({'blocking_method': "close_tab"}, function() {
				console.log('Closing tab set.');
			});
		}
		else if(closingMethodRadios[1].checked){
			chrome.storage.sync.set({'blocking_method': "clear_tab"}, function() {
				console.log('Clearing tab set.');
			});
		}
    });
});

function selectCurrentValues(){
	chrome.storage.sync.get('blocking_method', function (data){
		switch(data.blocking_method){
			case "close_tab":
				document.getElementById("close_tab").checked = true;
				break;
			case "clear_tab":
				document.getElementById("clear_tab").checked = true;
				break;
		}
	});
}
