
//$(document).ready(function()
//{
//    $("table#survey1 tr:nth-child(2)").css("background-color", "#A52A2A");

//});


function SurveyConfig(surveyName, surveyLink, surveyTopic, surveyExpirydate, surveyLength, surveyPrerequisitesCompleted){
	this.SurveyName = surveyName;
	this.SuveyLink = surveyLink;
	this.SurveyTopic =  surveyTopic;
	this.surveyExpirydate =  surveyExpirydate;
	this.SurveyLength = surveyLength;
	this.SurveyPrerequisitesCompleted = surveyPrerequisitesCompleted;

}

function displaySurveyTable(surveyConfig){

	$("#survey-section").append(
		'<a class="survey-record survey-prerequisites-completed-'+String(surveyConfig.surveyPrerequisitesCompleted)+'" href="'+surveyConfig.surveyLink+'">' +
					'<div class="survey-table">' +
          '<table>'+
          '<tr>'+
          '<td><button></button></td>'+
          '<td width=361;>'+surveyConfig.surveyTopic +'</td>'+
          '<td width=340;>'+surveyConfig.surveyExpirydate+'</td>'+
          '<td width=33;>'+surveyConfig.surveyLength+'</td>'+
            '</tr>'+
          '</table>'+
					'</div>'  +
		'</a>'

	);

}

async function getSurveyInfo(){

	var user = firebase.auth().currentUser;

	var survey = sessionStorage.getItem("Organization")


	var surveyCompleted = [];

	var surveyCompletedSnapshot = await firebase.database().ref("Organizations/"+organization+"/Users/"+user.uid+"/SurveyCompleted").once('value');

	surveyCompletedSnapshot.forEach(function(SurveyCompleted){

		surveyCompleted.push(surveyCompleted.key);

	});



	var surveySnapshots = await firebase.database().ref("Organizations/"+organization+"/Surveys").once('value');

	surveySnapshots.forEach(function(surveySnapshot){

		var prerequisitesCompleted = true;



		var prerequisites = surveySnapshot.child("Prerequisites");

		prerequisites.forEach(function(prerequisite){

			if (surveyCompleted.indexOf(prerequisite.key) == -1){

				prerequisitesCompleted = false;

			}

		});
		var surveyName = surveySnapshot.key;

		var surveyLink = surveySnapshot.child("SurveyInfo/Link").val();

		var surveyTopic = surveySnapshot.child("SurveyInfo/Topic").val();

		var surveyExpirydate = surveySnapshot.child("SurveyInfo/Expirydate").val();

		var surveyLength = surveySnapshot.child("SurveyInfo/Length").val();



		var surveyConfig = new surveyConfig(surveyName, surveyLink, surveyTopic, surveyExpirydate, surveyLength, surveyPrerequisitesCompleted);

	displaySurveyTable(surveyConfig);

	});
	$('a.survey-record-prerequisites-completed-false').click(function(){

		return false;

	});

}
$(window).on('load', function(){

	firebase.auth().onAuthStateChanged(function(user) {

		if (user) {

			getSurveyInfo();

		}

	});

});
