var HaxorNews = {
  rootUrl: 'http://haxor-news-json.herokuapp.com/'
};

HaxorNews.init = function() {
  $('#get_articles').click(HaxorNews.callArticles);
  $('#get_articles').trigger('click');
  $('#article_list').click(HaxorNews.showComment); // needs to be router
  $('#submit-show').click(HaxorNews.submitShow);
  $('#new_article').submit(HaxorNews.addArticle);
};

HaxorNews.callArticles = function(){

  $('p.notice, p.alert').html('');

  $.ajax({
    type: 'GET',
    url: HaxorNews.rootUrl + 'articles',
    dataType: 'JSON',
    data: { backdoor_user_id: 5 },
    success: function(response){
      HaxorNews.articles = response.articles;
      HaxorNews.renderArticles(response.articles);
    }
  });
};


HaxorNews.renderArticles = function(articles){
  var length = articles.length, i = 0,
    $list = $('#article_list');

  $list.empty();

  for (; i < length; ) {
    $list.append(this.renderArticle(articles[i]));
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
    + '<a href="' + HaxorNews.rootUrl + 'articles/' + article.id + '/vote?direction=up" id="vote_up">Upvote</a> | '
    + '<a href="' + HaxorNews.rootUrl + 'articles/' + article.id + '/vote?direction=down" id="vote_down">Downvote</a> | '
    + '<a href="' + HaxorNews.rootUrl + 'articles/'+ article.id +'/comments" id="comments">' + article.comments_count + ' comments</a></p>';
  $article = $('<div class="article">').append(htmlString).append($('<div class="comment_list">'));

  return $article;
};

HaxorNews.submitShow = function(event) {
  event.preventDefault();
  $('#submit-container').toggle();
}

HaxorNews.addArticle = function(event) {
  var $form = $(this),
    $title = $form.find('input[name="article[title]"]'),
    $url = $form.find('input[name="article[url]"]');

  event.preventDefault();
  $('p.notice, p.alert').html('');

  $.ajax({
    type: 'POST',
    url: HaxorNews.rootUrl + $form.attr('action'),
    dataType: 'json',
    data: { backdoor_user_id: 5, article: { title: $title.val(), url: $url.val() } }
  }).done(function(response){
    console.log(response);
    $title.val('');
    $url.val('');
    $('p.notice').html('Article saved!');
    HaxorNews.articles.push(response.article);
    HaxorNews.articles.sort(HaxorNews.compare);
    HaxorNews.renderArticles(HaxorNews.articles);
  }).fail(function(response){
    console.log(response.responseJSON.errors)
    $('p.alert').html(HaxorNews.printError(response.responseJSON.errors));
  });
};

HaxorNews.voteUpArticle = function(event) {
  var index = $(event.target).parent().parent().index(),
    article;
  event.preventDefault();

  $('p.notice, p.alert').html('');

  $.ajax({
    type: 'PATCH',
    url: $(event.target).attr('href'),
    dataType: 'json',
    data: { backdoor_user_id: 5, direction: 'up' }
  }).done(function(response){
    article = HaxorNews.articles[index];
    if ( article.score === response.vote.votable_score ) {
      $('p.alert').html('Already voted up!');
      return false;
    } else {
      $('p.notice').html('Article voted up!');
    }
    article.score = response.vote.votable_score;
    HaxorNews.articles.sort(HaxorNews.compare);
    HaxorNews.renderArticles(HaxorNews.articles);
  }).fail(function(response){
    $('p.alert').html(HaxorNews.printError(response.responseJSON.errors));
  });

  return false;
};

HaxorNews.voteDownArticle = function(event) {
  var index = $(event.target).parent().parent().index(),
    article;
  event.preventDefault();

  $('p.notice, p.alert').html('');

  $.ajax({
    type: 'PATCH',
    url: $(event.target).attr('href'),
    dataType: 'json',
    data: { backdoor_user_id: 5, direction: 'down' }
  }).done(function(response){
    article = HaxorNews.articles[index];
    if ( article.score === response.vote.votable_score ) {
      $('p.alert').html('Already voted down!');
      return false;
    } else {
      $('p.notice').html('Article voted down!');
    }
    article.score = response.vote.votable_score;
    HaxorNews.articles.sort(HaxorNews.compare);
    HaxorNews.renderArticles(HaxorNews.articles);
  }).fail(function(response){
    $('p.alert').html(HaxorNews.printError(response.responseJSON.errors));
  });

  return false;
};

// For sorting the articles
HaxorNews.compare = function (a, b) {
  if (a.score > b.score )
     return -1;
  if (a.score < b.score )
     return 1;
  // a must be equal to b
  return 0;
}

HaxorNews.printError = function(errors) {
  var error = '',
    errorTypes = Object.keys(errors),
    length = errorTypes.length,
    i = 0,
    type;

  for (; i < length; ) {
    type = errorTypes[i];
    error = error + type + ' ' + errors[type] + '; ';
    i = i + 1;
  }

  return error;
}




// Comments

HaxorNews.showComment = function(event){
  var $commentList = $(event.target).parent().parent().find('.comment_list');
  event.preventDefault();

  if (event.target.id === 'vote_up') {
    HaxorNews.voteUpArticle(event);
    return false;
  } else if (event.target.id === 'vote_down') {
    HaxorNews.voteDownArticle(event);
    return false;
  }
  $.ajax({
    type: 'GET',
    url: $(event.target).attr('href'),
    dataType: 'JSON',
    data: { backdoor_user_id: 5 },
    success: function(response){
      HaxorNews.renderComments(response.comments, $commentList);
    }
  });

  return false;
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
    $list.empty();
    $list.append('<button>Hide</button>').click(HaxorNews.removeComments);
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
    + '<a href="' + HaxorNews.rootUrl + 'comments/'+ comment.id + '/vote?direction=up" id="vote_up">Upvote</a> | '
    + '<a href="' + HaxorNews.rootUrl + 'comments/'+ comment.id + '/vote?direction=down" id="vote_up">Downvote</a></p>';
  htmlString = htmlString + '<p>' + comment.body + '</p>';
  $comment = $('<div class="comment">').append($('<hr>')).append(htmlString);
  return $comment;
};

HaxorNews.removeComments = function(event) {
  event.preventDefault();
  $(event.target).parent().empty();

  return false;
}







