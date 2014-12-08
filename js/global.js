
//*******************************  DATA **********************************************
var apiKey;
var searchTerm, moviesSearchUrl;
var movieId, info, cast, omdb;
var infoHTML, castHTML, trailerHTML, reviewsHTML, soundtrackHTML;
var soundtracks = new Object();//soundtracks is a hash:
//{"albumID", [array of {"artist": artist, "song": song}, currentHTML]}
//array of two elements, first one is list of tracks, second one is a string

var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0/movies";



//*******************************  FUNCTIONS **********************************************

function fetchData(url, dataType){
	//encapsulate ajax call
	return $.ajax({
		url : url, 
		dataType : dataType,
	});		
}