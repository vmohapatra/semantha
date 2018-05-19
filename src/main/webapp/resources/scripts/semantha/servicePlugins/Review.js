/**
 * Copyright 2013 aidep, Inc. All rights reserved.
 * aidep PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 * @Author  <mailto:vmohapatra@aidep.com>Vijayalaxmi Mohapatra</mailto>
 */
'use strict';

//Declaring the review namespace
(function( review, $, undefined ) {
  //Initialize the Object to store reviews
  var reviews = {},
      reviewServicePrefix = '/semantha/ReviewService?';

  /*
   * Private Methods
   */

  /**
   * Returns the author's first name if it's not empty, 'NULL', or 'Unknown'
   * Default to 'A verified traveler' in English
   *
   * @param firstName
   * @returns {string} returns the firstName or the default string
   */
  var getAuthorFirstName = function (firstName) {
    var name = getLocalizedString('hotel-details.traveler-reviews.author.default-name');
    if (!_.isEmpty(firstName) && firstName !== 'NULL' && firstName !== 'Unknown') {
      name = firstName;
    }
    return name;
  };

  /**
   * Returns the author's location string with a preceding space if it's not empty, 'NULL', or 'Unknown'
   * Default empty string
   * @example ' from Seattle, WA'
   * @param {String} location - Location string to add
   * @returns {string} - in the format : ' from {location}', localized if possible, or default string
   */
  var getAuthorLocationDescription = function (location) {
    var locationString = '';
    if (!_.isEmpty(location) && location !== 'NULL' && location !== 'Unknown') {
      locationString = ' ' + getLocalizedString('hotel-details.traveler-reviews.author.location-description')
                  .replace('{0}', location);
    }
    return locationString;
  };

  /**
   * Get sentiment statment from score, from low to high options are:
   *   ['harsh', 'mediocre', 'decent', 'positive', 'terrific']
   *
   * @param {Number} score
   * @returns {string}
   */
  var getSentimentString = function (score) {

    if (score <= 0.35){
      return getLocalizedString('hotel-details.traveler-reviews.sentiment.very-low');
    }
    else if (score > 0.35 && score <= 0.5){
      return getLocalizedString('hotel-details.traveler-reviews.sentiment.low');
    }
    else if (score > 0.5 && score <= 0.65){
      return getLocalizedString('hotel-details.traveler-reviews.sentiment.neutral');
    }
    else if (score > 0.65 && score <= 0.8){
      return getLocalizedString('hotel-details.traveler-reviews.sentiment.high');
    }
    else { // > 0.8
      return getLocalizedString('hotel-details.traveler-reviews.sentiment.very-high');
    }
  };

  /**
   * Get a similar statement text with count
   *
   * @param {Number} statementCount
   * @returns {string}
   */
  var getSimilarStatementMeasure = function (statementCount) {
    var text = '';
    if (statementCount !== undefined && statementCount > 0) {
      if (statementCount > 1) {
        var template = getLocalizedString('hotel-details.traveler-reviews.similar-statement.multiple');
        text = template.replace('{0}', statementCount);
      }
      else {
        text = getLocalizedString('hotel-details.traveler-reviews.similar-statement.single')
      }
    }
    return text;
  };

  /*
   * Public Review API
   */
  review.addReviewsToCollection = function (collection){
    var idsList = collection.pluck('itemaidepId').join() || [];

    if (_.isEmpty(idsList)) {
      return;
    }
    
    var url = reviewServicePrefix + 'api=reviewscores&id=' + idsList;
    $.getJSON(url, function(data) {
      if (!_.isEmpty(data)){
        for (var i =0; i< data.length; i++) {
          var hotelId = Number(data[i].hotelId),
              item = collection.findWhere({'itemaidepId': hotelId});

          if (!_.isEmpty(item)) {
            item.set({itemReview: data[i].reviewScore});  
          }
        }   
      }   
    });

    if(!_.isEmpty(nlpAmenityIds)) {
      var tags = '&tags=' + nlpAmenityIds.join().toLowerCase(),
          reasonToBelieveUrl = reviewServicePrefix + 'api=reasontobelieve&id='+ idsList + tags;
  
      $.getJSON(reasonToBelieveUrl, function(data) {
        if(!_.isEmpty(data)){
          for(var i =0; i< data.length; i++) {
            var hotelId = Number(data[i].hotelId),
                item = collection.findWhere({'itemaidepId': hotelId});

            if(!_.isEmpty(item)) {
              item.set({itemReasonToBelieve: data[i].reasonToBelieve}); 
            }
          }   
        }   
      }); 
    }
  };
      
  review.reviewSummary = function() {
    var eid = $('#div_eHotelId').text(),
        host = $('#div_reviewSummaryHost').text(),
        tags = $('#div_reviewTags').text().toLowerCase();

    if (_.isEmpty(host)) {
      return;
    }

    if (_.isEmpty(eid) || eid === -1) {
      $('#div_noReviewsContainer').show();
      $('#div_reviewsContainer').hide();
      return;
    }   

    review.getReviewData(eid, tags);
  };

  review.getReviewData = function(eid, tags) {
    //  /semantha/ReviewService?api=[reviewxxx]&id=123
    var reviewSummariesUrl = reviewServicePrefix +'api=reviewsummaries&id='+ eid;
    var reviewHistogramUrl = reviewServicePrefix +'api=reviewhistogram&id='+ eid;
    var reviewScoreUrl = reviewServicePrefix +'api=reviewscores&id='+ eid;
    
    $.getJSON(reviewHistogramUrl,function(data) {
      review.processReviewHistogram(data);
    });
    $.getJSON(reviewSummariesUrl,function(data) {
      review.processReviewSummaries(data);
    });   
    $.getJSON(reviewScoreUrl,function(data) {
      review.processReviewScore(data);
    }); 
    
    if(!_.isEmpty(tags)) {
      
      var reasonToBelieveUrl = reviewServicePrefix + 'api=reasontobelieve&id='+ eid + '&tags=' + tags;
      $.getJSON(reasonToBelieveUrl,function(data) {
        review.processReasonToBelieve(data[0].reasonToBelieve, tags);
      }); 
    } 
  };
  
  review.processReasonToBelieve = function(data, tags) {
    var tagArray = tags.split(','),
        reasonToBelieveList = '',
        sentiment = '';


    for (var n = 0; n < tagArray.length; n++) {
      var tag = tagArray[n];

      if (_.isEmpty(tag)) {
        break;
      }

      var tempData = data[tag],
          contentTemp = '<li class=\"reason-to-believe-heading-details\">'+
                        getLocalizedString('hotel-details.no-reasontobelieve').replace('{0}', tag) +
                        '</li>';

      if (tempData !== undefined) {

        sentiment = '<span class="bold">' + getSentimentString(tempData.termSentimentScore) + '</span>';
        tag = '<span class="bold">' + createFriendlyAttributeTextFromId(tag) + '</span>';
        
        contentTemp = '<li class=\"reason-to-believe-heading-details\">'+ getLocalizedString('hotel-details.reasontobelieve') + '</li>';
        contentTemp = contentTemp.replace('{0}', sentiment);
        contentTemp = contentTemp.replace('{1}', tag);

        for(var i = 0; i < tempData.reviewSnippets.length; i++){    
          var snippetContent = '<li class="detailsReasonToBelieve" snippetID="$#4" sentiment="$#5"><h3><span>$#1</span></h3><p><span class="reviewerName">$#2</span><span class="reviewerLocation">$#3</span></p></li>',
              reviewSnippet = tempData.reviewSnippets[i],
              reviewContent = reviewSnippet.content,
              author = reviewSnippet.author;

          snippetContent = snippetContent.replace('$#1', reviewContent);
          snippetContent = snippetContent.replace('$#2', getAuthorFirstName(author.firstName));
          snippetContent = snippetContent.replace('$#3', getAuthorLocationDescription(author.location));
          snippetContent = snippetContent.replace('$#4', reviewSnippet.id );
          snippetContent = snippetContent.replace('$#5', tempData.termSentimentScore);

          contentTemp += snippetContent;
        }
      }
      reasonToBelieveList += contentTemp;   
    }

    $('#ul_firstCollection').prepend(reasonToBelieveList);
    
  };
    
  review.processReviewSummaries = function(data) {
    if (_.isEmpty(data)) {
      return;     
    }

    var summaries = data[0].summaries,
        contentTemp = '<li class="detailsReviewStatement"><h3><a id="$#0">$#1</a></h3><p><span class="reviewerName">$#2</span><span class="reviewerLocation">$#3</span><span class="similarStatements">$#4</span></p></li>';
    
    $('.reviewSummary').show();

    if(summaries.length > 3) {
      $('#lnk_showMoreSummaries').show();
    }   
        
    for (var i in summaries) {
      var content = summaries[i],
          contentText = contentTemp,
          brief = '',
          author = content.author;
      
      if (!_.isEmpty(content.content)) {
        brief = content.content;
      }

      contentText = contentText.replace('$#1', brief);
      contentText = contentText.replace('$#2', getAuthorFirstName(author.firstName));
      contentText = contentText.replace('$#3', getAuthorLocationDescription(author.location));
      
      var measure = getSimilarStatementMeasure(content.supportMeasure);
      if (_.isEmpty(measure)) {
        $(this).css('border','none');
      }
      contentText = contentText.replace('$#4', measure);
      
      if (!_.isEmpty(content.originalReview)) {
        contentText = contentText.replace('$#0', content.originalReview.id);
        content.originalReview.dateSubmitted = content.dateSubmitted;
        reviews[content.originalReview.id] = content.originalReview;
      }
      
      //Addition of content to the review Summaries
      if (i < 3) {
        $('.moreSummaries').before(contentText);
      }
      else {
        $('#ul_secondCollection').append(contentText);
      }     
    }
  };
  
  review.processReviewHistogram = function(data) {
    // Default behaviour
    $('#div_noReviewsContainer').show();
    $('#div_reviewsContainer').hide();

    // If we have review data, process it
    if (!_.isEmpty(data)) {
      $('#div_noReviewsContainer').hide();
      $('#div_reviewsContainer').show();
    
      var  largestCount = 0;
      data.forEach(function (rateData) {
        largestCount = rateData.count > largestCount ? rateData.count : largestCount; 
      });
      
      var rateTemplate = $('#div_rateTemplate').html();
      data.forEach(function (rateData) {
        var rateContent = rateTemplate.replace(/\$1/g,rateData.rating),
            ratePercentage = rateData.percentage,
            rateBarWidth = 150*rateData.count/largestCount;

        rateContent = rateContent.replace('desc="$2"', 'style="width:' + rateBarWidth + 'px"');
        rateContent = rateContent.replace('desc="$3"', 'style="left:' + (rateBarWidth + 6) + 'px"');
        rateContent = rateContent.replace('$4', ratePercentage!=0? (ratePercentage+ '%'):'');
        $('#ul_ratingCharts').append(rateContent);
      });
    }
  };
  
  review.processReviewScore = function(data) {
    if (_.isEmpty(data)) {
      return;     
    }
    
    var reviewScore = data[0].reviewScore;
    var totalCount = reviewScore.count;
    var rating = reviewScore.rating.toFixed(1);
    var scoreStars = Math.round(rating*2) * 5;
    $('#spn_score').text(rating);
    $('#spn_scoreStars').addClass('stars'+scoreStars);
    $('#spn_reviewsCount').text(totalCount);
      
  };
  
  review.processHover = function(reviewId, reviewBrief) {
    var hoverContent = '<div class="reviewStarsDate"><span class="guestRating guestRating-lg"><span class="value stars$#1"></span></span><span class="reviewDate">$#2</span></div><p class="reviewText">"$#3<span class="matchingText">$#4</span>$#5"</p>';

    hoverContent = hoverContent.replace('$#4',reviewBrief);
    var reviewContent = reviews[reviewId];
    if(!_.isEmpty(reviewContent)) {
      var reviewDetail = reviewContent.content;
      if(!_.isEmpty(reviewDetail)) {
        var idx = reviewDetail.indexOf(reviewBrief),
            preSentence = reviewDetail.substring(0,idx),
            postSentence = reviewDetail.substring(idx + reviewBrief.length),
            prefix = ' ';

        if (!_.isEmpty(preSentence)) {
          var preArray = preSentence.split(' '),
              preLimit = Math.min(30, preArray.length);

          for(var i=0;i<preLimit; i++){
            prefix = preArray[preArray.length-i-1]  + ' ' + prefix;
          }
          if(preArray.length>30){
            prefix = '...' + prefix;
          }
        }
        var postfix = '';
        hoverContent = hoverContent.replace('$#3',prefix);
        if(!_.isEmpty(postSentence)) {
          var postArray = postSentence.split(' '),
              postLimit = Math.min(30, postArray.length); 
          
          for(var x=0; x < postLimit; x++) {
            postfix = postfix + ' ' + postArray[x] ;
          }
          if(postArray.length > 30){
            postfix +='...';
          }       
        }
        hoverContent = hoverContent.replace('$#5',postfix);
      }
      
      var rating = 0;
      if (!_.isEmpty(reviewContent.rating)) {   
        rating = reviewContent.rating*10;
      }
      hoverContent = hoverContent.replace('$#1',rating);
      
      var reviewDate = '';
      if (!_.isEmpty(reviewContent.dateSubmitted)) {
        reviewDate = new Date(reviewContent.dateSubmitted).format('d mmm, yyyy');
      }
      hoverContent = hoverContent.replace('$#2',reviewDate);
      $('#tiptip_review').html(hoverContent);
    }   
  };
  
  review.addReviewsToDetailsPane = function (collection){        
    var item = collection.at(0),
        eid = item.get('currentHotelaidepId'),
        reviewSummariesUrl = reviewServicePrefix +'api=reviewsummaries&id='+ eid,
        reviewScoresUrl = reviewServicePrefix +'api=reviewscores&id='+ eid;
            
    //If aidep hotelid is -1 just render the itemVIew with null Review related objects
    if (_.isEmpty(eid) || eid === -1) {
      App.detailsPaneView.render();
      return;
    }
        
    if (eid === 'missing-hotel' && !_.isEmpty(item)) {
      item.set({currentHotelaidepId: "-1"});
      return;
    }
        
    $.getJSON(reviewScoresUrl, function (data) {
      if(!_.isEmpty(data) && !_.isEmpty(item)) {  
        item.set({currentHotelReviewScores: data[0]});  
      }   
    });
        
    if (!_.isEmpty(nlpAmenityIds)) {
      var tags = '&tags=';
      for (var n=0;n<nlpAmenityIds.length;n++){
        tags += nlpAmenityIds[n].toLowerCase()+',';
      }

      var reasonToBelieveUrl = reviewServicePrefix + 'api=reasontobelieve&id='+ eid + tags;
    
      $.getJSON(reasonToBelieveUrl, function(data) {
        if(!_.isEmpty(data) && !_.isEmpty(item)){    
          item.set({currentHotelReviewReasonToBelieve: data[0].reasonToBelieve}); 
        }   
      }); 
    } 

        
    $.getJSON(reviewSummariesUrl, function(data) {
      if(!_.isEmpty(data) && !_.isEmpty(item)){    
        item.set({currentHotelReviewSummaries: data[0]}); 
      }   
    }); 
  };
  
}( window.review = window.review || {}, jQuery));
