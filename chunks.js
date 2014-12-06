function buildTrailer(){
	var html = $("<div/>");
	//html.append('<iframe width="560" height="315" src="//www.youtube-nocookie.com/embed/bRgsz4bSAWo?rel=0" frameborder="0" allowfullscreen></iframe>');

	//html.append('<iframe class="player-iframe" allowfullscreen="" data-name="Reservoir Dogs - Official Trailer (HD)" src="http://player.theplatform.com/p/DeuROC/dewwtrs_Q0n4/embed/select/tqJkKL2Q0aje?width=650&height=366#playerurl=http%3A//www.miramax.com/watch%3Fv%3Dlsd3RnZTpWq8IZtr575LVWVig2V0uXL6"></iframe>');
	html.append('<iframe width="560" height="315" src="http://player.theplatform.com/p/DeuROC/dewwtrs_Q0n4/embed/select/tqJkKL2Q0aje?width=650&height=366#playerurl=http%3A//www.miramax.com/watch%3Fv%3Dlsd3RnZTpWq8IZtr575LVWVig2V0uXL6" frameborder="0" allowfullscreen></iframe>');

	//http://www.miramax.com/watch?v=lsd3RnZTpWq8IZtr575LVWVig2V0uXL6

	//<iframe id="lsd3RnZTpWq8IZtr575LVWVig2V0uXL6" class="player-iframe" allowfullscreen="" data-name="Reservoir Dogs - Official Trailer (HD)" src="http://player.theplatform.com/p/DeuROC/dewwtrs_Q0n4/embed/select/tqJkKL2Q0aje?width=650&height=366&autoPlay=true#playerurl=http%3A//www.miramax.com/watch%3Fv%3Dlsd3RnZTpWq8IZtr575LVWVig2V0uXL6">
	return html;
}


	function buildTrailer(){

// http://apiblog.youtube.com/2009/05/youtube-apis-search-explained.html
// http://gdata.youtube.com/feeds/api/videos?q=antwone%20fisher&v=2&max-results=10
// http://www.codeproject.com/Articles/43403/YouTube-Dynamic-AJAX-JSON-Search-API-Demo
// https://github.com/youtube/api-samples/tree/master/javascript
// https://developers.google.com/youtube/v3/code_samples/javascript#search_by_keyword


		var html = $("<div/>");

		html.append('<iframe width="560" height="315" src="http://player.theplatform.com/p/DeuROC/dewwtrs_Q0n4/embed/select/tqJkKL2Q0aje?width=650&height=366#playerurl=http%3A//www.miramax.com/watch%3Fv%3Dlsd3RnZTpWq8IZtr575LVWVig2V0uXL6" frameborder="0" allowfullscreen></iframe>');

		//return html;
		trailerHTML = html;

		$("#trailer").removeClass('hidden');//only show section if it has content

		buildReviews();
	}

	