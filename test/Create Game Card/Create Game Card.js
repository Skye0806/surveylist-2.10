var prerequisiteInputsCreated = 0;

$(window).on('load', function(){
	// Use the validator to make sure that the inputs in the sign up form is valid 
	var createGameCardFormValidator = new FormValidator();
	createGameCardFormValidator.registerForm('create-game-card-form', '../../scripts/input_validation/form_feedback.css', createGameCard);
});

async function createGameCard(){
	var organization = document.getElementById('organizationInput').value.trim();
	var organizationQueryResult = await firebase.database().ref("Organizations").orderByKey().equalTo(organization).once('value');
	
	if (organizationQueryResult.numChildren() == 0){
		alert("The organization doesn't exist.");
		return;
	}
	
	var gameName = document.getElementById('gameNameInput').value.trim();
	var authors = document.getElementById('authorsInput').value.trim();
	var starCount = document.getElementById('starsCountInput').value.trim();
	
	await firebase.database().ref("Organizations/"+organization+"/Games/"+gameName+"/GameInfo").update({
		Authors: authors,
		Image: "images/game_images/"+gameName+".png",
		Link: "../Games/"+gameName,
		StarCount: starCount
	});
	
	var prerequisiteInputs = $('#prerequisites-inputs').find('input');
	if (prerequisiteInputs.length == 0){
		await firebase.database().ref("Organizations/"+organization+"/Games/"+gameName+"/Prerequisites").set({
		});
	}
	else{
		$(prerequisiteInputs).each(async function(index, prerequisiteInput){
			await firebase.database().ref("Organizations/"+organization+"/Games/"+gameName+"/Prerequisites").set({
				[prerequisiteInput.value.trim()] : ""
			});
		});
	}
	
	alert("The game card has been created.");
}