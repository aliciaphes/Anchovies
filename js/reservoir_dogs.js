$(document).ready(function(){

	//var reservoirDogsRT   = "14978";//Rotten Tomatoes ID
	//var reservoirDogsIMDB = "tt0105236";//IMDB ID
	var apiKey;
	var searchTerm, moviesSearchUrl;
	var movieId, info, cast, omdb;
	var infoHTML, castHTML, trailerHTML, reviewsHTML, twitterHTML;
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
		
		movieId = $("#results input:radio:checked").attr('id');

		//retrieve API key
		if(movieId){
			$("#ajaxLoader").show();
			$("#results").hide();
			loadData(movieId);
		}
	});


	function loadData(movieId){//ajax call to the Rotten tomatoes api

		//retrieve all the information
		if(apiKey){
	
			/**				

			//read more information from OMDb API
			$.ajax({
				//url : moviesSearchUrl,
				url : 'omdb.json', 
				dataType : "json",
				async: false,				
				success : function(data){
					omdb = data;
				},
				error: function(){
					alert("error");
				}
			});

*/


			//buildSections();
			buildInfo();




		}
		else{
			alert("Error reading API key value");
		}
	}


/**
	function buildSections(){
		//infoHTML    = buildInfo();
		// castHTML    = buildCast();
		// trailerHTML = buildTrailer();
		// reviewsHTML = buildReviews();
		// twitterHTML = buildTwitter();
		// //buyHTML     = buildBuy();
	}
*/


	function buildInfo(){
		var genres, directors, release, format, hours, minutes, html, runtime;

		// construct the url with our API key
		moviesSearchUrl = baseUrl + movieId + '.json?apikey=' + apiKey;		

		//fetchData('info.json', "json")
		fetchData(moviesSearchUrl, "jsonp")
		.done(function(data){
		    if(data){
		    	$("#info").removeClass('hidden');

		    	info = data;

				html = $("<ul/>");

				directors = "";
				$.each(info.abridged_directors, function(index, dir){
					directors += dir.name;
					if(index < info.abridged_directors.length-1)
						directors += ", ";
				});
				html.append("<li>Director(s): " + directors +".</li>");
				//html.append("<li>Writer(s): " + omdb.Writer +".</li>");

				html.append("<li>Year: " + info.year +"</li>");
				html.append("<li>MPAA rating: " + info.mpaa_rating +"</li>");
				
				//convert time:
				hours   = Math.floor(info.runtime/60);          
		    	minutes = info.runtime % 60;
		    	
		    	runtime = "<li>Runtime: " + info.runtime +" minutes - " + hours + " hour(s)";
		    	if(minutes != 0){
		    		runtime += " " + minutes + " min.";
		    	}
		    	runtime += "</li>";
		    	
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

				//html.append("<li>Awards: " + omdb.Awards +"</li>");
				//html.append("<li>Synopsis: " + omdb.Plot +"</li>");
				html.append("<li style='color:red;'>Ratings</li>");
				html.append("<li style='color:red;'>http://www.miramax.com/movie/reservoir-dogs</li>");
				//html.append('<li><img src="' + omdb.Poster +'"></li>');

				infoHTML = html;

				buildCast();
		    }
		    else{
		        alert("Error");
		    }
		})
		.fail(function(x) {
		    alert("fail");
		});		
	}

	function buildCast(){

		moviesSearchUrl = baseUrl + movieId + '/cast.json?apikey=' + apiKey;

		//fetchData('cast.json, "json")
		fetchData(moviesSearchUrl, "jsonp")
		.done(function(data){
		    if(data){
		    	$("#cast").removeClass('hidden');
		    	cast = data["cast"];
				var star;
				var html = $("<ul/>");
				for(var i=0; i<cast.length; i++){
					star = cast[i];
					if(star.characters.length){
						html.append("<li>" + star.name + " as " + star.characters[0] + "</li>");
					}
				}
				castHTML = html;

				buildTrailer();

				buildReviews();
		    }
		    else{
		        alert("Error");
		    }
		})
		.fail(function(x) {
		    alert("fail");
		});





	}

	function buildTrailer(){

// http://apiblog.youtube.com/2009/05/youtube-apis-search-explained.html
// http://gdata.youtube.com/feeds/api/videos?q=antwone%20fisher&v=2&max-results=10
// http://www.codeproject.com/Articles/43403/YouTube-Dynamic-AJAX-JSON-Search-API-Demo
// https://github.com/youtube/api-samples/tree/master/javascript
// https://developers.google.com/youtube/v3/code_samples/javascript#search_by_keyword


		$("#trailer").removeClass('hidden');

		var html = $("<div/>");

		html.append('<iframe width="560" height="315" src="http://player.theplatform.com/p/DeuROC/dewwtrs_Q0n4/embed/select/tqJkKL2Q0aje?width=650&height=366#playerurl=http%3A//www.miramax.com/watch%3Fv%3Dlsd3RnZTpWq8IZtr575LVWVig2V0uXL6" frameborder="0" allowfullscreen></iframe>');

		//return html;
		trailerHTML = html;
	}



	function buildReviews(){

		$("#reviews").removeClass('hidden');

			moviesSearchUrl = baseUrl + movieId + '/reviews.json?apikey=' + apiKey;
			
			//fetchData('reviews.json', "json")
			fetchData(moviesSearchUrl, "jsonp")
			.done(function(data){
			    if(data){
			    	$("#reviews").removeClass('hidden');

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
								list += '<li><a href="' + reviewsList[i]["links"]["review"] + '">' + reviewsList[i]["quote"] + '</a>'
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

					reviewsHTML = html;

					$("#ajaxLoader").hide();
			    }
			    else{
			        alert("Error reading API key value");
			    }
			})
			.fail(function(x){
			    alert("fail");
			});
	}


	function buildTwitter(){

	}




	$("li").click(function(e){
		//e.preventDefault();

		$("#content").html("");//clear content

		switch(this.id){
			case "info":
				$("#content").html(infoHTML);
				break;

			case "cast":
				$("#content").html(castHTML);
				break;

			case "trailer":
				$("#content").html(trailerHTML);
				break;

			case "reviews":
				$("#content").html(reviewsHTML);
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

		var toSearch = $("#searchTerm").val();//read what's on the input field

		if(toSearch.length >= 3){
			if(toSearch != searchTerm){
				//update searchTerm:
				searchTerm = toSearch;

				//show the 'loading' animation
				$("#ajaxLoader").removeClass('hidden');//$("#ajaxLoader").show();

				//http://imdb.wemakesites.net
				//http://imdbapi.poromenos.org
				//https://code.google.com/p/moviepilot-api/w/list

				$("#results").html("");
				searchMovie(encodeURIComponent(searchTerm));
			}
		}
		else{alert("at least 3chars");}

	});

	function searchMovie(title){

		var url;

		//do not read key if it's already been read
		if(apiKey){
			url = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apiKey=" + apiKey + '&q=' + title;

			fetchData(url, "jsonp")
			.done(function(data){
				//hide the 'loading' animation
				$("#ajaxLoader").hide();
				$("#results").removeClass("hidden");
				
				$.each(data.movies, function(index, movie) {

						var listElement = $('<input type="radio" id="' + movie.id + '" name="alipe"' +'>');

						$("#results").append(listElement);
						$("#results").append('<label for="' + movie.id + '">' + movie.title + "</label><br/>");
				});

			})
			.fail(function(x){
			    alert("fail");
			});
		}
		else{//first search, key needs to be retrieved
			fetchData('key.json', "json")
			.done(function(data){
			    if(data){
			        apiKey = data["rotten"];
					if(apiKey){

						url = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apiKey=" + apiKey + '&q=' + title;

						$.ajax({
							url : url,
							async: false,
							dataType: "jsonp",
							success: function(data){

								//hide the 'loading' animation
								$("#ajaxLoader").hide();
								
								$.each(data.movies, function(index, movie) {

										var listElement = $('<input type="radio" id="' + movie.id + '" name="alipe"' +'>');
										//listElement.addClass("ali");

										$("#results").append(listElement);
										$("#results").append('<label for="' + movie.id + '">' + movie.title + "</label><br/>");
								});
							},
							error: function(result){
				            	alert("Error");
				        	}			
						});//end ajax call
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