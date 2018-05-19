/**
 * @Author  <mailto:v-bfeng@expedia.com>Bingzhong feng</mailto>
 */
	/* Model */
	
	
	/* View */
	/**
	 * The destionation finder view
	 */
	var DestinationFinderView = Backbone.View.extend({
		 el:$('body'),
		 initialize: function() {
			 	this.render();
		 },
		 
		 events: {
			 'keyup :input#ip_searchInput': 'destinationEnter',
			 'keydown :input#ip_searchInput': 'deleteSearchTag',
			 'click .searchIcon': 'searchIconClick',
			 'mouseenter .searchTag': 'enterSearchTag',
			 'mouseleave .searchTag': 'leaveSearchTag',	 
			 'click .searchTag': 'removeSearchTag',
			 'click .citySearchTag': 'clickCitySearchTag',
			 'mouseover .citySearchTag': 'enterCitySearchTag',	
			 'mouseout .citySearchTag': 'leaveCitySearchTag',	
			 'mouseover .cityImage': 'enterCityImg',	
			 'mouseout .cityImage': 'leaveCityImg'
		
		 },
		 
		 render: function() {
			 var obj = this;
			 $.getJSON('searchDestination/',function(data){
					obj.processDestinationData(data);
					$('.searchInput').focus();
			});

		 },
		 
		 hoverSearchTag : function(event){
				var searchAttr = $(event.target).parent().attr('attr');
				this.hoverCityTag(searchAttr, event.data, 'hover');
		 },
		 
		 enterSearchTag : function(event){
			 event.data = true;
			 this.hoverSearchTag(event);
		 },
		 
		 leaveSearchTag : function(event){
			 event.data = false;
			 this.hoverSearchTag(event);
		 },
		 
		 enterCitySearchTag : function(event){
			 event.data = true;
			 this.hoverCitySearchTag(event);
		 },
		 
		 leaveCitySearchTag : function(event){
			 event.data = false;
			 this.hoverCitySearchTag(event);
		 },
		
		 destinationEnter : function(event){
			var acceptAttrs = 'beach,bicycle rentals,boating,bungee jumping,canoeing,casino,castle,countryside,cross-country skiing,family-friendly,fishing,golf,historic,horse riding,kayaking,lgbt-friendly,luxury,nightclub,parasailing,rafting,restaurant,rock climbing,romantic,snowshoeing,shuffleboard,ski,skydiving,sledding,snowboarding,surfing,toboggan run,waterpark,whale-watching,windsurfing,ziplining';
			var searchInput = $('.searchInput').val();
			var obj = this;
			if(event.keyCode == 13 || event.keyCode === 32 || event.data){		
			    $.get('NautilusService?requestQuery=' + searchInput, function (data) {
					data = data.PARSE;
					var nlpAttr = [];
					
					/*$($(data).find("Parselist Parse")[0]).find("Domain[type='Affinity']").map(function()
					{
						nlpAttr.push ($(this).attr("name").toLowerCase() );
					});
					if(nlpAttr.length == 0){
						$($(data).find("Parselist Parse")[0]).find("Domain[type='Structure']").map(function()
						{
							nlpAttr.push( $(this).attr("name").toLowerCase() );
						});
					}*/
					
					if(typeof(data.HOTEL_ATTRIBUTE) != "undefined")
					{
						for(var n = 0; n < data.HOTEL_ATTRIBUTE.length; n++)
						{
							nlpAttr.push(data.HOTEL_ATTRIBUTE[n]);
						}					
					}				
					for(var idx in nlpAttr){
						var attr = nlpAttr[idx];
						if(acceptAttrs.indexOf(attr.toLowerCase())!=-1 && $('#' + attr).length ==0){
							obj.addSearchTag(attr);
							$('.searchInput').val($('.searchInput').val().replace(searchInput,''));
						}
					}
					
				});
			}
		},
		
		searchIconClick : function(event){
			event.data = true;
			this.destinationEnter(event);
		},
		
		deleteSearchTag : function(event){
			if(event.keyCode==8 && $('.searchInput').val()==''){
				if($('.searchInput').parent().prev().length != 0 ){
					$('.searchInput').parent().prev().remove();
					this.destinationSearch();
				}
			}
		},
		
		enterCityImg : function (event) {
			this.hoverImage(event, true);
			
		},
		
		leaveCityImg : function (event) {
			this.hoverImage(event, false);
		},
		
		hoverImage : function(event,hoverOrLeave){
			event.preventDefault();
			var target = $(event.target);
			var obj = null;
			if(target.is('span')){
				obj = target.parent().parent();
			}else if(target.is('h3')){
				obj = target.parent();
			}else if(target.is('div') && target.hasClass('cityImage')){
				obj = target;
			}
			if(obj!=null){
				obj = obj.next().next();
				if(hoverOrLeave == true){
					obj.addClass("hotelsInCityHover");
				}else{
					obj.removeClass("hotelsInCityHover");
				}
				
			}
		},
		
		removeSearchTag : function (event){
			var target = $(event.target);
			if(target.is('a')){
				target.parent().remove();
			}else{
				target.parent().parent().remove();
			}
	
			this.destinationSearch();
		},

		hoverCitySearchTag:function (event){
			event.stopPropagation();
			var attr = $('label',$(event.target).parent()).attr('attr');
			if(this.getSearchCondition().toLowerCase().indexOf(attr)==-1){
				this.hoverCityTag(attr, event.data, 'scoreBarHover');
			}else{
				this.hoverCityTag(attr, event.data, 'hover');
			}
		},

		hoverCityTag:function (attr, addOrRemove, hoverClass){
			if(addOrRemove){
				$('.searchTag[attr="' + attr + '"]').addClass('hover');
			}
			else{
				$('.searchTag[attr="' + attr + '"]').removeClass('hover');
			}

			$('.citySearchTag').each(function(){
				
				var elem = $(this);
				var elemLabel = $('label',elem);
				var elemSpan = $('span',elem);
				if(elemLabel.attr('attr') == attr){
					if(addOrRemove){
						elemLabel.addClass(hoverClass);
						elemSpan.addClass(hoverClass);
					}else{
						elemLabel.removeClass(hoverClass);
						elemSpan.removeClass(hoverClass);
					}
				}	    
			});

		},

		clickCitySearchTag:function (event){
			if($('span',$(event.target).parent()).hasClass('tagScoreBar')){
				$('.searchTag[attr="'+$('label',$(event.target).parent()).attr('attr')+'"]').remove();
				this.destinationSearch();
			}else{
				this.addSearchTag($('label',$(event.target).parent()).attr('attr'));
			}
		},

		addSearchTag : function (tagAttr){
			if($('.searchTag[attr="' + tagAttr + '"]').length==0){
				var tagContent = '<li id="li_tag_'+tagAttr+'" class="searchTag" attr="'+tagAttr.toLowerCase()+'"><a href="#" id="lnk_'+tagAttr+'">' + tagAttr.toUpperCase() +'<span id="spn_' + tagAttr +'" class="closeIcon"></span></a></li>';
				$('.searchInput').parent().before(tagContent);
				this.destinationSearch();		
			}
		},

		destinationSearch: function (){
			var container = $('.cityListContainer').parent();
			$('.cityListContainer').remove();
			container.append('<div class="cityListContainer"></div>');
			$('.searchInput').focus();
			var obj = this;
			$.getJSON('searchDestination/' + this.getSearchCondition(), function(data){
				obj.processDestinationData(data);
			});
		},

		getSearchCondition : function (){
			var result = [];
			$('.searchTag').each(function(){
				result.push($(this).attr('attr'));
			});
			return result.join();
		},
		
		processDestinationData : function (data){
			var cityTemp = $('#div_cityTemp').html();
			var attrTemp = $('#div_attrTemp').html();
		    var noDataMsg = $('#div_nofindmsg').text();
		    var haveDataMsg = $('#hdr_searchTitle').text();
		    
		    if(data==null || data.length ==0){
		    	$('#div_destinationSearch h1').text(noDataMsg).css("color","#af4d4d");
		    	return;
		    }
		    
			for(var idx in data){
				var cityInfo = data[idx];
				var cityContent = cityTemp;
				var thumbnail = '';
				var thumbnailImage;
				
				if(window.devicePixelRatio && window.devicePixelRatio>1){
					thumbnailImage = cityInfo['Destination Finder High DPI Thumbnail Name'];
				}else{
					thumbnailImage = cityInfo['Destination Finder Thumbnail Name'];
				}
				if( thumbnailImage != undefined ){
					thumbnail = 'resources/img/temp/city/' + thumbnailImage;
				}else{
					thumbnail = 'resources/img/temp/city/photoHolder300.png';
				}
				cityContent = cityContent.replace('$0',thumbnail);
				cityContent = cityContent.replace(/\$1/g,cityInfo['Display Name'].replace(/"/g,''));
				var attrsContent = '';
				for(prop in cityInfo){
					var scoreBar = 'scoreBar';
					if(prop =='Display Name' || prop =='Destination Finder Thumbnail Name' || prop =='Destination Finder High DPI Thumbnail Name' || prop =='Total Activity Score' || prop =='High DPI Thumbnail Name'){
						
					}else{
						var searchCondition = this.getSearchCondition();
						searchCondition = searchCondition.toLowerCase();
						var reg = new RegExp('\\b' + prop + '\\b');
						if(searchCondition!=null && searchCondition.match(reg)!= null){
							scoreBar = 'tagScoreBar';
						}
						var attrContent = attrTemp.replace('$1', prop.toUpperCase());
						attrContent = attrContent.replace(/\$4/g,prop);
						attrContent = attrContent.replace('$0',cityInfo[prop]*100);
						attrContent = attrContent.replace('$2',scoreBar);
						attrContent = attrContent.replace('$3',scoreBar + 'Label');
						attrContent = attrContent.replace(/\$5/g,cityInfo['Display Name'].replace(/"/g,''));
						attrsContent += attrContent;
					}
				}
			
				cityContent = cityContent.replace('$2', attrsContent);
				$('#div_destinationSearch h1').text(haveDataMsg).css("color","#52BAE7");
				$('.cityListContainer').append(cityContent);	
			}
			
			var height = $('.cityListContainer').height();
			$( '.cityListContainer' ).masonry(
			{
			    itemSelector: '.cityContainer',
			    columnWidth:  324
			});
		}
		
	});
	
	$(function(){
		var destinationFinderView = new DestinationFinderView();
	});
	






