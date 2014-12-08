$(document).ready(function(){

	$("#results").on('change', function(){

		if(apiKey){
	
			movieId = $("#results input:radio:checked").attr('id');
			$("#title").parent().removeClass("hidden");
			$("#title").html($("label[for='" + movieId + "']").html());

			//retrieve API key
			if(movieId){
				$("#ajaxLoader").removeClass("hidden");
				$("#results").addClass("hidden");

				/**The 'Info' section is going to combine information from both OMDB and Rotten Tomatoes API, so we first read from one and send the data to the other
				*/
				buildInfo();//retrieve all the information
			}			
		}
		else{
			$("#errorBlock").removeClass("hidden");
			$("#errorBlock").html("Error reading API key value");
		}
	});



	$("#content").on("click", ".disc", function(){

		$(this).removeClass("disc");
		$(this).addClass("tracks");

		var albumID = $(this).attr("data-albumID");

		var trackList = soundtracks[albumID];

		if(trackList){//already exists
			$(this).html(createListTracks(trackList[0]));
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
					$("#errorBlock").removeClass("hidden");
					$("#errorBlock").html("Error reading from Spotify API");
			    }
			})
			.fail(function(x) {
				$("#errorBlock").removeClass("hidden");
				$("#errorBlock").html("Error retrieving tracks of album");			    
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



	$(".disc").tooltip();//it doesn't work, it seems to be a conflict with bootstrap's tooltip's css


	$("li").click(function(e){

		$("#content").html("");//clear content
		$("#content").removeClass();
		$("#errorBlock").addClass("hidden");

		switch(this.id){
			case "info":
				//info is a special case:
				if(infoHTML){
					$("#content").html(infoHTML);
					$("#content").removeClass("hidden");
				}
				else{
					$("#errorBlock").removeClass("hidden");
					$("#errorBlock").html("No information was found");
				}				
				break;

			case "cast":
				if(castHTML.html()){
					$("#content").html(castHTML);
				}
				else{
					$("#errorBlock").removeClass("hidden");
					$("#errorBlock").html("No cast was found");					
				}
				break;

			case "trailer":
				if(trailerHTML){
					$("#content").html(trailerHTML);
				}
				else{
					$("#errorBlock").removeClass("hidden");
					$("#errorBlock").html("No trailers was found");					
				}				
				break;

			case "reviews":
				if(reviewsHTML){
					$("#content").html(reviewsHTML);
				}
				else{
					$("#errorBlock").removeClass("hidden");
					$("#errorBlock").html("No reviews were found");					
				}				
				break;

			case "soundtrack":
				if(soundtrackHTML){
					$("#content").html(soundtrackHTML);
				}
				else{
					$("#errorBlock").removeClass("hidden");
					$("#errorBlock").html("No soundtrack was found");					
				}				
				break;
		}

	});


	$("#search").click(function(){

		$("#content").html("");//clear content
		$("#content").removeClass();//and remove ALL classes

		//hide the sections:
		$("#menuItems").children().addClass("hidden");		

		var toSearch = $("#searchTerm").val();//read what's on the input field

		if(toSearch.length >= 3){

			//update searchTerm:
			searchTerm = toSearch;

			//show the 'loading' animation
			$("#ajaxLoader").removeClass('hidden');

			$("#results").html("");
			searchMovie(encodeURIComponent(searchTerm));
		}
		else{
			$("#errorBlock").removeClass("hidden");
			$("#errorBlock").html("You must enter at least 3 characters");
		}
	});


});//ready