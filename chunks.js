function buildTrailer(){
	var html = $("<div/>");
	//html.append('<iframe width="560" height="315" src="//www.youtube-nocookie.com/embed/bRgsz4bSAWo?rel=0" frameborder="0" allowfullscreen></iframe>');

	//html.append('<iframe class="player-iframe" allowfullscreen="" data-name="Reservoir Dogs - Official Trailer (HD)" src="http://player.theplatform.com/p/DeuROC/dewwtrs_Q0n4/embed/select/tqJkKL2Q0aje?width=650&height=366#playerurl=http%3A//www.miramax.com/watch%3Fv%3Dlsd3RnZTpWq8IZtr575LVWVig2V0uXL6"></iframe>');
	html.append('<iframe width="560" height="315" src="http://player.theplatform.com/p/DeuROC/dewwtrs_Q0n4/embed/select/tqJkKL2Q0aje?width=650&height=366#playerurl=http%3A//www.miramax.com/watch%3Fv%3Dlsd3RnZTpWq8IZtr575LVWVig2V0uXL6" frameborder="0" allowfullscreen></iframe>');

	//http://www.miramax.com/watch?v=lsd3RnZTpWq8IZtr575LVWVig2V0uXL6

	//<iframe id="lsd3RnZTpWq8IZtr575LVWVig2V0uXL6" class="player-iframe" allowfullscreen="" data-name="Reservoir Dogs - Official Trailer (HD)" src="http://player.theplatform.com/p/DeuROC/dewwtrs_Q0n4/embed/select/tqJkKL2Q0aje?width=650&height=366&autoPlay=true#playerurl=http%3A//www.miramax.com/watch%3Fv%3Dlsd3RnZTpWq8IZtr575LVWVig2V0uXL6">
	return html;
}


function sayHello(data){
	alert(data);
	//alert("Hiya!");
}