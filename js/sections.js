
function buildInfo(){

	// construct the url with our API key
	moviesSearchUrl = baseUrl + "/" + movieId + '.json?apikey=' + apiKey;		

	//fetchData('testdata/info.json', "json")
	fetchData(moviesSearchUrl, "jsonp")//ajax call to the Rotten tomatoes api
	.done(function(data){
	    if(data){

			buildInfoHTML(data);

			var imdbID = data["alternate_ids"];

			if(imdbID){
				addOMDBdata(imdbID["imdb"]);
			}
			
			$("#info").removeClass('hidden');//only show section if it has content
			
			buildCast();
	    }
	    else{
			$("#errorBlock").removeClass("hidden");
			$("#errorBlock").html("No data was found");
	    }
	})
	.fail(function(x) {
		$("#errorBlock").removeClass("hidden");
		$("#errorBlock").html("Error retrieving movie information");
	});		
}


function buildInfoHTML(info){

	var genres, directors, release, rating, format, hours, minutes, html, runtime, li;

	html = $("<ul/>").prepend("<br/>");

	if(info.abridged_directors){
		directors = "";
		$.each(info.abridged_directors, function(index, dir){
			directors += dir.name;
			if(index < info.abridged_directors.length-1)
				directors += ", ";
		});
		html.append("<li>Director(s): " + directors +".</li><br/>");
	}

	//create empty <li> to add OMDB data later on
	li = $("<li/>");
	li.attr("id", "writer").addClass("hidden");
	html.append(li);

	html.append("<li>Year: " + info.year +"</li><br/>");
	html.append("<li>MPAA rating: " + info.mpaa_rating +"</li><br/>");
	
	//convert time:
	hours = Math.floor(info.runtime/60);

	runtime = "<li>Runtime: " + info.runtime + " minutes";
	if(hours > 0){
		minutes = info.runtime % 60;
		
		runtime += " --- " + hours + " hour(s)";

		if(minutes != 0){
			runtime += " and " + minutes + " min";
		}	
	}
	runtime += ".</li><br/>";
	
	html.append(runtime);

	genres = "";
	$.each(info.genres, function(index, genre){
		genres += genre;
		if(index < info.genres.length-1)
			genres += ", ";
	});
	html.append("<li>Genre(s): " + genres + ".</li><br/>");

	release = "<li>Releases:<ul>";
	$.each(info.release_dates, function(key, val){
		format = key[0].toUpperCase() + key.slice(1);
		release += "<li>" + format + ": " + val + "</li>";
	});
	release += "</ul></li><br/>";
	html.append(release);

	li = $("<li/>");
	li.attr("id", "awards").addClass("hidden");
	html.append(li);

	rating = "<li>Ratings:<ul>";
	rating += "<li>Critics' score: " + info.ratings["critics_score"] + "%</li>"
	rating += "<li>Audience score: " + info.ratings["audience_score"] + "%</li>"
	rating += "</ul></li><br/>";
	html.append(rating);

	//html.append('<li><img src="' + omdb.Poster +'"></li>');

	li = $("<li/>");
	li.attr("id", "synopsis").addClass("hidden");
	html.append(li);


	infoHTML = html;
	$("#content").html(infoHTML);
	$("#content").addClass("hidden");
}


function addOMDBdata(id){

	moviesSearchUrl = "http://www.omdbapi.com/?i=tt" + id;

	fetchData(moviesSearchUrl, "json")
	.done(function(data){
	    if(data){
			$("#writer").html("Writer(s): " + data.Writer +".<br/>").removeClass("hidden");
			$("#awards").html("Awards: " + data.Awards + "<br/>").removeClass("hidden");
			$("#synopsis").html("Synopsis: " + data.Plot + "<br/>").removeClass("hidden");
	    }
	    else{
	    }
	})
	.fail(function(x) {
		$("#errorBlock").removeClass("hidden");
		$("#errorBlock").html("Error reading from OMDB API");
	});		
}


function buildCast(){

	moviesSearchUrl = baseUrl + "/" + movieId + '/cast.json?apikey=' + apiKey;

	//fetchData('testdata/cast.json', "json")
	fetchData(moviesSearchUrl, "jsonp")
	.done(function(data){
	    if(data){
	    	
	    	cast = data["cast"];
			var star;
			castHTML = $("<ul/>");
			for(var i=0; i<cast.length; i++){
				star = cast[i];
				if(star.characters.length > 0){
					castHTML.append("<li>" + star.name + " as " + star.characters[0] + "</li><br/>");
				}
			}
			if(castHTML.html()){
				castHTML.prepend("<br/>");
				//$("#cast").removeClass('hidden');//only show section if it has content				
			}

			buildTrailer();		
	    }
	    else{
			$("#errorBlock").removeClass("hidden");
			$("#errorBlock").html("No data was found");
	    }
	})
	.fail(function(x) {
		$("#errorBlock").removeClass("hidden");
		$("#errorBlock").html("Error retrieving movie cast");
	});
}


function buildTrailer(){

	//I believe this uses v2 which is deprecated. TO DO: get a dev.key and update to v3
	moviesSearchUrl = "http://gdata.youtube.com/feeds/videos?vq=" + encodeURIComponent(searchTerm + " trailer") + "&max-results=5&alt=json-in-script";

	//fetchData('testdata/trailers.json', "json")
	fetchData(moviesSearchUrl, "jsonp")//ajax call to the Rotten tomatoes api
	.done(function(data){
	    if(data){
	    	var trailers = data.feed;
	    	if(trailers){
	    		var entries = trailers.entry;
				
				trailerHTML = "";
				for(var i=0; i < entries.length; i++){
					var entry = entries[i];

					var videoID = entry.id.$t.replace('http://gdata.youtube.com/feeds/videos/','');
					
					//var title = entry.title.$t;
					var link = entry.link[0].href;
					
					var video = $("<div/>");
					video.prepend("<br/>");

					video.append('<iframe width="560" height="315" src="//www.youtube-nocookie.com/embed/' + videoID +'?rel=0" frameborder="0"></iframe><br/>');
					
					trailerHTML += video.clone().wrap('<p>').parent().html();
					//wrap with any html tag to retrieve the 'div' tag included
				}

				$("#trailer").removeClass('hidden');//only show section if it has content

				buildSoundtrack();
	    	}
	    }
	    else{
	    }
	})
	.fail(function(x) {
		$("#errorBlock").removeClass("hidden");
		$("#errorBlock").html("Error retrieving movie trailers");
	});
}


function buildSoundtrack(){

	moviesSearchUrl = "http://ws.spotify.com/search/1/album.json?q=" + encodeURIComponent(searchTerm + " soundtrack").toString();

	//fetchData('testdata/soundtracks.json', "json")
	fetchData(moviesSearchUrl, "json")
	.done(function(data){
	    if(data){
	    	var album, title, element;
			var albums = data.albums;

			soundtrackHTML = "<br/><span>" + data["info"]["num_results"] + " albums found.</span><br/><br/>";
			for(var i=0; i<albums.length; i++){
				album = albums[i];

				element = $("<div/>");
				element.addClass("disc");

				//element.data("albumID", album["href"].replace('spotify:album:',''));
				element.attr('data-albumID', album["href"].replace('spotify:album:',''));

				element.attr('title', album["name"]);//cuando haga hover
				
				//element.data("title", title);
				element.attr("data-title", title);

				var link = "<a href='#'><img src='img/album.jpg' alt='disc'></img></a>";
				element.html(link);

				//{"name": "Forrest Gump - The Soundtrack", "popularity": "0.51", "external-ids": [{"type": "upc", "id": "884977900507"}], "href": "spotify:album:3LP0jc2J6fvhpVTKWzvFUk", "artists": [{"href": "spotify:artist:4o6DE8hZbgTTInaDQDEQVa", "name": "Original Motion Picture Soundtrack"}]}
				soundtrackHTML += element.clone().wrap('<p>').parent().append("<br/>").html();
			}

			if(data["num_results"] == 0){
				soundtrackHTML = "";
			}

			$("#soundtrack").removeClass('hidden');//only show section if it has content

			buildReviews();
	    }
	    else{
	    }
	})
	.fail(function(x) {
		$("#errorBlock").removeClass("hidden");
		$("#errorBlock").html("Error retrieving movie soundtrack");
	});
}


function createListTracks(tracksArray){
	var element = "<ul>";
	for(var i=0; i<tracksArray.length;i++){
		element += "<li>" + tracksArray[i].artist + " - " + tracksArray[i].song + "</li>";
	}
	element += "</ul>";
	return element;
}



function buildReviews(){

	moviesSearchUrl = baseUrl + "/" + movieId + '/reviews.json?apikey=' + apiKey;
	
	//fetchData('testdata/reviews.json', "json")
	fetchData(moviesSearchUrl, "jsonp")
	.done(function(data){
	    if(data){
	        reviews = data;
			var total = 0;
			var html;

			var list = "<ul>";
			var reviewsList = reviews.reviews;
			for(var i=0; i<reviewsList.length; i++){
				if(reviewsList[i]["quote"]){
					total++;

					if(reviewsList[i]["links"]["review"]){
						//show link
						list += '<li><a href="' + reviewsList[i]["links"]["review"] + '" target="_blank">' + reviewsList[i]["quote"] + '</a>'
						+ ' (' + reviewsList[i]["critic"] + ', ' + reviewsList[i]["publication"] + ', ' + reviewsList[i]["date"] + ')' + '</li>';
					}
					else{
						list += '<li>' + reviewsList[i]["quote"]
						+ ' (' + reviewsList[i]["critic"] + ', ' + reviewsList[i]["publication"] + ', ' + reviewsList[i]["date"] + ')' + '</li>';
					}
					list += "<br/>";
				}			
			}
			list += "</ul>";

			html = "<br/><span>" + total + " reviews found.</span><br/><br/>";
			html += list;

			if(total == 0){
				html = "";
			}

			reviewsHTML = html;

			$("#reviews").removeClass('hidden');//only show section if it has content

			$("#ajaxLoader").addClass("hidden");
	    }
	    else{
	    }
	})
	.fail(function(x){
		$("#errorBlock").removeClass("hidden");
		$("#errorBlock").html("Error album's tracklist");
	});
}



function loadResults(results){
	var listElement;
	//hide the 'loading' animation
	$("#results").removeClass("hidden");
	$("#errorBlock").addClass("hidden");
	$("#ajaxLoader").addClass("hidden");

	if(results.movies.length > 0){
		//hide error block since results were found:
		$("#errorBlock").addClass("hidden");

		$.each(results.movies, function(index, movie) {

			listElement = $('<input type="radio" id="' + movie.id + '" name="found"' +'>');

			$("#results").append(listElement);
			$("#results").append('<label for="' + movie.id + '">' + movie.title + "</label><br/>");
		});
	}
	else{
		$("#errorBlock").html("No results were found");
		$("#title").parent().addClass("hidden");
		$("#errorBlock").removeClass("hidden");
	}
}


function searchMovie(title){

	var url;

	$("#ajaxLoader").removeClass("hidden");

	//do not read key if it's already been read
	if(apiKey){
		url = baseUrl + ".json?apiKey=" + apiKey + '&q=' + title;

		fetchData(url, "jsonp")
		.done(function(data){
			loadResults(data);
			//$("#results").show();
		})
		.fail(function(x){
			$("#errorBlock").removeClass("hidden");
			$("#errorBlock").html("Error reading from Rotten Tomatoes API");
		});
	}
	else{//first search, api key needs to be retrieved
		fetchData('key.json', "json")
		.done(function(data){
		    if(data){
		        apiKey = data["rotten"];
				if(apiKey){

					url = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apiKey=" + apiKey + '&q=' + title;

					fetchData(url, "jsonp")
					.done(function(data){
						loadResults(data);
					})
					.fail(function(x){
						$("#errorBlock").removeClass("hidden");
						$("#errorBlock").html("Error reading from Rotten Tomatoes API");
					});
				}
		    }
		    else{
				$("#errorBlock").removeClass("hidden");
				$("#errorBlock").html("Error reading API key");
		    }
		})
		.fail(function(x){
			$("#errorBlock").removeClass("hidden");
			$("#errorBlock").html("Error reading from API key");
		});
	}
}


