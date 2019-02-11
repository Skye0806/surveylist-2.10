function GameCardConfig(gameName, gameLink, gameImage, gameAuthors, gameStarCount, gamePrerequisitesCompleted){
	this.gameName = gameName;
	this.gameLink = gameLink;
	this.gameImage = gameImage;
	this.gameAuthors = gameAuthors;
	this.gameStarCount = gameStarCount;
	this.gamePrerequisitesCompleted = gamePrerequisitesCompleted;
}

function displayGameCard(gameCardConfig){
	$("#game-section").append(
		'<a class="outter-game-card game-card-container-prerequisites-completed-'+String(gameCardConfig.gamePrerequisitesCompleted)+'" href="'+gameCardConfig.gameLink+'">' +
			'<div class="game-card">' +
				'<div class="game-card-header">' +
					'<div class="game-name">' +
						gameCardConfig.gameName +
					'</div>' +
					'<div class="game-card-subheader">' +
						'<div class="game-author">' +
							'By: '+gameCardConfig.gameAuthors +
						'</div>' +
						'<div class="game-card-subheader-star-section">' +
							'<img class="star-image" src="images/others/star/star@3x.png">' +
							'<div class="star-count">' +
								gameCardConfig.gameStarCount+
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div class="game-preview">' +
					'<img class="game-image" src="'+gameCardConfig.gameImage+'">' +
					'<img class="canadian-flag" src="images/others/canadian_flag/canadian_flag3x.png">' +
					'<img class="play-button" src="images/others/play_button/play_button@3x.png">' +
					'<img class="padlock" src="images/others/lock/lock.png" alt="Locked" width="54px">' +
					//'<i class="padlock fas fa-lock fa-3x"></i>' +
				'</div>' +
			'</div>' +
		'</a>'
	);
}

async function getGameCards(){
	var user = firebase.auth().currentUser;
	var organization = sessionStorage.getItem("Organization");

	var gamesCompleted = [];
	var gamesCompletedSnapshot = await firebase.database().ref("Organizations/"+organization+"/Users/"+user.uid+"/GamesCompleted").once('value');
	gamesCompletedSnapshot.forEach(function(gameCompleted){
		gamesCompleted.push(gameCompleted.key);
	});

	var gameSnapshots = await firebase.database().ref("Organizations/"+organization+"/Games").once('value');
	gameSnapshots.forEach(function(gameSnapshot){
		var prerequisitesCompleted = true;

		var prerequisites = gameSnapshot.child("Prerequisites");
		prerequisites.forEach(function(prerequisite){
			if (gamesCompleted.indexOf(prerequisite.key) == -1){
				prerequisitesCompleted = false;
			}
		});

		var gameName = gameSnapshot.key;
		var gameLink = gameSnapshot.child("GameInfo/Link").val();
		var gameImage = gameSnapshot.child("GameInfo/Image").val();
		var gameAuthors = gameSnapshot.child("GameInfo/Authors").val();
		var gameStarCount = gameSnapshot.child("GameInfo/StarCount").val();

		var gameCardConfig = new GameCardConfig(gameName, gameLink, gameImage, gameAuthors, gameStarCount, prerequisitesCompleted);
		displayGameCard(gameCardConfig);
	});


	$('a.game-card-container-prerequisites-completed-false').click(function(){
		return false;
	});
}

$(window).on('load', function(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			getGameCards();
		}
	});
});
