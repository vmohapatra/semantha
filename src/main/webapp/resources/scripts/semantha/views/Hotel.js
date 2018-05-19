/**
 * @Author  <mailto:vmohapatra@expedia.com>Vijayalaxmi Mohapatra</mailto>
 */
	/* Model */

	/* View */
	/**
	 * The hotel view
	 */
	 var HotelView = Backbone.View.extend({
		/**
		 * Attaches `this.el` to an existing element
		 */
		 el: $('body'), 
		/**
		 * Automatically called upon instantiation
		 * You make all types of bindings, excluding UI events, such as clicks, etc
		 */
		 initialize: function() {
			 document.title = $('#hdr_hotelName').text() + " | Semantha";
			// every function that uses 'this' as the current object should be in here
			_.bindAll(this, 'render', 'initGallery', 'toggleRoomDesc', 
					'hideRoomDesc', 'showMoreSummaries', 'mouseOverReview', 
					'mouseOutReview', 'setDatePickerStyle', 'changeDate', 'sendReasonToBelieveFeedback', 
					'changeRoom', 'bookRoom', 'getKeyValue', 'seeReviews', 'chooseDatePrompt');
			this.render();
		 },
		/**
		 * DOM events are bound to View methods. 
		 * Backbone doesn't have a separate controller to handle such bindings 
		 * It all happens in a View.
		 */
		 events: {
			 'click #lnk_roomName' : 'toggleRoomDesc',
			 'click .hideRoomDesc' : 'hideRoomDesc',
			 'click #lnk_showMoreSummaries' : 'showMoreSummaries',
			 'mouseover .reviewSummary ul li h3 a' : 'mouseOverReview',
			 'mouseout .reviewSummary ul li h3 a' : 'mouseOutReview',
			 'click #lnk_changeDate, #lnk_changeDatePriceLow, #lnk_availChangeDate, #changeDatePriceHigh ' : 'changeDate',
			 'click #lnk_changeRoom, #lnk_availChangeRoom' : 'changeRoom',
			 'click .bookButton' : 'bookRoom',
			 'click #lnk_reviews' : 'seeReviews',
			 'click #spn_reviewThumbup, #spn_reviewThumbdown' : 'sendReasonToBelieveFeedback'
		 },
		/**
		 * Function in charge of rendering the entire view in this.el. 
		 * Needs to be manually called by the user.
		 */
		 render: function() {
			// We only want these styles applied when javascript is enabled
			$('div.navigation').css({'width' : '170px', 'float' : 'left'});
			$('div.content').css('display', 'block');
			
			this.initGallery();
			this.setDatePickerStyle();
			this.chooseDatePrompt();
			review.reviewSummary();
		 },
		/**
		 * Custom function to initialize all gallery related functions
		 */
		 initGallery : function() {
				// Initially set opacity on thumbs and add
				// additional styling for hover effect on thumbs
				var onMouseOutOpacity = 0.67;
				$('#thumbs ul.thumbs li').opacityrollover({
					mouseOutOpacity:   onMouseOutOpacity,
					mouseOverOpacity:  1.0,
					fadeSpeed:         'fast',
					exemptionSelector: '.selected'
				});

				// Initialize Advanced Galleriffic Gallery
				var gallery = $('#thumbs').galleriffic({
					delay:                     1000,
					numThumbs:                 12,
					preloadAhead:              10,
					enableTopPager:            true,
					enableBottomPager:         true,
					maxPagesToShow:            7,
					imageContainerSel:         '#slideshow',
					controlsContainerSel:      '#controls',
					captionContainerSel:       '#caption',
					loadingContainerSel:       '#loading',
					renderSSControls:          true,
					renderNavControls:         true,
					playLinkText:              '',
					pauseLinkText:             '',
					prevLinkText:              '',
					nextLinkText:              '',
					nextPageLinkText:          '',
					prevPageLinkText:          '',
					enableHistory:             false,
					autoStart:                 false,
					syncTransitions:           true,
					defaultTransitionDuration: 200,
					onSlideChange:             function(prevIndex, nextIndex) {
						// 'this' refers to the gallery, which is an extension of $('#thumbs')
						if(this.find('ul.thumbs li.noPhoto').length>0) {
							$('#slideshow').html(getLocalizedString('hotel-details.no_photos_available')).addClass('noPhotoTxt');
						}
						else {
							this.find('ul.thumbs').children()
							.eq(prevIndex).fadeTo('fast', onMouseOutOpacity).end()
							.eq(nextIndex).fadeTo('fast', 1.0);
						}
					},
					onPageTransitionOut: function(callback) {
						this.fadeTo('fast', 0.0, callback);
					},
					onPageTransitionIn: function() {
						this.fadeTo('fast', 1.0);
					}
				});			 
		 },
		/**
		 * Custom function to toggle the room description
		 */
		 toggleRoomDesc : function(e) {
			 	var listNode = $(e.target).parent().parent().parent();
				var roomDesc = listNode.siblings('.roomDesc');
				var roomLink = $(e.target).parent().find('.triangle');
				if(roomDesc.css('display') == 'none') {
					roomDesc.show();
					roomLink.removeClass('forwardTriangle').addClass('downTriangle');
				}
				else {
					roomDesc.hide();
					roomLink.removeClass('downTriangle').addClass('forwardTriangle');
				}
				return false;			 
		 },
		/**
		 * Custom function to hide room description on click
		 */
		 hideRoomDesc : function(e) {
				$(e.target).parent().hide().siblings(".roomName").find(".triangle").removeClass("downTriangle").addClass("forwardTriangle");
				return false;
		 },
		 /**
		 * Custom function to send capture request on reasonToBelieve feedback
		 */
		 sendReasonToBelieveFeedback : function(e) {
				var vote = '';
				if($(e.target).hasClass("thumbup")){
					vote = 'up';
				}
				else{
					vote = 'down';
				}
				var elem = $(".detailsReasonToBelieve");
				var eventInfo = new Object();
				eventInfo["UV.EventType"] = 'ReasonToBelieveVote';//This needs to be event dependent
				eventInfo["UV.EventTrigger"] = 'ReasonToBelieveVoteClick';//this needs to be dynamic as per the event
				eventInfo["UV.Vote"] = vote;
				eventInfo["UV.SentimentScore"] = elem.attr("sentiment");
				eventInfo["UV.SnippetContent"] = elem.attr("content");
				eventInfo["UV.SnippetID"] = elem.attr("snippetID");
				eventInfo["UV.Term"] = $(".reasonToBelieveTerm").text();
				var docUrl = document.location.href;
				var urlQuery = docUrl.substring(docUrl.indexOf('?')+1);
				eventInfo["UV.BrowserGUID"] = this.getKeyValue(urlQuery, "browserGUID");
				eventInfo["UV.SearchQueryId"] = this.getKeyValue(urlQuery, "searchQueryId");;

				 //Send capture request
				 capture.sendCaptureRequest(
						 eventInfo
						 ,"ReasonToBelieveVoteClick"
						 ,true
				 );	
		 },
		/**
		 * Custom function to show more summaries on click of link
		 */
		 showMoreSummaries : function(e) {
				var moreSummariesLi = $(e.target).parent().children('ul').find('li.moreSummaries');
				if(moreSummariesLi.css('display') == 'none') {
					moreSummariesLi.slideDown("500");
					$("#lnk_showMoreSummaries").html("Show less");
					var eventInfo = new Object();
					eventInfo["UV.EventType"] = 'ShowMoreSummaries';//This needs to be event dependent
					eventInfo["UV.EventTrigger"] = 'ShowMoreSummariesClick';//this needs to be dynamic as per the event
					eventInfo["UV.ReviewScore"] = $('#spn_score').text();
					eventInfo["UV.TotalReviews"] = $('#spn_reviewsCount').text();
					var docUrl = document.location.href;
					var urlQuery = docUrl.substring(docUrl.indexOf('?')+1);
					eventInfo["UV.BrowserGUID"] = this.getKeyValue(urlQuery, "browserGUID");
					eventInfo["UV.SearchQueryId"] = this.getKeyValue(urlQuery, "searchQueryId");;

					 //Send capture request
					 capture.sendCaptureRequest(
							 eventInfo
							 ,"ShowMoreSummariesClick"
							 ,true
					 );	
				}
				else {
					moreSummariesLi.slideUp("500");
					$("#lnk_showMoreSummaries").html("Show more");	 
				}
				return false;
		 },
		/**
		 * Custom function to implement mouseover on review
		 */
		 mouseOverReview : function(e) {
				var tipTop =  $(e.target).parent().position()['top'] + 36;
				$("#tiptip_review").css("top",tipTop).show();
				review.processHover($(e.target).attr('id'),$(e.target).text());			 
		 },
		/**
		 * Custom function to implement mouseout on review
		 */
		 mouseOutReview : function(e) {
			 	$("#tiptip_review").hide();	
		 },
		/**
		 * Custom Function to set date picker style
		 */
		 setDatePickerStyle : function() {
				var dpFrom = "${arrivalDate}";
				var dpTo = "${departureDate}";
				if(dpFrom != "" && dpTo != ""){
					$("#ip_dpfrom").datepicker("setDate",dpFrom);
					$("#ip_dpto").datepicker("setDate",dpTo);
				}
		 },
		/**
		 * Utility function to change date
		 */
		 changeDate : function() {
				var t = setTimeout(function(){
					$('#ip_dpfrom').focus();
					clearTimeout(t);
					 },100);
		 },
		/**
		 * Utility function to change room
		 */
		 changeRoom : function() {
				var t = setTimeout(function(){
					  $('#div_roomSelect').click();
					  clearTimeout(t);
					 },100);
		 },
		/**
		 * Custom function to collect capture data for book room button
		 */
		 bookRoom : function(e) {
			 	e.preventDefault();
				var btnUrl = $(e.currentTarget).attr('href');
				var query = $(e.currentTarget).attr('href').substring(btnUrl.indexOf('?')+1);
				var eventInfo = new Object();
				eventInfo["UV.EventType"] = 'ProceedToCheckOut';//This needs to be event dependent
				eventInfo["UV.EventTrigger"] = 'BookButtonClick';//this needs to be dynamic as per the event
				eventInfo["UV.RoomTypeCode"] = this.getKeyValue(query,'roomTypeCode');
				eventInfo["UV.RoomRateCode"] = this.getKeyValue(query,'rateCode');
				eventInfo["UV.RoomRate"] = this.getKeyValue(query,'roomRate');
				var docUrl = document.location.href;
				var urlQuery = docUrl.substring(docUrl.indexOf('?')+1);
				eventInfo["UV.BrowserGUID"] = this.getKeyValue(urlQuery, "browserGUID");
				eventInfo["UV.SearchQueryId"] = this.getKeyValue(urlQuery, "searchQueryId");;

				 //Send capture request
				 capture.sendCaptureRequest(
						 eventInfo
						 ,"BookButtonClick"
						 ,true
						 ,function() {window.location.href=btnUrl;}//Go to the roomBooking url
				 );				 
		 },
		/**
		 * Utility function to get a param value from a url like string
		 */
		 getKeyValue : function(query,param) {
			    var queryParams = query.split('&');
			    for (var i = 0; i < queryParams.length; i++)
			    {
			
			        var parameterName = queryParams[i].split('=');
			        if (parameterName[0] == param)
			        {
			            return parameterName[1];
			        }
			    }			 
		 },
		/**
		 * Custom function to send capture info on click of see review button
		 */
		 seeReviews : function(e) {
			 	if($.browser.msie) { e.preventDefault();}
				var btnUrl = $(e.target).attr('href');
				var eventInfo = new Object();
				eventInfo["UV.EventType"] = 'SeeReviews';//This needs to be event dependent
				eventInfo["UV.EventTrigger"] = 'ReviewButtonClick';//this needs to be dynamic as per the event
				eventInfo["UV.ReviewScore"] = $('#spn_score').text();
				eventInfo["UV.TotalReviews"] = $('#spn_reviewsCount').text();
				var docUrl = document.location.href;
				var urlQuery = docUrl.substring(docUrl.indexOf('?')+1);
				eventInfo["UV.BrowserGUID"] = this.getKeyValue(urlQuery, "browserGUID");
				eventInfo["UV.SearchQueryId"] = this.getKeyValue(urlQuery, "searchQueryId");;

				 //Send capture request
				 capture.sendCaptureRequest(
						 eventInfo
						 ,"ReviewButtonClick"
						 ,true
						 ,function() {window.open(btnUrl);}//Go to the roomBooking url
				 );				 

		 },
		/**
		 * Utility function to choose date prompt on rendering of page
		 */
		 chooseDatePrompt : function() {
			 var query = window.location.href;
			 query=query.substring(query.indexOf('?')+1);
			 
			 var dpFrom = this.getKeyValue(query,'arrivalDate');
			 var dpTo = this.getKeyValue(query,'departureDate');
			 
			 if(dpFrom.indexOf('/') == -1 && dpTo.indexOf('/') == -1) {
				$("#ip_dpfrom").addClass('chooseDate');
				$("#ip_dpfromShow").addClass('chooseDate');
				$("#ip_dpto").addClass('chooseDate');
				$("#ip_dptoShow").addClass('chooseDate');
                $("#ip_dpfromShow").css('color','#999');
                $("#ip_dptoShow").css('color','#999');
			 }
			 else {				
				$("#ip_dpfrom").removeClass('chooseDate');
				$("#ip_dpfromShow").removeClass('chooseDate');
				$("#ip_dpto").removeClass('chooseDate');
				$("#ip_dptoShow").removeClass('chooseDate');
                $("#ip_dpfromShow").css('color','#222');
                $("#ip_dptoShow").css('color','#222');
			}
		 }

	 });
	 
	 var hotelView = new HotelView();//Instantiate the hotel view
