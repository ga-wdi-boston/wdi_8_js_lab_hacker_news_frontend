var HACKER = HACKER || {};

HACKER.renderArticles = function(articles) {
	var i = 0,
		l = articles.length,
		new_article;

	for(; i < l; i++) {
		var article_info = articles[i],
			new_article = new HACKER.Article({
				id: article_info.id,
				title: article_info.title,
				url: article_info.url,
				user_email: article_info.user_email,
				created_at: article_info.created_at,
				score: article_info.score,
				comments_count: article_info.comments_count
			});

		HACKER.article_list.push(new_article);
	}

	HACKER.article_list.sort(function(a,b) {
		if (a.score > b.score) {
			return -1;
		} else if (b.score > a.score) {
			return 1;
		} else {
			return 0;
		}
	});
	HACKER.buildArticles(HACKER.article_list);
	//content.append(article.showInfo());
}

HACKER.buildArticles = function(article_list) {
	article_list.sort(function(a,b) {
		if (a.score > b.score) {
			return -1;
		} else if (b.score > a.score) {
			return 1;
		} else {
			return 0;
		}
	});
	var i = 0,
		l = article_list.length,
		content = $('#content');
		content.empty();
	for (; i < l; i++) {
		content.append(article_list[i].showInfo());
	}
}


