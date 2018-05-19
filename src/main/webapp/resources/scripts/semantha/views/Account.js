/**
 * @Author  <mailto:vmohapatra@expedia.com>Vijayalaxmi Mohapatra</mailto>
 */
	/* Model */
	//Model is instantiated in the controller
	
	/* View */
	/**
	 * The login view
	 */
	var LoginView = Backbone.View.extend({
		/**
		 * Attaches `this.el` to an existing element
		 */
		 el: $('body'), 
		/**
		 * Automatically called upon instantiation
		 * You make all types of bindings, excluding UI events, such as clicks, etc
		 */
		 initialize: function() {
			//Adds the loginPage class to the <body>
			$(this.el).addClass("loginPage");
			 
			// every function that uses 'this' as the current object should be in here
			_.bindAll(this, 'render', 'aboutToggle', 'onEnter', 'loginSubmit', 'selectedExperience', 'setExperience');  // fixes loss of context for 'this' within methods
		    this.render(); // not all views are self-rendering. This one is.
		 },
		/**
		 * DOM events are bound to View methods. 
		 * Backbone doesn't have a separate controller to handle such bindings 
		 * It all happens in a View.
		 */
		 events: {
			'click a#lnk_login': 'loginSubmit',
			'click #hdr_abtPlatform': 'aboutToggle',
			'keydown': 'onEnter',
			'click div.selectionBorder': 'selectedExperience'
		 },
		/**
		 *  Function in charge of rendering the entire view in this.el. 
		 *  Needs to be manually called by the user.
		 */
		 render: function() {

			//Sets the focus to username text field
			setTimeout(function () {				
				$("#ip_username").focus();//username
			}, 100);			
			
			// remove legacy cookies
			// delete after 01/01/2014
			$.removeCookie('localeId', {path:'/semantha/'});
			$.removeCookie('cur', {path:'/semantha/'});
			
			

			
			
			$('.selectionBorder').each(function(){
		    	var experienceAttr = $(this).attr('attr'); 
		    	var semanthaExperience = $('#div_semanthaExperience').text();
		    	if(semanthaExperience.indexOf(experienceAttr) != -1){
		    		$(this).show();
		    	}
		    });
			
			this.setExperience();
		 },
		/**
		 * Custom function to submit the login button on pressing the Enter key
		 */
		onEnter: function(e) {
			var curkey = e.which;
			if (curkey == 13)
			{
				$(".loginButton").click();
				return false;
			}

		},
		/**
		 * Custom toggle function for About platform section's toggle
		 */
		aboutToggle: function() {
			$('.aboutPlatform #div_abtDetails').toggle();
			if ($('.aboutPlatform #div_abtDetails').css('display') == 'none') 
			{
				$('.aboutPlatform h4 span').removeClass("downTriangle").addClass("rightTriangle");
			}
			else 
			{
				$('.aboutPlatform h4 span').removeClass("rightTriangle").addClass("downTriangle");
			}

		},
		/**
		* Custom function to determine selected Experience and the transition effect for its description
		*/
		selectedExperience: function(e) {
	    	$.cookie( 'selectedExp', $(e.currentTarget).attr('attr'), {path: '/'} );
	    	if($.cookie( 'selectedExp')=="semantha")
	    	{
				if($("#div_facebookAuthEnableStatus").text()=="true")
				{
					$('#div_aboutPlatform').show();
				}
				else
				{
					$('#div_aboutPlatform').hide();
				}
	    	}
	    	else if($.cookie( 'selectedExp')=="destinationFinder")
	    	{
	    		$('#div_aboutPlatform').hide();
	    	}
	    	else
	    	{
				if($("#div_facebookAuthEnableStatus").text()=="true")
				{
					$('#div_aboutPlatform').show();
				}
				else
				{
					$('#div_aboutPlatform').hide();
				}
	    	}	    		
			var selectedNum = $(e.currentTarget).attr("id").substring(21);	
			$(e.currentTarget).siblings('div.selectionBorder').removeClass("selectionBorderOn").addClass("selectionBorderOff");	
			$(e.currentTarget).removeClass("selectionBorderOff").addClass("selectionBorderOn");	
			var selectedEle = '#div_innerSelectionDesc' + selectedNum;	
			$('.pilotContentInner').not(selectedEle).fadeOut(100);
			$(selectedEle).fadeIn(400);
		},
		/**
		* Custom function to set Experience based on cookie on render
		*/
		setExperience: function() {
			var exp = $.cookie('selectedExp');
			var temp = '';
			if (exp != undefined)
			{	
				if(exp == 'destinationFinder'){
					temp = $("#div_experienceOptions_2");
					$('#div_aboutPlatform').hide();
				}
				else{
					temp = $("#div_experienceOptions_1");
					if($("#div_facebookAuthEnableStatus").text()=="true")
					{
						$('#div_aboutPlatform').show();
					}
					else
					{
						$('#div_aboutPlatform').hide();
					}
				}			
			} else {
				temp = $("#div_experienceOptions_1");
				if($("#div_facebookAuthEnableStatus").text()=="true")
				{
					$('#div_aboutPlatform').show();
				}
				else
				{
					$('#div_aboutPlatform').hide();
				}
			}
			var selectedNum = temp.attr("id").substring(21);	
			temp.siblings('div.selectionBorder').removeClass("selectionBorderOn").addClass("selectionBorderOff");	
			temp.removeClass("selectionBorderOff").addClass("selectionBorderOn");	
			var selectedEle = '#div_innerSelectionDesc' + selectedNum;	
			$('.pilotContentInner').not(selectedEle).fadeOut(100);
			$(selectedEle).fadeIn(400);
		},
		/**
		 * Custom loginSubmit function called via click on log in button
		 */
		loginSubmit: function() {
			//Setting focus on username field and showing error message on submitting blank input
			$("#ip_username, #ip_password").each(function () {
				if ($(this).val() == "") 
				{
					this.focus();
					$(".unsupportedBrowserMsg").hide();
					$(".errorMsg").show();
					return false;
				}
			});
			
			//Submitting the form only if username and password are not null
			if ($("#ip_username").val() != "" && $("#ip_password").val() != "") 
			{
				//Code to process and extract the username after the last backslash	
				$("#ip_username").val($("#ip_username").val().replace(/(.*)\\(.*)/,'$2'));
				//Send the capture request
				capture.sendCaptureRequest(
						"BEST Login"
						,"LoginSubmit"
						,true
						//,function() {$("#form_login").submit();}//Submit the login form
				);				
				$("#form_login").submit();
			}
		}
	});
	
	$(function(){
		var loginView = new LoginView();//Instantiate the login view	
	});
	
