/**
 * @Author  <mailto:smyrick@aidep.com>Shane Myrick</mailto>
 */

/**
 * Generate localized text for hotel cluster
 * @param  {number} itemSize  The size of the cluster, passed by a ListItem Model
 * @return {string}           Returns localizes text '{0} hotel(s)'
 */
Handlebars.registerHelper('localizedClusterSize', function(itemSize) {
  if (itemSize === 1) {
    return getLocalizedString('hotel-finder.hotels-in-cluster.single');
  }

  return getLocalizedString('hotel-finder.hotels-in-cluster.multiple').replace('{0}', itemSize);

});

/**
 * Get localized text in Handlebars template
 * @param  {string} key The JSON key for a string value stored in in the
 *                      <div id="localizedText" ...> element
 * @return {string}     Returns localized text for the given key
 */
Handlebars.registerHelper('i18n', function(key) {

  if (typeof key !== 'string') {
    throw 'Key must be of type (string)';
  }

  return getLocalizedString(key);
});

/**
 * Returns the localized date seperator. Since the localized text is not in the HTML json attribute,
 * we must get it from the header in the date picker seperator.
 * @return {string} Localized text for date seperator
 */
Handlebars.registerHelper('dateSeparator', function() {
  return $('#lbl_startDateSeparator').text();
});


/**
 * Method to call internal helper in Semantha.js from HBS template
 * @param  {string} itemImage Image url passed from the ListItem Model
 * @param  {number} itemId    Hotel id passed from the ListItem Model
 * @return {string}           Returns HTML string
 */
Handlebars.registerHelper('handleImage', function(itemImage, itemId) {
  // TODO: Move function code into here
  return handleImage(itemImage, itemId);
});


/**
 * Method to call internal helper in Semantha.js from HBS template
 * @param  {string} itemImage Image url passed from the ListItem Model
 * @param  {number} itemId    Hotel id passed from the ListItem Model
 * @return {string}           Returns HTML string
 */
Handlebars.registerHelper('handlePaneImage', function(imageUrl) {
    if(imageUrl != null) {
        return imageUrl.replace(/t.jpg$/,"b.jpg");
    }
});

/**
 * Method to create the choose date string for dateless searches
 */
Handlebars.registerHelper('chooseDateStringPane', function() {
 var chooseDatesAnchor = '<a href="#" onclick="chooseDate()">' +
  getLocalizedString('hotel-finder.brief-content.choose-dates.anchor') + '</a>';
 var chooseDates = getLocalizedString('hotel-finder.brief-content.choose-dates').replace('{0}', chooseDatesAnchor);
 var priceStr = '<p class="hotelPriceNote">' + chooseDates + '</p>';

  return priceStr;
});

/**
 * Method to create the choose date string for sold out searches
 */
Handlebars.registerHelper('hotelSoldOutStringPane', function() {
    var differentDatesAnchor = '<a href="#" onclick="chooseDate()">' + getLocalizedString('hotel-finder.brief-content.sold-out.anchor.different-dates') + '</a>';

    var guestCountAnchor = '<a href="#" onclick="chooseGuest()">' + getLocalizedString('hotel-finder.brief-content.sold-out.anchor.guest-count') + '</a>';

    var soldOut = getLocalizedString('hotel-finder.brief-content.sold-out').replace('{0}', differentDatesAnchor).replace('{1}', guestCountAnchor);

  return soldOut;
});

/**
 * Method to call internal helper in Semantha.js from HBS template
 * @param  {string} itemStarRating Star rating from the ListItem Model
 * @return {string}                Return formated string to be used in class names
 */
Handlebars.registerHelper('formatStarRating', function(itemStarRating) {
  return formatStarRating(itemStarRating);
});

/**
 *
 */
Handlebars.registerHelper('reviewStarRatingClass', function(itemReview) {
  var rating = Math.round(itemReview.rating * 2) * 5;

  return "stars" + rating;
});

/**
 *
 */
Handlebars.registerHelper('formatReviewCount', function(reviewCount) {
  if (reviewCount === 1) {
    return getLocalizedString('hotel-finder.list-item.reviews.single');
  }

  return getLocalizedString('hotel-finder.list-item.reviews.multiple').replace('{0}', reviewCount);
});

Handlebars.registerHelper('formatReasonToBelieve', function(reasonToBelieve, aidepId) {
  if(reasonToBelieve.length != 0) {
    var reasonToBelieveList = '',
        sentiment = '';

    if (nlpAmenityIds == null) {
      nlpAmenityIds = [];
    }

		for(var n=0;n<nlpAmenityIds.length;n++){

      var id = nlpAmenityIds[n],
			    tag = id.toLowerCase(),
			    displayTag = createFriendlyAttributeTextFromId(id),
			    content = getLocalizedString('hotel-details.no-reasontobelieve');

			content = '<li>' + content.replace('{0}',displayTag) + '</li>';
			if(reasonToBelieve[tag] != undefined){
				//determine the sentiment to display
				if (reasonToBelieve[tag].termSentimentScore <= 0.35){
					sentiment = 'harsh';
				}
				else if (reasonToBelieve[tag].termSentimentScore > 0.35 && reasonToBelieve[tag].termSentimentScore <= 0.5){
					sentiment = 'mediocre';
				}
				else if (reasonToBelieve[tag].termSentimentScore > 0.5 && reasonToBelieve[tag].termSentimentScore <= 0.65){
					sentiment = 'decent';
				}
				else if (reasonToBelieve[tag].termSentimentScore > 0.65 && reasonToBelieve[tag].termSentimentScore <= 0.8){
					sentiment = 'positive';
				}
				else{
					sentiment = 'terrific';
				}
				sentiment = '<span class="bold">' + sentiment + '</span>';
				displayTag = '<span class="bold">' + displayTag + '</span>';
				content = getLocalizedString('hotel-details.reasontobelieve');
				content = content.replace('{0}',sentiment);
				content = '<li>' + content.replace('{1}',displayTag) + '</li>';
			}
			reasonToBelieveList += content;
		}
        return reasonToBelieveList;

    }
});
/**
 *
 */
Handlebars.registerHelper('addReviewSummaries', function(summaries){
    var reviewSummariesToBeShownInPane = 5;

    var snippetList = '<li class=\"reason-to-believe-heading\">'+getLocalizedString('hotel-details.reviews-heading')+'</li>';
    var lengthOfList = reviewSummariesToBeShownInPane < summaries.length ? reviewSummariesToBeShownInPane : summaries.length ;
    for(var i = 0; i < lengthOfList; i++) {
        snippetList += "<li class=\"details-pane-review-summary\"><h4 class=\"pane-review-summary-marker\"><p id=\"original_reviewId_"+summaries[i].originalReview.id+"\">\" "+summaries[i].content+" \"</p></h4></li>";
    }
    return snippetList;
});

/**
 *
 */
Handlebars.registerHelper('addDetailsPaneReasonToBelieve', function(reasonToBelieve){
  if(reasonToBelieve.length != 0) {
    var reasonToBelieveList = '',
        sentiment = '';

    if (nlpAmenityIds == null) {
      nlpAmenityIds = [];
    }

		for(var n=0;n<nlpAmenityIds.length;n++){

      var id = nlpAmenityIds[n],
          tag = id.toLowerCase(),
          displayTag = createFriendlyAttributeTextFromId(id),
          content = '<li class=\"reason-to-believe-heading\">'+getLocalizedString('hotel-details.no-reasontobelieve')+'</li>';

			content = content.replace('{0}',displayTag);
			if(reasonToBelieve[tag] != undefined){
				//determine the sentiment to display
				if (reasonToBelieve[tag].termSentimentScore <= 0.35){
					sentiment = 'harsh';
				}
				else if (reasonToBelieve[tag].termSentimentScore > 0.35 && reasonToBelieve[tag].termSentimentScore <= 0.5){
					sentiment = 'mediocre';
				}
				else if (reasonToBelieve[tag].termSentimentScore > 0.5 && reasonToBelieve[tag].termSentimentScore <= 0.65){
					sentiment = 'decent';
				}
				else if (reasonToBelieve[tag].termSentimentScore > 0.65 && reasonToBelieve[tag].termSentimentScore <= 0.8){
					sentiment = 'positive';
				}
				else{
					sentiment = 'terrific';
				}
				sentiment = '<span class="bold">' + sentiment + '</span>';
				displayTag = '<span class="bold">' + displayTag + '</span>';
				content = '<li class=\"reason-to-believe-heading\">'+getLocalizedString('hotel-details.reasontobelieve')+'</li>';
				content = content.replace('{0}',sentiment);
				content = content.replace('{1}',displayTag);
				for(var i = 0;i<reasonToBelieve[tag].reviewSnippets.length;i++){
				content += "<li snippetID=\""+reasonToBelieve[tag].reviewSnippets[i].id+"\" sentiment=\""+reasonToBelieve[tag].termSentimentScore+"\" class=\"details-pane-reason-to-believe-item\">"+
										"<h4 class=\"pane-review-summary-marker\"><span style=\"display:inline-block;width:75%;\">\" "+reasonToBelieve[tag].reviewSnippets[i].content+" \"</span></h4>"+
											"</li>";
				}
			}
			reasonToBelieveList += content;
		}
        return reasonToBelieveList;

    }
});

/**
 *
 * @return
 */
Handlebars.registerHelper('formatReviewRating', function(rating) {
    return rating.toFixed(1);
});

/**
 * Checks the date picker boxes to see if a date is selected
 * @return {boolean} Returns true if a TO and FROM date is selected
 */
Handlebars.registerHelper('isDatelessSearch', function(options) {

  var dpFrom = $("#ip_dpfrom").val();
  var dpTo = $("#ip_dpto").val();

  if(dpFrom.indexOf('/') === -1 && dpTo.indexOf('/') === -1) {
      return options.fn(this);
  }
  else {
    return options.inverse(this);
  }

});
