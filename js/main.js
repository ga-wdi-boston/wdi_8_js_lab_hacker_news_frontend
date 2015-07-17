$(document).ready(function() {

	// Load the articles from the server
	Namespace.doEverything();

 	// Make the reload button reload the articles list
	$('#reload').click(Namespace.doEverything);

	// Make a form to submit a new article
	$('#new-article').submit(Namespace.newArticle);

}); // End (document).ready

Namespace = {};

Namespace.doEverything = function(){
	$.ajax({
	  type: 'GET',
	  url: 'http://haxor-news-json.herokuapp.com/articles',
	  dataType: 'json',
	  data: { backdoor_user_id: 9 }
	})
	.done(function(response){
	  //console.log(response);
	  var a = response;
	  var articles = a.articles;
	  var buildHTML = "";

    // Build the HTML for each article
    for(var i = 0; i < articles.length; i++){
    	buildHTML += '<li id=article_' + articles[i].id + '>' + articles[i].title;
      buildHTML += '<div><a href="' + articles[i].url + '"> ' + articles[i].url + ' </a>';
      buildHTML += '<div> submitted by: ' + articles[i].user_email + '</div>';
      buildHTML += '<div>'
      buildHTML += 'score: ' + articles[i].score + ' | comments: ' + articles[i].comments_count + ' | ';
     	buildHTML += '<span id="upvote"><a href="">upvote</a> </span> | <span id="downvote"><a href="">downvote</a></span>';
      buildHTML += '</div>'
      buildHTML += '</li>'
      console.log(i);
    };

    // Sort by vote count and place each builtHTML into an array
    for(var j = 0; j < articles.length; j++){
    }

    // Display articles in the article list by vote count in descending order
    $('#articles-list').append(buildHTML);

	}); // end ajax request
} // end doEveryting


Namespace.newArticle = function(event){

	var $form = $(event.target),
	$title = $form.find("input[id='title']").val(),
	$url = $form.find("input[id='url']").val(),
	action = $form.attr('action');

	event.preventDefault();

	$.ajax({
	  type: 'POST',
	  url: 'http://haxor-news-json.herokuapp.com/articles',
	  dataType: 'json',
	  data: { article: { title: $title, url: $url }, backdoor_user_id: 9 }
	}).done(function(response){
	  console.log(response);
	  response.article.id
	}).fail(function(response){
		console.log(response);
	});

	$('#articles-list').empty();
	$('#title').empty();
	$('#url').empty();
	Namespace.doEverything();
	// debugger

} // end newArticle

