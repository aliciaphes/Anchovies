
//*******************************  DATA **********************************************
//var reservoirDogsRT   = "14978";//Rotten Tomatoes ID
//var reservoirDogsIMDB = "tt0105236";//IMDB ID
var apiKey;
var searchTerm, moviesSearchUrl;
var movieId, info, cast, omdb;
var infoHTML, castHTML, trailerHTML, reviewsHTML, twitterHTML, soundtrackHTML;
//var buyHTML;
var soundtracks = new Object();// for(key in myhash){ some code }
//soundtracks is a hash:
//{"albumID", [array of {"artist": artist, "song": song}, currentHTML]}
//array of two elements, first one is list of tracks, second one is a string

var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0/movies";



//*******************************  FUNCTIONS **********************************************

//function fetchData(url, dataType, result, callback){
function fetchData(url, dataType){
	//encapsulate ajax call
	return $.ajax({
		url : url, 
		dataType : dataType,
	});		
}