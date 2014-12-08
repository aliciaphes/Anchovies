$(document).ready(function(){

	//http://stackoverflow.com/questions/14220321/how-to-return-the-response-from-an-ajax-call


	//http://jsfiddle.net/RhnvU
	//$("#results input").on('change', function(){
	$("#results").on('change', function(){
	//$("*[type='radio']").on('change', function(){
		
		//borrar esto !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		apiKey = "288q6w6yndu6msze233n2ztp";

		if(apiKey){
	
			movieId = $("#results input:radio:checked").attr('id');

			//retrieve API key
			if(movieId){
				$("#ajaxLoader").removeClass("hidden");
				$("#results").hide();

				/**The 'Info' section is going to combine information from both OMDB and Rotten Tomatoes API, so we first read from one and send the data to the other
				*/
				buildInfo();//retrieve all the information
			}			
		}
		else{
			alert("Error reading API key value");
		}


	});




	//$(staticAncestors).on(eventName, dynamicChild, function() {});
	$("#content").on("click", ".disc", function(){
		//e.preventDefault();

		$(this).removeClass("disc");
		$(this).addClass("tracks");

		var albumID = $(this).attr("data-albumID");

		var trackList = soundtracks[albumID];

		if(trackList){//already exists
			$(this).html(createListTracks(trackList[0]));//.addClass("tracks");
		}
		else{
			//initialize:
			soundtracks[albumID]    = [];
			soundtracks[albumID][0] = [];
			soundtracks[albumID][1] = $(this).clone().wrap('<p>').parent().html();//save current html content			
			moviesSearchUrl = "https://api.spotify.com/v1/albums/" + albumID + "/tracks";
			
			//fetchData("tracks.json", "json")
			fetchData(moviesSearchUrl, "json")
			.done(function(data){
			    if(data){
			    	
			    	var tracksArray = [];
			    	var tracks = data["items"];
			    	for(var i=0; i<tracks.length;i++){
		                //create a new JSON object for each track
		                var track = {
		                    "artist" : tracks[i].artists[0].name,
		                    "song" : tracks[i].name
		                };
		                tracksArray.push(track);
			    	}
			    	//retrieve album ID since here trackList is not accessible
			    	var album = data["href"].split("https://api.spotify.com/v1/albums/")[1].split("/tracks")[0];
			    	soundtracks[album][0] = tracksArray;
			    	$('*[data-albumID="' + album +'"]').html(createListTracks(tracksArray));

			    }
			    else{
			        alert("Error");
			    }
			})
			.fail(function(x) {
			    alert("Error retrieving tracks of album");
			});
		}
	});



	$("#content").on("click", ".tracks", function(){
		var currentHTML = $(this).clone().wrap('<p>').parent().html();
		var albumID = $(this).attr("data-albumID");
		$(this).addClass("disc");
		$(this).removeClass("tracks");
		$(this).html(soundtracks[albumID][1]);
		soundtracks[albumID][1] = currentHTML;
	});



//jquery mobile?
/*	.hover(
	  function() {
	    $( this ).append( $( "<span> ***</span>" ) );
	  }, function() {
	    $( this ).find( "span:last" ).remove();
	  }
	);*/




	function buildTwitter(){

	}



	$("li").click(function(e){

		$("#content").html("");//clear content
		$("#content").removeClass();

		switch(this.id){
			case "info":
				//info is a special case:
				if(infoHTML){
					$("#content").html(infoHTML);
					$("#content").removeClass("hidden");
				}
				else{
					$("#content").addClass("alert alert-danger");
					$("#content").removeClass("hidden");
					$("#content").html("No information was found");
				}				
				break;

			case "cast":
				if(castHTML.html()){
					$("#content").html(castHTML);
				}
				else{
					$("#content").addClass("alert alert-danger");
					$("#content").removeClass("hidden");
					$("#content").html("No cast was found");
				}
				break;

			case "trailer":
				if(trailerHTML){
					$("#content").html(trailerHTML);
				}
				else{
					$("#content").addClass("alert alert-danger");
					$("#content").removeClass("hidden");
					$("#content").html("No trailers were found");
				}				
				break;

			case "reviews":
				if(reviewsHTML){
					$("#content").html(reviewsHTML);
				}
				else{
					$("#content").addClass("alert alert-danger");
					$("#content").removeClass("hidden");
					$("#content").html("No reviews were found");
				}				
				break;

			case "soundtrack":
			//http://brett.freemusicarchive.org:8000/api
			//http://ws.spotify.com/search/1/album.json?q=gump
				if(soundtrackHTML){
					$("#content").html(soundtrackHTML);
				}
				else{
					$("#content").addClass("alert alert-danger");
					$("#content").removeClass("hidden");
					$("#content").html("No soundtrack albums were found");
				}				
				break;				

			case "twitter":
				$("#content").html(twitterHTML);
				break;

			// case "buy":
			// 	$("#content").html(buyHTML);
			// 	break;
		}

	});


	$("#search").click(function(){

		$("#content").html("");//clear content
		$("#content").removeClass();//and remove ALL classes

		//hide the sections:
		$("#sections").children().addClass("hidden");		

		var toSearch = $("#searchTerm").val();//read what's on the input field

		if(toSearch.length >= 3){
			//if(toSearch != searchTerm){

				//update searchTerm:
				searchTerm = toSearch;

				//show the 'loading' animation
				$("#ajaxLoader").removeClass('hidden');

				//http://imdb.wemakesites.net
				//http://imdbapi.poromenos.org
				//https://code.google.com/p/moviepilot-api/w/list

				$("#results").html("");
				searchMovie(encodeURIComponent(searchTerm));
			//}
		}
		else{alert("at least 3chars");}

	});


});//ready