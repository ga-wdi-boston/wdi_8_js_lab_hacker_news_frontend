var HaxorNews = {
  rootUrl: 'http://haxor-news-json.herokuapp.com/'
};

HaxorNews.init = function() {
  $('#get_articles').click(HaxorNews.callArticles.bind(this));
  $('#article_list').click(HaxorNews.showComment); // needs to be router
};

HaxorNews.callArticles = function(){
  console.log('called!');
  $.ajax({
    type: 'GET',
    url: HaxorNews.rootUrl + 'articles',
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
  console.log(article);
  var htmlString,
    now = new Date(),
    createdAt = new Date(article.created_at),
    hoursAgo = Math.round( (now - createdAt) / 3600000 );

  htmlString = '<h3><a href="' + article.url + '">' + article.title + '</a></h3>';
  htmlString = htmlString + '<p>' + article.score + ' points by ' + article.user_email
    + ' about ' + hoursAgo + ' hours ago | '
    + '<a href="' + HaxorNews.rootUrl + 'articles/3/vote?direction=up" id="vote_up">Upvote</a> | '
    + '<a href="' + HaxorNews.rootUrl + 'articles/3/vote?direction=down" id="vote_up">Downvote</a> | '
    + '<a href="' + HaxorNews.rootUrl + 'articles/3/comments" id="comments">' + article.comments_count + ' comments</a></p>';
  $article = $('<div class="article">').append(htmlString).append($('<div class="comment_list">'));

  $('#article_list').append($article);
};

HaxorNews.showComment = function(event){
  var $commentList = $(event.target).parent().parent().find('.comment_list');
  event.preventDefault();
  $.ajax({
    type: 'GET',
    url: $(event.target).attr('href'),
    dataType: 'JSON',
    data: { backdoor_user_id: 5 },
    success: function(response){
      console.log(response.comments)
      HaxorNews.renderComments(response.comments, $commentList);
    }
  });
};

HaxorNews.renderComments = function(comments, $list) {
  var length = comments.length,
    i = 0,
    formString = '<form accept-charset="UTF-8" action="' + HaxorNews.rootUrl + '/articles/3/comments" class="new_comment" id="new_comment" method="post">' +
          '<div style="margin:0;padding:0;display:inline">' +
            '<input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="vJ9r+rQWBV/Ceyq3kSX9ncHcRhUJoldb3Xl1aJ/g+Xs=" />' +
          '</div>' +
        '<textarea id="comment_body" name="comment[body]" placeholder="Enter comment..."></textarea>' +
        '<input name="commit" type="submit" value="Add Comment" />' +
      '</form>';
    $list.append(formString);

  for (; i < length; ) {
    $list.append(this.renderComment(comments[i]));
    i = i + 1;
  }
};

HaxorNews.renderComment = function(comment) {
  var htmlString,
    now = new Date(),
    createdAt = new Date(comment.created_at),
    hoursAgo = Math.round( (now - createdAt) / 3600000 );

  htmlString = '';
  htmlString = htmlString + '<p>' + comment.score + ' points by ' + comment.user_email
    + ' about ' + hoursAgo + ' hours ago | '
    + '<a href="' + HaxorNews.rootUrl + 'comments/3/vote?direction=up" id="vote_up">Upvote</a> | '
    + '<a href="' + HaxorNews.rootUrl + 'comments/3/vote?direction=down" id="vote_up">Downvote</a></p>';
  htmlString = htmlString + '<p>' + comment.body + '</p>';
  $comment = $('<div class="comment">').append($('<hr>')).append(htmlString);
  return $comment;
};







