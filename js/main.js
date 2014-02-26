$(document).ready(function() {
  // Put any document-ready code in here
  // Other code should go in separate files organized by namespace/class
  HaxorNews.init();
});


//  user jord@mail.com (#5)
// Keep an article list in memory and sort by score
// insert an article and update an article with vote


var HaxorNews = {};

HaxorNews.init = function() {
  $('#get_articles').click(HaxorNews.callArticles.bind(this));
};

HaxorNews.callArticles = function(){
  console.log('called!');
  $.ajax({
    type: 'GET',
    url: 'http://haxor-news-json.herokuapp.com/articles',
    dataType: 'JSON',
    data: { backdoor_user_id: 5 },
    success: function(response){
      console.log(response.articles);
      HaxorNews.renderArticles(response.articles);
    }
  });
};


HaxorNews.renderArticles = function(articles){
  var length = articles.length, i = 0;

  for (; i < length; ) {
    this.renderArticle(articles[i]);
    i = i + 1;
  }
};

HaxorNews.renderArticle = function(article){
  var htmlString,
    now = new Date(),
    createdAt = new Date(article.created_at),
    hoursAgo = Math.round( (now - createdAt) / 3600000 );

  htmlString = '<h3><a href="' + article.url + '">' + article.title + '</a></h3>';
  htmlString = htmlString + '<p>' + article.score + ' points by ' + article.user_email
    + ' about ' + hoursAgo + ' hours ago | '
    + '<a href="#" id="vote_up">Upvote</a> | '
    + '<a href="#" id="vote_up">Downvote</a> | '
    + '<a href="#" id="comments">' + article.comments_count + ' comments</a></p>';
  $article = $('<div class="article">').append(htmlString);

  $('#article_list').append($article);
};









