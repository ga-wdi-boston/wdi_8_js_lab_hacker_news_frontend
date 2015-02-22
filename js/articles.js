var AJAXer = {};

AJAXer.Article = function(responseObj) {
  this.commentsCount = responseObj.comments_count
  this.createdAt     = responseObj.created_at || new Date();
  this.currentVote   = responseObj.current_vote;
  this.id            = responseObj.id;
  this.score         = responseObj.score;
  this.title         = responseObj.title;
  this.url           = responseObj.url;
  this.userEmail     = responseObj.user_email;
}

AJAXer.allArticles = [];

AJAXer.findById = function(id) {
  var foundArticle;
  AJAXer.allArticles.some(function(article, index, array){
    if (article.id === id) {
      foundArticle = article;
      return true;
    }
  });
  return foundArticle;
}

AJAXer.getArticles = function() {
  $.ajax({
    url: 'http://haxor-news-json.herokuapp.com/articles',
    type: 'GET',
    dataType: 'json',
    data: {backdoor_user_id: 2},
  })
  .done(function(response) {
    var currArticle;
    AJAXer.allArticles = [];
    $.each(response.articles, function(index, article) {
      currArticle = new AJAXer.Article(article);
      AJAXer.allArticles.push(currArticle);
    });
    AJAXer.renderAll();
  })
  .fail(function(response) {
    AJAXer.reportError(response);
  })
  .always(function() {
    console.log("complete");
  });
}

AJAXer.actionLinks = function() {
  var articleId = parseInt($(this).attr("data-id"));

  // only do this if the method isn't GET (just redirect to comments if it is)
  if ($(this).attr("data-method") !== "GET") {
    event.preventDefault();
    $.ajax({
      url: $(this).attr("href"),
      type: $(this).attr("data-method"),
      dataType: "json",
      data: {backdoor_user_id: 2}
    })
    .done(function(response) {
      var toBeUpdated = AJAXer.findById(articleId),
          currentVote = toBeUpdated.currentVote,
          amtToChange;

      toBeUpdated.score = response.vote.votable_score;
      toBeUpdated.currentVote = response.vote.direction;

      AJAXer.renderAll();

      //toBeUpdated.insertSelf();

    })
    .fail(function(response) {
      AJAXer.reportError(response);
    });
    return false;
  }
}

AJAXer.newArticle = function() {
  var $title = $("#new-title"),
      $url   = $("#new-url"),
      $form  = $("#new-article");

  event.preventDefault();

  $.ajax({
    url: $form.attr("action"),
    type: $form.attr("method"),
    dataType: 'json',
    data: {backdoor_user_id: 2, article: {title: $title.val(), url: $url.val()}},
  })
  .done(function(response) {
    var newArticle = new AJAXer.Article(response.article)
    AJAXer.allArticles.push(newArticle);
    $title.val("");
    $url.val("");
    AJAXer.renderAll();
  })
  .fail(function(response) {
    AJAXer.reportError(response);
  })
  .always(function() {
    console.log("complete");
  });
  return false;
}

AJAXer.reportError = function(response) {
  var errors   = response.responseJSON.errors,
      $errorDiv = $("#errors");
      $errorDiv.empty();
  $.each(errors, function(key, value) {
    $.each(value, function(index, error) {
      $errorDiv.append($("<h3>" + key + " error: " + error + "</h3>"));
    });
  });
}

AJAXer.renderAll = function() {
  var $articlesList = $("#articles-list");

  AJAXer.allArticles.sort(function(a, b) {
      if (a.score > b.score) {
        return -1;
      } else if (a.score < b.score) {
        return 1;
      } else {
        return 0;
      }
  });

  $articlesList.empty();

  $.each(this.allArticles, function(index, article) {
    $articlesList.append($("<li/>").append(article.renderSelf()));
  });

  //$(".article-links").click(AJAXer.actionLinks);
}

AJAXer.article.prototype = {
  renderSelf: function() {
    var $articleNode, $titleNode, $detailsNode;
    $articleNode = $("<div/>", {"class": "article", id: "article_" + this.id,
                                "data-score": this.score });
    $titleNode   = $("<h3><a href='" + this.url + "'rel=nofollow>" + this.title + "</a></h3>");

    $detailsNode = $("<p/>",
      {html: this.score + " point by " + this.userEmail + " at " +
             this.createdAt});
    $detailsNode.append($(this.createLinks(" Upvote", "PATCH", "vote?direction=up")));
    $detailsNode.append($(this.createLinks(" Downvote ", "PATCH", "vote?direction=down")));
    $detailsNode.append($(this.createLinks(this.commentsCount + " comments", "GET", "comments")));

    return $articleNode.append($titleNode).append($detailsNode);
  },

  createLinks: function(text, method, urlend) {
    var $linkNode,
        method = method || "patch",
        href;

    $linkNode = $("<a/>", {
      "data-method": method,
      "data-id": this.id,
      rel: "nofollow",
      href: "http://haxor-news-json.herokuapp.com/articles/" + this.id +
            "/" + urlend,
      html: text,
      "class": "article-links"
    });
    $linkNode.click(AJAXer.actionLinks);
    return $linkNode;
  },
//insertSelf is not working
  // insertSelf: function() {
  //   var $articlesLiItems = $("#articles-list").find("li"),
  //       getScore = function(index) {
  //         return parseInt($articlesLiItems.eq(index).find(".article").attr("data-score"));
  //       }

  //   for (var i = 0; i < $articlesLiItems.length - 1; i++) {
  //     var articleLiScore = getScore(i);
  //         nextScore      = getScore(i+1);
  //     if (articleLiScore >= this.score && this.score >= nextScore) {
  //       $articlesLiItems.eq(i).after(this.renderSelf());
  //       break;
  //     }
  //   }
  // }
};
