/**
 * @Author  <mailto:vmohapatra@aidep.com>Vijayalaxmi Mohapatra</mailto>
 */
	/* Model */

	/* View */
	/**
	 * The booking view
	 */
	 var BookingView = Backbone.View.extend({
		/**
		 * Attaches `this.el` to an existing element
		 */
		 el: $('body'), 
		/**
		 * Automatically called upon instantiation
		 * You make all types of bindings, excluding UI events, such as clicks, etc
		 */
		 initialize: function() {
			// every function that uses 'this' as the current object should be in here
			_.bindAll(this, 'render','checkUnique', 'fullNameCheck', 'validateForm','submitBooking','setCountryDropdown','showStateDropdown','selectShadow','hideSelectShadow');
			this.render();
		 },
		/**
		 * DOM events are bound to View methods. 
		 * Backbone doesn't have a separate controller to handle such bindings 
		 * It all happens in a View.
		 */
		 events: {
			 'change .fullName': 'fullNameCheck',
			 'click #lnk_reservationWithoutSurvey': 'submitBooking',
			 'change #sel_countryCode': 'showStateDropdown',
			 'focus select': 'selectShadow',
			 'blur select': 'hideSelectShadow'
		 },
		/**
		 * Function in charge of rendering the entire view in this.el. 
		 * Needs to be manually called by the user.
		 */
		 render: function(){
			 //Call to validate form while rendering
			 this.validateForm(); 
			 
			//Hide the State dropdown by default
			$(".stateLi").hide();
			this.setCountryDropdown();
				
			//Setting default values for following elements
			$("#ip_cardNumber").val('');
			$("#ip_securityCode").val('');
			$("#sel_creditCardType").val($("#sel_creditCardType option:first").val());
			$("#sel_expirationDateMonth").val( $("#sel_expirationDateMonth option:first").val());
			$("#sel_expirationDateYear").val($("#sel_expirationDateYear option:first").val());

			//Setting spellcheck as false for input and textarea elements
			$('input').attr('spellcheck','false');
			$('textarea').attr('spellcheck','false');
			
			//The following code is used to correct the behavior for tab key selection for read only input
			//Sets the focus on next non read only and visible element
			$(':input[readonly="readonly"]',this.el).each(function() {
				var obj = $(this);
				$(this).focus(function(evt){
					evt.preventDefault();
					$(":input[type!='hidden']:eq(" + ($(":input[type!='hidden']").index($(evt.target)) + 1) + ")").trigger('focus');
				});
			});
			
		 },
		 hideSelectShadow: function(event) {
			 	var self = $(event.target);
		        var selfId = "div_" + self.attr("id");
		        var elem = document.getElementById(selfId);
		        $(elem).remove();
		 },
		 selectShadow: function(event){
		        var self = $(event.target);
		        var selfId = "div_" + self.attr("id");

		        var $shadow = $('<div>', {
		            css: {
		                'position': 'absolute',
		                'left':     self.offset().left,
		                'top':      self.offset().top,
		                'width':    self.outerWidth(),
		                'height':   self.outerHeight(),
		                'box-shadow': '0 0 0 3px #0dadf7',
		                'border-radius': '3px',
		                'z-index':  -1
		            }
		        }).attr("id",selfId).appendTo(self.parent());
		},
		/**
		 * Custom utility function to check unique names in case of more than 1 room
		 * returns a boolean value 
		 * true if value is unique else false
		 */
		 checkUnique: function (obj) {
				var nameObj = $(obj);
				var isEmpty = false;
				var container = nameObj.parent().parent();
				var fullName = '';
				var otherFullName = '';
				
				$('.fullName',container).each(function(){
					if($(this).val()==''){
						isEmpty = true;
					}
					fullName += $(this).val() +'#';
				});

				var other = $('fieldset.room ul').filter(function(){
					return this!=container[0];
				});
				
				$('.fullName',other).each(function(){
					otherFullName += $(this).val() +'#';
				});
				
				if(isEmpty){
					return true;
				}
				
				return otherFullName.indexOf(fullName)==-1;
		 },
		/**
		 * Custom function to check the name fields in case of change in .fullname elements ( in case more than 1 room is booked)
		 */
		 fullNameCheck: function(event){
			 var fullNameUniqueCheck = true;
			 var checkResult = this.checkUnique(event.target);

			 var container = $(event.target).parent().parent();
			 if(checkResult){
				 fullNameUniqueCheck = true;
				 $('.fullName',container).removeClass('uniqueError');
				 $('.fullName',container).parent().children('label').removeClass('uniqueError');
				 $('.uniqueErrorMsg',container).html('').hide();
			 }
			 else {
				 fullNameUniqueCheck = false;
				 $('.fullName',container).addClass('uniqueError');
				 $('.fullName',container).parent().children('label').addClass('uniqueError');

				 var msg = getLocalizedString('hotel-booking.validation.different-name');
				 $('.uniqueErrorMsg',container).html(msg).show();
			 }			 
		 },
		/**
		 * Custom function to validate the form fields before submission
		 */
		 validateForm : function() {
			 var form = $("#form_booking");
			 var required = 'required';

             if(typeof form != undefined) {
                 var validator = form.validate({
                     rules: {
                         "reservationInfo.homePhone": required,
                         "reservationInfo.creditCardType": required,
                         "reservationInfo.creditCardNumber": required,
                         "reservationInfo.creditCardExpirationMonth": required,
                         "reservationInfo.creditCardExpirationYear": required,
                         "reservationInfo.creditCardIdentifier": {
                             required: true,
                             minlength: 3
                         },
                         "reservationInfo.firstName": required,
                         "reservationInfo.lastName": required,
                         "addressInfo.address1": required,
                         "addressInfo.city": required,
                         "usaStateProvinceCode": required,
                         "canadaStateProvinceCode": required,
                         "ausStateProvinceCode": required,
                         "checkoutAgreement":required,
                         "addressInfo.postalCode":required
                     },
                     messages: {
                         "reservationInfo.homePhone":getLocalizedString('hotel-booking.validation.phone-number'),
                         "reservationInfo.creditCardType":getLocalizedString('hotel-booking.validation.credit-card.type'),
                         "reservationInfo.creditCardNumber":getLocalizedString('hotel-booking.validation.credit-card.number'),
                         "reservationInfo.creditCardExpirationMonth":getLocalizedString('hotel-booking.validation.credit-card.expiration'),
                         "reservationInfo.creditCardExpirationYear":getLocalizedString('hotel-booking.validation.credit-card.expiration'),
                         "reservationInfo.creditCardIdentifier":getLocalizedString('hotel-booking.validation.credit-card.id'),
                         "reservationInfo.firstName":getLocalizedString('hotel-booking.validation.credit-card.first-name'),
                         "reservationInfo.lastName":getLocalizedString('hotel-booking.validation.credit-card.last-name'),
                         "addressInfo.address1":getLocalizedString('hotel-booking.validation.address'),
                         "addressInfo.city":getLocalizedString('hotel-booking.validation.city'),
                         "usaStateProvinceCode":getLocalizedString('hotel-booking.validation.state.us'),
                         "canadaStateProvinceCode":getLocalizedString('hotel-booking.validation.state.ca'),
                         "ausStateProvinceCode":getLocalizedString('hotel-booking.validation.state.au'),
                         "checkoutAgreement":getLocalizedString('hotel-booking.validation.agreement'),
                         "addressInfo.postalCode":getLocalizedString('hotel-booking.validation.code')
                     },
                     // the errorPlacement has to take the table layout into account
                     errorPlacement: function(error, element) {
                         element.prev('label').addClass('errorLabel');
                         $('.errorMsg',$(element).parent()).html(error).show();
                     },
                     // set this class to error-labels to indicate valid fields
                     success: function(label) {
                         // set &nbsp; as text for IE
                         if(label.attr("generated"))
                         {
                             label.html("&nbsp;").removeClass("error").parent().hide();
                             var container = label.parent().parent();
                             container.children('label').removeClass('errorLabel');
                         }
                     },
                     onkeyup: false,
                     focusInvalid: false,
                     invalidHandler: function() {
                     setTimeout(function(){$(document).find(":input.error:first").focus();},200);
                     }
                 });//end of validate.
             }

			 jQuery.validator.addClassRules("fullName", {required:true});
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
		 * Custom function to validate the booking and show intermediate processing button while submitting the booking
		 */
		 submitBooking : function(event) {
			 var form = $("#form_booking");
			 //Declare fullNameUniqueCheck to be true by default
			 var fullNameUniqueCheck = true;

			 //Check if any of the name fields have duplicate names
			 $("span.uniqueErrorMsg").each(function() {
				 //If the uniqueNameErrorMsg is shown then set fullNameUniqueCheck to false
				 if($(this,this.el).css('display')=='block') {
					 var errtext = $(this,this.el).text();
					 //if(errtext=="* Please enter a different name for each room you book") {
					 if(errtext.indexOf('*')!= -1 && errtext.indexOf('*')==0) {
						 fullNameUniqueCheck = false;
					 }					 
				 }
			 });
			 
			 //If the form is valid
			 if (form.valid())
			 { 
				 //if the .fullName are unique
				 if(fullNameUniqueCheck){
						
					 var eventInfo = new Object();
					 eventInfo["UV.EventType"] = 'CompleteCheckOut';//This needs to be event dependent
					 eventInfo["UV.EventTrigger"] = 'CompleteReservationClick';//this needs to be dynamic as per the event
					 var docUrl = document.location.href;
					 var urlQuery = docUrl.substring(docUrl.indexOf('?')+1);
					 eventInfo["UV.BrowserGUID"] = this.getKeyValue(urlQuery, "browserGUID");
					 eventInfo["UV.SearchQueryId"] = this.getKeyValue(urlQuery, "searchQueryId");;

					 //Send capture request
					 capture.sendCaptureRequest(
							 eventInfo
							 ,"CompleteReservationClick"
							 ,true
							 //,function() {form.submit();}//submit the booking
					 );					 
					 form.submit();
					 $('.submitBtn').hide();
					 $('.div_processingreservation').show();
					 $('.img_loader').show();
				 }
			 }
			 else 
			 {
				 //If the form is invalid and fullNameUniqueCheck is false, sets the focus on the first unique error
				 if(!fullNameUniqueCheck) {					 
					 setTimeout(function(){$(document).find(":input.uniqueError:first").focus();},300);
					 return;
				 }
			 }
			 return false;
		 },
		/**
		 * Custom function to show state dropdown as per country selection
		 */
		 showStateDropdown: function() {
			 var selected = $('#sel_countryCode').val();

			 switch(selected)
			 {
			 	case "US":
			 		$('.stateLi select').attr('disabled','true');
			 		$(".stateLi").hide();
			 		$("#li_usStates").show();
			 		$('#li_usStates select').removeAttr('disabled');
			 		$('#li_postalCode').addClass('postalCodeLi');
			 		break;
			 	case "CA":
			 		$('.stateLi select').attr('disabled','true');
			 		$(".stateLi").hide();
			 		$("#li_canStates").show();
			 		$('#li_canStates select').removeAttr('disabled');
			 		$('#li_postalCode').addClass('postalCodeLi');
			 		break;
			 	case "AU":
			 		$('.stateLi select').attr('disabled','true');
			 		$(".stateLi").hide();
			 		$("#li_ausStates").show();
			 		$('#li_ausStates select').removeAttr('disabled');
			 		$('#li_postalCode').addClass('postalCodeLi');
			 		break;
			 	default:
			 		$(".stateLi").hide();
			 	 	$('.stateLi select').attr('disabled','true');
			 	 	$('#li_postalCode').removeClass('postalCodeLi');
			 }
		 },
		 /**
		 * Custom function to show country dropdown as per currency and locale
		 */
		 setCountryDropdown: function() {
			// these functions are from commonutil
			var currencyCode = getCurrencyCode();
			var locale = getLocaleId();
			if(locale=="en_US" && currencyCode=="GBP")
			{
				$('#sel_countryCode').val('GB');
			}			
			else if(locale=="en_US" && currencyCode=="USD")
			{			
				$('#sel_countryCode').val('US');
				this.showStateDropdown();
			}
			else
			{
				$('#sel_countryCode').val('');
			}
		 }
	 });
	 
	 var bookingView = new BookingView();//Instantiate the booking view
