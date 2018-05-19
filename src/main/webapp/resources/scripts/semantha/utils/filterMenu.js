$(function(){

	var twiceClickSubLi = false;

	$(".filterMenu ul.multiSelect li h4").live("click", function () {
		twiceClickSubLi = false;

		if ($(this).parent().find("ul").css("display") == "block") {
			//Deselecting all items in the submenu
			$(this).parent().find("ul").hide().find("li").removeClass("on").parent().parent().find("h4").removeClass("subOff");
			twiceClickSubLi = true;
			
			if ($(event.target).closest($("#div_amenitiesList")).length > 0) {
				eventTriggerer = "AmenityRemovedSearch";
				typeOfSearch = "AmentityFilterUpdate";
				responseCount = 0;
			}
			else if ($(event.target).closest($("#div_themesList")).length > 0) {
				eventTriggerer = "ThemeRemovedSearch";
				typeOfSearch = "ThemeFilterUpdate";
				responseCount = 0;
			}
		}
		if(!twiceClickSubLi) {
			$(this).parent().trigger("click");
		}
		
	});

	$(".filterMenu ul.multiSelect li").live("click", function (event) {
		if ($(this).hasClass("on") && $(this).parent().parent(".hasSub").length == 0) {
			//single menu item removed
			if ($(event.target).closest($("#div_amenitiesList")).length > 0) {
				eventTriggerer = "AmenityRemovedSearch";
				typeOfSearch = "AmentityFilterUpdate";
				responseCount = 0;
			}
			else if ($(event.target).closest($("#div_themesList")).length > 0) {
				eventTriggerer = "ThemeRemovedSearch";
				typeOfSearch = "ThemeFilterUpdate";
				responseCount = 0;
			}

			$(this).removeClass("on");
		} 
		else if (($(this).children("ul").length > 0) && ($(this).children("ul").is(":hidden")) && !twiceClickSubLi) { 
			// hassub class LI including ul clicked when hdr clicked. default first selection
			$(this).removeClass("on").find("ul").find("li:first-child").addClass("on").parent().show().parent().find("h4").addClass("subOff");
			if ($(event.target).closest($("#div_amenitiesList")).length > 0) {
				eventTriggerer = "AmenityAddedSearch";
				typeOfSearch = "AmentityFilterUpdate";
				responseCount = 0;
			}
			else if ($(event.target).closest($("#div_themesList")).length > 0) {
				eventTriggerer = "ThemeAddedSearch";
				typeOfSearch = "ThemeFilterUpdate";
				responseCount = 0;
			}
		}
		else if( $(this).hasClass("on") && $(this).parent().parent(".hasSub").length > 0) {
			//submenu item removed
			if ($(event.target).closest($("#div_amenitiesList")).length > 0) {
				eventTriggerer = "AmenityRemovedSearch";
				typeOfSearch = "AmentityFilterUpdate";
				responseCount = 0;
			}
			else if ($(event.target).closest($("#div_themesList")).length > 0) {
				eventTriggerer = "ThemeRemovedSearch";
				typeOfSearch = "ThemeFilterUpdate";
				responseCount = 0;
			}

			$(this).removeClass("on");
		}
		else if (!$(this).hasClass("on") && $(this).parent().parent(".hasSub").length > 0) { 
			//submenu LI clicked
			$(this).addClass("on").siblings("li").removeClass("on");
			if ($(event.target).closest($("#div_amenitiesList")).length > 0) {
				eventTriggerer = "AmenityAddedSearch";
				typeOfSearch = "AmentityFilterUpdate";
				responseCount = 0;
			}
			else if ($(event.target).closest($("#div_themesList")).length > 0) {
				eventTriggerer = "ThemeAddedSearch";
				typeOfSearch = "ThemeFilterUpdate";
				responseCount = 0;
			}
		} 
		else if($(this).children("ul").length == 0){ 
			//single menu item LI clicked
			if ($(event.target).closest($("#div_amenitiesList")).length > 0) {
				eventTriggerer = "AmenityAddedSearch";
				typeOfSearch = "AmentityFilterUpdate";
				responseCount = 0;
			}
			else if ($(event.target).closest($("#div_themesList")).length > 0) {
				eventTriggerer = "ThemeAddedSearch";
				typeOfSearch = "ThemeFilterUpdate";
				responseCount = 0;
			}
			$(this).addClass("on");
		}


		var num=$(this).nextAll().length, max=$(this).parent("ul").find("li").length;
		if (($(this).parent().parent(".hasSub").length > 0) && ($(this).parent().children(".on").length == 0)) {
			$(this).parent().parent().find("h4").removeClass("subOff").parent().find("ul").hide();
			twiceClickSubLi = true;
		}

		$(".filterMenu ul.multiSelect li.hasSub").removeClass("on");
		var filterBarLabel, color, filterListId, filterBarLabelDefault, clickedBarLabel,clickedBarLabelBg, clickedBarLabelIcon;

		if ($(event.target).closest($("#div_amenitiesList")).length > 0) {
			filterListId = "#div_amenitiesList";
			filterBarLabelDefault = getLocalizedAmenitiesFilterTitle();
			clickedBarLabel = ".filterWrapper .amenities span.menu-label";
			clickedBarLabelIcon = ".filterWrapper .amenities span#spn_amenitiesGreyDownIcon";
			clickedBarLabelBg = ".filterWrapper .amenities";
		} 
		else if ($(event.target).closest($("#div_themesList")).length > 0) {
			filterListId = "#div_themesList";
			filterBarLabelDefault = getLocalizedThemesFilterTitle();
			clickedBarLabel = ".filterWrapper .themes span.menu-label";
			clickedBarLabelIcon = ".filterWrapper .themes span#spn_themes";
			clickedBarLabelBg = ".filterWrapper .themes";
		}

		nlpAmenityIds = [];
		nlpAmenities = [];

		$(".filterMenu ul.multiSelect li.on").each(function(){
			nlpAmenityIds.push($(this).attr('id'));
			if($(this).attr('name')!=undefined){
				nlpAmenities.push($(this).attr("name"));
			}else{
				nlpAmenities.push($(this).text());
			}
		});

		var selectedLi = filterListId + " ul li.on";
		var selectedNum = $(selectedLi).length;

		if (selectedNum == 0) {
			filterBarLabel = filterBarLabelDefault;
			color = "#222";
			$(clickedBarLabelBg).css("background-color","");
			$(clickedBarLabelIcon).removeClass("greyDownIconActive");
			$(clickedBarLabelIcon).addClass("greyDownIcon");
		} else if (selectedNum == 1) {
			filterBarLabel = $(selectedLi).eq(0).html();
			color = "#FFFFFF";
			$(clickedBarLabelIcon).removeClass("greyDownIcon");
			$(clickedBarLabelIcon).addClass("greyDownIconActive");
			$(clickedBarLabelBg).css("background-color","#02ADF7"); 
		} else if (selectedNum > 1) {
			filterBarLabel = $(selectedLi).eq(0).html() + " + " + (selectedNum - 1);
			color = "#FFFFFF";
			$(clickedBarLabelIcon).removeClass("greyDownIcon");
			$(clickedBarLabelIcon).addClass("greyDownIconActive");
			$(clickedBarLabelBg).css("background-color","#02ADF7"); 
		}

		$(clickedBarLabel).html(filterBarLabel).css("color",color);
		renderHotel(true);
    });
	
	$(".filterMenu ul.singleSelect li").live("click", function (event) {
		var filterBarLabel, color, filterListId, filterBarLabelDefault, clickedBarLabel, clickedBarLabelBg,clickedBarLabelIcon;
		if ($(event.target).closest($("#div_priceList")).length > 0) {		
			typeOfSearch = "PriceFilterUpdate";

			filterListId = "#div_priceList";
			filterBarLabelDefault = getLocalizedPriceFilterTitle();
			clickedBarLabel = ".filterWrapper .price span.menu-label";
			var priceRange = $(this).attr('id');

			if($(this).hasClass("on")){
				eventTriggerer = "PriceFilterRemovedSearch";
				nlpPrice = {};
				clickedBarLabelBg = ".filterWrapper .price";
				clickedBarLabelIcon = ".filterWrapper .price span#spn_priceGreyDownIcon";
				responseCount = 0;
			}
			else{
				eventTriggerer = "PriceFilterAddedSearch";
				if(priceRange == 'li_anyPrice'){
					nlpPrice = {};
					clickedBarLabelBg = ".filterWrapper .price";
					clickedBarLabelIcon = ".filterWrapper .price span#spn_priceGreyDownIcon";
					if($(this).hasClass("pageLoadSingleSelect")) {
						$(this).removeClass("pageLoadSingleSelect");
						responseCount = 1;//In order to prevent auto capture request on pageload
					}
					else {
						responseCount = 0;//manually selecting any price
					}
				}
				else{
					clickedBarLabelBg = ".filterWrapper .price";
					clickedBarLabelIcon = ".filterWrapper .price span#spn_priceGreyDownIcon";
					var priceArr = priceRange.split('-');
					if(priceArr[1]=='*'){
						nlpPrice = {min:priceArr[0]};
					}
					else{
						nlpPrice = {min:priceArr[0], max:priceArr[1]};
					}
				responseCount = 0;
				}
			}			
		} 
		else if ($(event.target).closest($("#div_starRatingList")).length > 0) {
			typeOfSearch = "StarRatingFilterUpdate";
			
			filterListId = "#div_starRatingList";
			filterBarLabelDefault = getLocalizedStarRatingFilterTitle();
			clickedBarLabel = ".filterWrapper .starRating span.menu-label";

			var starRating = $(this).attr('id');
			//console.log('star rating:' + starRating);
			if($(this).hasClass("on")){
				nlpStarMin = 0;
				nlpStarMax = 50;
				eventTriggerer = "StarRatingRemovedSearch";
				clickedBarLabelBg = ".filterWrapper .starRating";
				clickedBarLabelIcon = ".filterWrapper .starRating span#spn_starGreyDownIcon";
				responseCount = 0;
			}
			else{
				eventTriggerer = "StarRatingFilterAddedSearch";
				
				if(starRating == 'anyStar'){
					nlpStarMin = 0;
					nlpStarMax = 50;
					clickedBarLabelBg = ".filterWrapper .starRating";
					clickedBarLabelIcon = ".filterWrapper .starRating span#spn_starGreyDownIcon";
					if($(this).hasClass("pageLoadSingleSelect")) {
						$(this).removeClass("pageLoadSingleSelect");
						responseCount = 1;//In order to prevent auto capture request on pageload
					}
					else {
						responseCount = 0;//manually selecting any star
					}
					
				}
				else {
					clickedBarLabelBg = ".filterWrapper .starRating";
					clickedBarLabelIcon = ".filterWrapper .starRating span#spn_starGreyDownIcon";
					starArr = starRating.split('-');
					nlpStarMin = starArr[1];
					nlpStarMax = starArr[2];
					responseCount = 0;
				}
			}
			//sendCaptureRequest('Enter',true);
		} 
		else if ($(event.target).closest($("#div_sortList")).length > 0) {
			typeOfSearch = "SortUpdate";
			
			filterListId = "#div_sortList";
			filterBarLabelDefault = getLocalizedString('hotel-finder.sort.title');
			clickedBarLabel = ".sort span.sort-label";
      var HotelSearch = App.Services.HotelSearch;

			if($(this).hasClass("on")){
				nlpSortOrder =  'EXPEDIA_PICKS';
				eventTriggerer = "SortExpediaPicks";
				responseCount = 0;
        HotelSearch.setSortOrder(null);
			}
			else{
				nlpSortOrder =  $(this).attr('id');

				switch (nlpSortOrder)
				{
					case "PRICE_ASCENDING":
						eventTriggerer = "SortLowestPrice";
						responseCount = 0;
            HotelSearch.setSortOrder('priceIncr');
						break;
					case "PRICE_DESCENDING":
						eventTriggerer = "SortHighestPrice";
						responseCount = 0;
            HotelSearch.setSortOrder('priceDesc');
						break;
					case "STAR_RATING_DESCENDING":
						eventTriggerer = "SortStarRating";
						responseCount = 0;
            HotelSearch.setSortOrder('star');
						break;
					case "HOTEL_NAME_ASCENDING":
						eventTriggerer = "SortHotelName";
						responseCount = 0;
            HotelSearch.setSortOrder('name');
						break;
					default:
						eventTriggerer  = "SortExpediaPicks";
            HotelSearch.setSortOrder(null);
						if($(this).hasClass("pageLoadSingleSelect")) {
							$(this).removeClass("pageLoadSingleSelect");
							responseCount = 1;//In order to prevent auto capture request on pageload
						}
						else {
							responseCount = 0;//manually selecting expedia picks
						}
				}				
			}
		}

		var num=$(this).nextAll().length, max=$(this).parent("ul").find("li").length;
		if ($(this).hasClass("on") && $(this).attr("id")!='anyStar' && ($(event.target).closest($("#div_starRatingList")).length > 0)) {
			$(this).removeClass("on");
			$('#anyStar').addClass("on");
			filterBarLabel = filterBarLabelDefault;
			color = "";
			$(clickedBarLabelBg).css("background-color","");
			$(clickedBarLabelIcon).removeClass("greyDownIconActive");
			$(clickedBarLabelIcon).addClass("greyDownIcon");
		}else if ($(this).hasClass("on") && $(this).attr("id")!='li_anyPrice' && ($(event.target).closest($("#div_priceList")).length > 0)) {
			$(this).removeClass("on");
			$('#li_anyPrice').addClass("on");
			filterBarLabel = filterBarLabelDefault;
			color = "";
			$(clickedBarLabelBg).css("background-color","");
			$(clickedBarLabelIcon).removeClass("greyDownIconActive");
			$(clickedBarLabelIcon).addClass("greyDownIcon");
		} else if ($(this).hasClass("on") && $(this).attr("id")!='EXPEDIA_PICKS' && ($(event.target).closest($("#div_sortList")).length > 0)){
			$(this).removeClass("on");
			$('#EXPEDIA_PICKS').addClass("on");
			filterBarLabel = filterBarLabelDefault;
			color = "";
			$(clickedBarLabelBg).css("background-color","");
			$(clickedBarLabelIcon).removeClass("greyDownIconActive");
			$(clickedBarLabelIcon).addClass("greyDownIcon");
		} else {
			$(this).addClass("on").siblings("li").removeClass("on");
			filterBarLabel = $(this).find("label").html();
			if ($(event.target).closest($("#div_sortList")).length > 0) {
				color = "#222";
				$(clickedBarLabelBg).css("background-color","");
				$(clickedBarLabelIcon).removeClass("greyDownIconActive");
				$(clickedBarLabelIcon).addClass("greyDownIcon");
			} else {
				color = "#FFFFFF";
				$(clickedBarLabelBg).css("background-color","#02ADF7");
				$(clickedBarLabelIcon).removeClass("greyDownIcon");
				$(clickedBarLabelIcon).addClass("greyDownIconActive");
			}
		}
		if ($(this).attr("id")=='anyStar' || $(this).attr("id")=='li_anyPrice' || $(this).attr("id")=='EXPEDIA_PICKS') { // clicking first li
			filterBarLabel = filterBarLabelDefault;
			color = "#222";
			$(clickedBarLabelBg).css("background-color","");
			$(clickedBarLabelIcon).removeClass("greyDownIconActive");
			$(clickedBarLabelIcon).addClass("greyDownIcon");
		}

		$(clickedBarLabel).html(filterBarLabel).css("color",color);
		$(filterListId).hide();
		renderHotel(true);
	});


	var showFilterMenu = function(event,menuID){
		var eOffset = $(event).offset(),
        eHeight = $(event).height(),
        targerX,
        margTopTarget;

		if ($(event).hasClass("popRightAlign")) {
			targerX = eOffset.left - $(".filterMenu").width() + $(event).outerWidth();// +11;// - 3;
			margTopTarget = eOffset.top + eHeight + 16;
		}
    else {
			targerX = eOffset.left;
			margTopTarget = eOffset.top + eHeight + 21;
		}

		$(menuID)
			.css({
        position: 'absolute',
        left: targerX,
        top: margTopTarget
      })
			.show();
	};

	$(".filterWrapper a.amenities").live("click", function () {
		var visable = $("#div_amenitiesList").css('display');

		if(visable =='none'){
			$("div.filterMenu").hide();
			showFilterMenu(this,"#div_amenitiesList");
    	} else {
    		$("div#div_amenitiesList").hide();
    	}

	});

	$(".filterWrapper a.themes").live("click", function () {
		var visable = $("#div_themesList").css('display');

		if(visable =='none'){
			$("div.filterMenu").hide();
			showFilterMenu(this,"#div_themesList");
    	} else {
    		$("div#div_themesList").hide();
    	}

	});

	$(".filterWrapper a.price").live("click", function () {
		var visable = $("#div_priceList").css('display');

		if(visable =='none'){
			$("div.filterMenu").hide();
			showFilterMenu(this,"#div_priceList");
    	} else {
    		$("div#div_priceList").hide();
    	}

	});

	$(".filterWrapper a.starRating").live("click", function () {
		var visable = $("#div_starRatingList").css('display');

		if(visable =='none'){
			$("div.filterMenu").hide();
			showFilterMenu(this,"#div_starRatingList");
    	} else {
    		$("div#div_starRatingList").hide();
    	}

	});

	$("#div_sort").live("click", function () {
		var visible = $("#div_sortList").css('display');

		if(visible =='none'){
			$("div.filterMenu").hide();
			showFilterMenu(this,"#div_sortList");
    	} else {
    		$("div#div_sortList").hide();
    	}

	});
	
	$("#ip_hotelRefine").live("blur", function () {
		
		var element = $(this);
		
		if ( $.trim(element.val()) == "" ) {
			// Preserve the width. It was dynamically calculated
			// on page load and there is no need to re-calculate it.
			var width = element.css( 'width' );
			element.removeAttr( 'style' );
			element.css( 'width', width );
		}
		else {
			element.css( "border", "1px solid #0297d7" );
		}
	});
	
	var hotelRefineHandler = null;
	$("#ip_hotelRefine").live("keyup", function () {
		nlpHotelName = $("#ip_hotelRefine").val();
		if(hotelRefineHandler!=null)
		{
			clearTimeout(hotelRefineHandler);
		}
		hotelRefineHandler = setTimeout(function(){
			renderHotel(true);
		},600);
	});
	
	$('body').click(function(event){
		if (($(event.target).closest('div.filterMenu')).length > 0||($(event.target).closest($(".filterBarContainer a.filterLabel"))).length > 0) {
               // if clicked on a dialog, do nothing
               return true;
           } else {
               // if clicked outside the dialog, close it
               // jQuery-UI dialog adds ui-dialog-content class to the dialog element.
               // with the following selector, we are sure that any visible dialog is closed.

        	   $("div.filterMenu").hide();
           }
	});
});

