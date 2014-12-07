$(document).ready(function(){

	//var reservoirDogsRT   = "14978";//Rotten Tomatoes ID
	//var reservoirDogsIMDB = "tt0105236";//IMDB ID
	var apiKey;
	var searchTerm, moviesSearchUrl;
	var movieId, info, cast, omdb;
	var infoHTML, castHTML, trailerHTML, reviewsHTML, twitterHTML, soundtrackHTML;
	//var buyHTML;

	var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0/movies/";	




	//http://stackoverflow.com/questions/14220321/how-to-return-the-response-from-an-ajax-call


	//function fetchData(url, dataType, result, callback){
	function fetchData(url, dataType){
		//encapsulate ajax call
		return $.ajax({
			url : url, 
			dataType : dataType,
		});		
	}


	//http://jsfiddle.net/RhnvU
	//$("#results input").on('change', function(){
	$("#results").on('change', function(){
	//$("*[type='radio']").on('change', function(){
		
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



	function buildInfo(){

		// construct the url with our API key
		moviesSearchUrl = baseUrl + movieId + '.json?apikey=' + apiKey;		

		//fetchData('info.json', "json")
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
		        alert("Error");
		    }
		})
		.fail(function(x) {
		    alert("fail in info");
		});		
	}



	function buildInfoHTML(info){

		var genres, directors, release, format, hours, minutes, html, runtime, li;

		html = $("<ul/>");

		if(info.abridged_directors){
			directors = "";
			$.each(info.abridged_directors, function(index, dir){
				directors += dir.name;
				if(index < info.abridged_directors.length-1)
					directors += ", ";
			});
			html.append("<li>Director(s): " + directors +".</li>");
		}

		//create empty <li> to add OMDB data later on
		li = $("<li/>");
		li.attr("id", "writer").addClass("hidden");
		html.append(li);

		html.append("<li>Year: " + info.year +"</li>");
		html.append("<li>MPAA rating: " + info.mpaa_rating +"</li>");
		
		//convert time:
		hours   = Math.floor(info.runtime/60);

		runtime = "<li>Runtime: " + info.runtime + " minutes";
		if(hours > 0){
			minutes = info.runtime % 60;
			
			runtime += " - " + hours + " hour(s)";

			if(minutes != 0){
				runtime += " and " + minutes + " min";
			}	
		}
		runtime += ".</li>";
    	
		html.append(runtime);

		genres = "";
		$.each(info.genres, function(index, genre){
			genres += genre;
			if(index < info.genres.length-1)
				genres += ", ";
		});
		html.append("<li>Genre(s): " + genres + ".</li>");

		release = "<li>Releases:<ul>";
		$.each(info.release_dates, function(key, val){
			format = key[0].toUpperCase() + key.slice(1);
			release += "<li>" + format + ": " + val + "</li>";
		});
		release += "</ul></li>";
		html.append(release);

		li = $("<li/>");
		li.attr("id", "awards").addClass("hidden");
		html.append(li);

		li = $("<li/>");
		li.attr("id", "synopsis").addClass("hidden");
		html.append(li);

		html.append("<li style='color:red;'>Ratings</li>");
		html.append("<li style='color:red;'>http://www.miramax.com/movie/reservoir-dogs</li>");
		//html.append('<li><img src="' + omdb.Poster +'"></li>');

		infoHTML = html;
		$("#content").html(infoHTML);
		$("#content").addClass("hidden");
	}



	function addOMDBdata(id){

		moviesSearchUrl = "http://www.omdbapi.com/?i=tt" + id;

		fetchData(moviesSearchUrl, "json")
		.done(function(data){
		    if(data){

				//console.log(data);

				$("#writer").html("Writer(s): " + data.Writer +".").removeClass("hidden");

				$("#awards").html("Awards: " + data.Awards +".").removeClass("hidden");

				$("#synopsis").html("Synopsis: " + data.Plot +".").removeClass("hidden");
		    }
		    else{
		        alert("Error");
		    }
		})
		.fail(function(x) {
		    alert("fail in omdb");
		});		
	}





	function buildCast(){

		moviesSearchUrl = baseUrl + movieId + '/cast.json?apikey=' + apiKey;

		//fetchData('cast.json, "json")
		fetchData(moviesSearchUrl, "jsonp")
		.done(function(data){
		    if(data){
		    	
		    	cast = data["cast"];
				var star;
				castHTML = $("<ul/>");
				for(var i=0; i<cast.length; i++){
					star = cast[i];
					if(star.characters.length){
						castHTML.append("<li>" + star.name + " as " + star.characters[0] + "</li>");
					}
				}

				$("#cast").removeClass('hidden');//only show section if it has content

				buildTrailer();		
		    }
		    else{
		        alert("Error");
		    }
		})
		.fail(function(x) {
		    alert("fail in cast");
		});





	}

	function buildTrailer(){

// http://apiblog.youtube.com/2009/05/youtube-apis-search-explained.html
// http://gdata.youtube.com/feeds/api/videos?q=antwone%20fisher&v=2&max-results=10

// http://www.codeproject.com/Articles/43403/YouTube-Dynamic-AJAX-JSON-Search-API-Demo

// https://github.com/youtube/api-samples/tree/master/javascript
// https://developers.google.com/youtube/v3/code_samples/javascript#search_by_keyword

//I believe this uses v2 which is deprecated. TO DO: get a dev.key and update to v3
		moviesSearchUrl = "http://gdata.youtube.com/feeds/videos?vq=" + encodeURIComponent(searchTerm+" trailer") + "&max-results=10&alt=json-in-script";

		console.log(moviesSearchUrl);

		fetchData('trailers.json', "json")
		//fetchData(moviesSearchUrl, "jsonp")//ajax call to the Rotten tomatoes api
		.done(function(data){
		    if(data){
		    	var trailers = data.feed;
		    	if(trailers){
		    		var entries = trailers.entry;
					
					trailerHTML = "";
					for(var i = 0; i < entries.length; i++){
						var entry = entries[i];

						//var title = entry.title.$t;
						//var link = entry.link[0].href;
						console.log(entry);
						
						var content = entry.content.$t;
						

						//var html = $("<div/>");

						// html.append('<iframe width="560" height="315" src="http://player.theplatform.com/p/DeuROC/dewwtrs_Q0n4/embed/select/tqJkKL2Q0aje?width=650&height=366#playerurl=http%3A//www.miramax.com/watch%3Fv%3Dlsd3RnZTpWq8IZtr575LVWVig2V0uXL6" frameborder="0" allowfullscreen></iframe>');

						trailerHTML += content;
					}

					$("#trailer").removeClass('hidden');//only show section if it has content

					buildReviews();
		    	}
				

		    }
		    else{
		        alert("Error");
		    }
		})
		.fail(function(x) {
		    alert("fail in trailers");
		});	



	}



	function buildReviews(){

		moviesSearchUrl = baseUrl + movieId + '/reviews.json?apikey=' + apiKey;
		
		//fetchData('reviews.json', "json")
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
						
						// $.each(reviewsList[i], function(key, val){

						if(reviewsList[i]["links"]["review"]){
							//show link
							list += '<li><a href="' + reviewsList[i]["links"]["review"] + '" target="_blank">' + reviewsList[i]["quote"] + '</a>'
							+ ' (' + reviewsList[i]["critic"] + ', ' + reviewsList[i]["publication"] + ', ' + reviewsList[i]["date"] + ')' + '</li>';
						}
						else{
							list += '<li>' + reviewsList[i]["quote"]
							+ ' (' + reviewsList[i]["critic"] + ', ' + reviewsList[i]["publication"] + ', ' + reviewsList[i]["date"] + ')' + '</li>';
						}

						
						// });
					}			
				}
				list += "</ul>";

				html = $("<span>" + total + " reviews found.</span><br/>");
				html.append(list);

				if(total == 0){
					html = "";
				}

				reviewsHTML = html;

				$("#reviews").removeClass('hidden');//only show section if it has content

				$("#ajaxLoader").addClass("hidden");
		    }
		    else{
		        alert("Error reading API key value");
		    }
		})
		.fail(function(x){
		    alert("fail in reviews");
		});
	}


	function buildTwitter(){

	}




	$("li").click(function(e){
		//e.preventDefault();

		$("#content").html("");//clear content
		$("#content").removeClass();

		switch(this.id){
			case "info":
				//info is a special case:
				if(infoHTML){
					$("#content").html(infoHTML);
					$("#content").removeClass("hidden");
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

			case "soundtrack"://http://brett.freemusicarchive.org:8000/api
				if(soundtrackHTML){
					$("#content").html(soundtrackHTML);
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


	function loadResults(results){
		var listElement;
		//hide the 'loading' animation
		$("#ajaxLoader").addClass("hidden");//comment, it's not showing at this point
		$("#results").removeClass("hidden");

		if(results.movies.length > 0){
			//hide error block since results were found:
			$("#errorBlock").addClass("hidden");

			$.each(results.movies, function(index, movie) {

				listElement = $('<input type="radio" id="' + movie.id + '" name="alipe"' +'>');

				$("#results").append(listElement);
				$("#results").append('<label for="' + movie.id + '">' + movie.title + "</label><br/>");
			});
		}
		else{
			$("#errorBlock").html("No results were found");
			$("#errorBlock").removeClass("hidden");
		}
	}



	function searchMovie(title){

		var url;

		$("#ajaxLoader").removeClass("hidden");

		//do not read key if it's already been read
		if(apiKey){
			url = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apiKey=" + apiKey + '&q=' + title;

			fetchData(url, "jsonp")
			.done(function(data){
				loadResults(data);
				$("#results").show();
			})
			.fail(function(x){
			    alert("Error reading key");
			});
		}
		else{//first search, key needs to be retrieved
			fetchData('key.json', "json")
			.done(function(data){
			    if(data){
			        apiKey = data["rotten"];
					if(apiKey){

						url = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apiKey=" + apiKey + '&q=' + title;

						fetchData(url, "jsonp")
						.done(function(data){
							loadResults(data);
							//$("#results").show(); ??
						})
						.fail(function(x){
						    alert("fail");
						});
					}
			    }
			    else{
			        alert("Error reading API key value");
			    }
			})
			.fail(function(x){
			    alert("fail");
			});
		}
	}

});//ready