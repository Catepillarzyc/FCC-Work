$(window).ready(function() {
  $('#search').on('submit', function(event) {
    $('#results-container').hide("fast");
    initSearch($('#search-input').val());
    return false;
  });
  $('.fa').on('click',function(event){
  	initSearch($('#search-input').val());
    return false;
});
});

function initSearch(terms) {
  $.ajax({
  	url:'https://en.wikipedia.org/w/api.php',
  	data: {
  		format: 'json',
  		action: 'query',
  		list: 'search',
  		srsearch: terms,
  	},
  	dataType:'jsonp',
  	success: function(x){
  		console.log(x);
  		displayResults(x.query.search);
  	}
  });
}

function displayResults(items) {
  var html = "";
  items.forEach(function(item) {
    html += wikiListItem(item.title, item.snippet);
  });
  $('#results-container').html(html);
  $('#results-container').show("slow");
  $('#app-container').css('top', "1%");
}

function wikiListItem(title, snippet) {
  var url = "https://en.wikipedia.org/wiki/" + title.split(' ').join('_');

  return (
    "<a href='" + url + "' target='_none'>" +
      "<div class='result'>" +
      "<h6 class='r-header'>" + title + "</h6>" +
      "<h6>" + snippet + "</h6>" +
      "</div>" +
      "</a>"
  );
}