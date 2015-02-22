$(document).ready(function() {
  AJAXer.getArticles();
  $("#reload-all").click(AJAXer.getArticles);
  $("#submit-article").click(AJAXer.newArticle);
});
