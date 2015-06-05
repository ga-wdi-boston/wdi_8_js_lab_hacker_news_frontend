var HACKER = {};
HACKER.article_list = [];
$(document).ready(function() {
  // Get all the articles
  HACKER.getArticles();

  $('#reload').click(function(event) {
  	event.preventDefault();
  	HACKER.getArticles();
  });

  $('#new_article_form').submit(function(event) {
  	event.preventDefault();
  	var title = $('#new_title'),
  		url = $('#new_url');
  	HACKER.createArticle(title.val(), url.val());
  	title.text("");
  	url.text("");
  	return false;
  });

});



HACKER.getArticles = function() {
	$.ajax({
		url: 'http://haxor-news-json.herokuapp.com/articles',
		type: 'GET',
		dataType: 'json',
		data: {backdoor_user_id: 15},
	})
	.done(function(data) {
		console.log("success");
		var articles = data.articles;
		HACKER.renderArticles(articles);
		$('.vote').click(function(event) {
			event.preventDefault();
			var button = event.target;
			HACKER.voteHandler(button);
		});
		return articles;
	});
};

HACKER.createArticle = function(title, url) {
	$.ajax({
		url: 'http://haxor-news-json.herokuapp.com/articles',
		type: 'POST',
		dataType: 'json',
		data: { article: {title: title, url: url}, backdoor_user_id: 15 }
	})
	.done(function(data) {
		console.log("success");
		var article = data.article,
			new_article = new HACKER.Article({
				id: article.id,
				title: article.title,
				url: article.url,
				user_email: article.user_email,
				created_at: article.created_at,
				score: article.score,
				comments_count: article.comments_count
			});

		$('#content').append(new_article.showInfo());
		//HACKER.getArticles(articles);
		$('.vote').click(function(event) {
			event.preventDefault();
			var button = event.target;
			HACKER.voteHandler(button);
		});
	})
	.fail(function(response) {
		var errors = JSON.parse(response.responseText).errors;
		HACKER.handleErrors(errors)
	});
}

HACKER.updateArticle = function(article, direction) {
	$.ajax({
		url: 'http://haxor-news-json.herokuapp.com/articles/' + article.id + '/vote',
		type: 'PATCH',
		dataType: 'json',
		data: {backdoor_user_id: 15, direction: direction},
	})
	.done(function(data) {
		console.log("success");
		var score = data.vote.votable_score,
			this_article = article;
		HACKER.updateArticlesArray(this_article, score);
		$('.vote').click(function(event) {
			event.preventDefault();
			var button = event.target;
			HACKER.voteHandler(button);
		});
	});
}

HACKER.handleErrors = function(errors) {
	if (errors.title && errors.url) {
		var first_error = $('<p class="red">'),
			second_error = $('<p class="red">');
		first_error.append("Title " + errors.title[0]);
		second_error.append("URL " + errors.url[0] + ".\n<span class='small'>Use template http://google.com</span>");
		$('#new_article').append(first_error, second_error);
	} else if (errors.url) {
		var error = $('<p class="red">');
		error.text("URL " + errors.url.join(', ') + ".\nUse template http://google.com");
		$('#new_article').append(error);
	} else {
		var error = $('<p class="red">');
		error.text("Title " + errors.title.join(', '));
		$('#new_article').append(error);
	}
};

HACKER.voteHandler = function(button) {
	var vote_id_array = button.id.split('_'),
		vote_type = vote_id_array[0],
		article_id = parseInt(vote_id_array[1]),
		articles = HACKER.article_list;

	for (i = 0, l = articles.length; i < l; i++) {
		var article = articles[i];
		if (article.id === article_id) {
			HACKER.updateArticle(article, vote_type);
		}
	}
};

HACKER.updateArticlesArray = function(article, score) {
	var articles = HACKER.article_list;
	for (i = 0, l = articles.length; i < l; i++) {
		if (articles[i].id === article.id) {
			articles[i].score = score;
			HACKER.buildArticles(HACKER.article_list);
		}
	}
};


