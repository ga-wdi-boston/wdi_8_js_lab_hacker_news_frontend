var HACKER = HACKER || {};

HACKER.Article = function(options) {
	this.id = options.id;
	this.title = options.title;
	this.url = options.url;
	this.user_email = options.user_email;
	this.created_at = options.created_at || new Date();
	this.score = options.score || 0;
	this.comments_count = options.comments_count || 0;
}


HACKER.Article.prototype.showInfo = function() {
	var article_container = $('<div class="article" id="article_' + this.id + '" data-score="' + this.score + '">'),
		article_title = $('<a class="title" href="' + this.url + '" alt="' + this.title + '">'),
		article_meta = $('<p class="meta">'),
		meta_content = this.score + " points by " + this.user_email + " about " + this.created_at + " ago | ",
		upvote = $('<a class="vote" id="up_' + this.id + '">'),
		downvote = $('<a class="vote" id="down_' + this.id + '">'),
		comments = $('<a class="comments">');


	article_title.text(this.title);
	downvote.text('Downvote');
	upvote.text('Upvote');
	article_meta.text(meta_content);


	article_meta.append(downvote, ' | ', upvote);
	article_container.append(article_title, article_meta);
	return article_container;
};
