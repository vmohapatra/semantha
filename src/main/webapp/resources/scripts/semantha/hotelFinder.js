/* since we're using console.log and console.error, firefox and IE will freak out.  this wraps noop functions into console for them */
var console = (function () {
  if (window.console) { return window.console; }

  var noop = function () { };
  return {
    assert: noop,
    constructor: noop,
    count: noop,
    debug: noop,
    dir: noop,
    dirxml: noop,
    error: noop,
    group: noop,
    groupCollapsed: noop,
    groupEnd: noop,
    info: noop,
    log: noop,
    markTimeline: noop,
    profile: noop,
    profileEnd: noop,
    time: noop,
    timeEnd: noop,
    trace: noop,
    warn: noop
  };
})();

if (!window.JSON) {
  window.JSON = {
    parse: function (sJSON) { return eval("(" + sJSON + ")"); },
    stringify: function (vContent) {
      if (vContent instanceof Object) {
        var sOutput = "";
        if (vContent.constructor === Array) {
          for (var nId = 0; nId < vContent.length; sOutput += this.stringify(vContent[nId]) + ",", nId++);
          return "[" + sOutput.substr(0, sOutput.length - 1) + "]";
        }
        if (vContent.toString !== Object.prototype.toString) { return "\"" + vContent.toString().replace(/"/g, "\\$&") + "\""; }
        for (var sProp in vContent) { sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + this.stringify(vContent[sProp]) + ","; }
        return "{" + sOutput.substr(0, sOutput.length - 1) + "}";
      }
      return typeof vContent === "string" ? "\"" + vContent.replace(/"/g, "\\$&") + "\"" : String(vContent);
    }
  };
}


// Source: http://stackoverflow.com/questions/497790
var dates = {
  convert: function (d) {
    // Converts the date in d to a date-object. The input can be:
    //   a date object: returned without modification
    //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
    //   a number     : Interpreted as number of milliseconds
    //                  since 1 Jan 1970 (a timestamp)
    //   a string     : Any format supported by the javascript engine, like
    //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
    //  an object     : Interpreted as an object with year, month and date
    //                  attributes.  **NOTE** month is 0-11.

    return (
      d.constructor === Date ? d :
      d.constructor === Array ? new Date(d[0], d[1], d[2]) :
      d.constructor === Number ? new Date(d) :
      d.constructor === String ? new Date(d) :
      typeof d === "object" ? new Date(d.year, d.month, d.date) :
      NaN
    );
  },

  compare: function (a, b) {
    // Compare two dates (could be of any type supported by the convert
    // function above) and returns:
    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    // NaN : if a or b is an illegal date
    // NOTE: The code inside isFinite does an assignment (=).
    return (
      isFinite(a = this.convert(a).valueOf()) &&
      isFinite(b = this.convert(b).valueOf()) ?
      (a > b) - (a < b) :
      NaN
    );
  },

  inRange: function (d, start, end) {
    // Checks if date in d is between dates in start and end.
    // Returns a boolean or NaN:
    //    true  : if d is between start and end (inclusive)
    //    false : if d is before start or after end
    //    NaN   : if one or more of the dates is illegal.
    // NOTE: The code inside isFinite does an assignment (=).
    return (
        isFinite(d = this.convert(d).valueOf()) &&
        isFinite(start = this.convert(start).valueOf()) &&
        isFinite(end = this.convert(end).valueOf()) ?
        start <= d && d <= end :
        NaN
      );
  }
};


var Semantha = {
  data: {},
  NLPServicePrefix:"semantha/NLPService?requestQuery=",


  onLoad: function () {
    //Check if a browser supports speech feature then make the divs visible else hidden
    if (document.createElement('input').webkitSpeech != undefined) {
      //Speech support
      $("#div_micBtnContainer").show();
      $("#ip_travelRequest").css("padding-left","12px");
    }
    else {
      //no speech support
      $("#div_micBtnContainer").hide();
    }

    var closingByDefault = false,
        datePickerFrom = getLocalizedDatePickerDefaultStartDate(),
        datePickerTo = getLocalizedDatePickerDefaultEndDate(),
        continueWithoutDates = getLocalizedString('hotel-finder.continue-without-dates'),
        showNext = false,
        showPrev = false;

    this.addEventToDP();
    
    adjustWidthBasedOnPlaceholder( $("#ip_hotelRefine") );
    
    $("#ip_dpfrom").datepicker({
      numberOfMonths: 2,
      minDate: 0,
      maxDate: '+499d',
      showButtonPanel: true,
      altField:'#ip_dpfromShow',

      afterShow: function (input, inst, td) {
        Semantha.markSelectedDate(inst, td);
      },

      beforeShow: function (input) {
        setTimeout(function () {
          var buttonPane = $(input).datepicker("widget").find(".ui-datepicker-buttonpane");
          buttonPane.html("");
          var btn = $('<button class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" type="button">' + continueWithoutDates + '</button>');
          btn.unbind("click").bind("click", function () {
            $.datepicker._clearDate(input);
            
            //Set the orange shadow on date input once the date field is cleared
            $("#ip_dpfrom").addClass('chooseDate');
            $("#ip_dpfromShow").addClass('chooseDate'); 
            $("#ip_dpto").addClass('chooseDate');
            $("#ip_dptoShow").addClass('chooseDate');

            $("#ip_dpfrom").val(datePickerFrom);
            $("#ip_dpto").val(datePickerTo);
            $("#ip_dpfromShow").val(datePickerFrom);
            $("#ip_dptoShow").val(datePickerTo);
            $("#ip_dpfromShow").css('color','#999');
            $("#ip_dptoShow").css('color','#999');
            showNext = false;
            showPrev = false;

            setTravelRequestWidth();
            Semantha.renderHotelDetail();
          });

          btn.appendTo(buttonPane);

        }, 1);
      },

      onChangeMonthYear: function (input) {
        setTimeout(function () {
          var buttonPane = $(input).datepicker("widget").find(".ui-datepicker-buttonpane");
          buttonPane.html("");
          var btn = $('<button class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" type="button">' + continueWithoutDates + '</button>');
          btn.unbind("click").bind("click", function () {
            $.datepicker._clearDate(input);
            
            //Set the orange shadow on date input once the date field is cleared
            $("#ip_dpfrom").addClass('chooseDate');
            $("#ip_dpfromShow").addClass('chooseDate'); 
            $("#ip_dpto").addClass('chooseDate');
            $("#ip_dptoShow").addClass('chooseDate');

            $("#ip_dpto").val(datePickerTo);
            $("#ip_dptoShow").val(datePickerTo);
            $("#ip_dptoShow").css('color','#999');
            showNext = false;
            showPrev = false;
            closingByDefault = false;
            setTravelRequestWidth();
            Semantha.renderHotelDetail();
            //$("#testform").submit();
          });

          btn.appendTo(buttonPane);

        }, 1);
      },

      onSelect: function (date) {
        //Remove  the orange shadow on date input once the date field is clicked on
        $("#ip_dpfrom").removeClass('chooseDate');
        $("#ip_dpfromShow").removeClass('chooseDate');  
        $("#ip_dpto").removeClass('chooseDate');
        $("#ip_dptoShow").removeClass('chooseDate');

        
        var date2 = Date.parse($("#ip_dpto").val());
        var date1 = Date.parse(date);
        if (isNaN(date1)) { $(this).val(''); return; }
        var d1 = new Date(date1);
        var d2;
        if (!isNaN(date2)) {
          d2 = new Date(date2);
          var sp = new TimeSpan(d2 - d1);
          if ((new Date(d2)) <= d1 || sp.days() > 28) {
            showNext = true;
            $("#ip_dpto").val(datePickerTo);
            $("#ip_dptoShow").val(datePickerTo);
            $('#ip_dptoShow').css('color','#999');
            return;
          }
          showNext = false;
          $('#ip_dpfromShow').css('color','#222');
        }
        else {
          showNext = true;
          return;
        }
        showNext = false;
        setTravelRequestWidth();
        Semantha.renderHotelDetail();
        if (Semantha.validateDate(d1, d2))
        {
          // renderHotel();
           
        }


      },

      onClose: function () {
        //("#testform").validate().element("#dpfrom");
        //Once calendar is closed check if date was selected. If not highlight showing orange shadow
        if($("#ip_dpfrom").val().indexOf('/') == -1) {
          $("#ip_dpfrom").addClass('chooseDate');
          $("#ip_dpfromShow").addClass('chooseDate'); 
          $("#ip_dpto").addClass('chooseDate');
          $("#ip_dptoShow").addClass('chooseDate');
        }

        if (showNext) {
          var date1 = Date.parse($("#ip_dpfrom").val());
          if (isNaN(date1)) { $(this).val(''); return; }
          //$("#dpfrom").datepicker('destory');

          setTimeout(function () {
            var checkinDate = new Date($("#ip_dpfrom").val());
            var checkoutDate = new Date(checkinDate.getFullYear(), checkinDate.getMonth(), checkinDate.getDate() + 1);
            $("#ip_dpto").datepicker("setDate", checkoutDate);
            $("#ip_dpfromShow").css('color', '#222');                    
            $("#ip_dpto").focus();
            $("#ip_dpto").click();                   

             closingByDefault = true;                 

            setTravelRequestWidth();
          }, 100);
        }
        else {
          if (closingByDefault) {
            $('#ip_dpfromShow').css('color', '#222');
            $('#ip_dptoShow').css('color', '#222');
            setTravelRequestWidth();
            Semantha.renderHotelDetail();
             
          }                
        }
         
         
        showNext = false;
      }
    });
    /* end from data picker*/

    $('#ip_dpfromShow').click(function(evt){
      //Remove the orange shadow on date input once the date field is clicked
      $("#ip_dpfrom").removeClass('chooseDate');
      $("#ip_dpfromShow").removeClass('chooseDate');  
      $("#ip_dpto").removeClass('chooseDate');
      $("#ip_dptoShow").removeClass('chooseDate');

      evt.preventDefault();
      $(this).blur();

        setTimeout(function(){
          //$("#dpto").datepicker('show');

          if($("#ip_dpfrom").val()==datePickerFrom){

            $("#ip_dpfrom").val('').val(datePickerFrom);
            $("#ip_dpfromShow").css('color','#999');
          }else{
            $("#ip_dpfrom").datepicker("setDate",$("#ip_dpfrom").val());
          }

          $("#ip_dpfrom").focus();
          $("#ip_dpfrom").click();
          setTravelRequestWidth();
          },100);
      });

    $("#ip_dpto").datepicker({

      numberOfMonths: 2,
      minDate: 0,
      maxDate: '+500d',
      showButtonPanel: true,
      altField:'#ip_dptoShow',

      afterShow: function (input, inst, td) {
        Semantha.markSelectedDate(inst, td);
      },

      beforeShow: function (input) {
        setTimeout(function () {
          var buttonPane = $(input).datepicker("widget").find(".ui-datepicker-buttonpane");
          buttonPane.html("");
          var btn = $('<button class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" type="button">' + continueWithoutDates + '</button>');
          btn.unbind("click").bind("click", function () {
            $.datepicker._clearDate(input);
            
             //Set the orange shadow on date input once the date field is cleared
            $("#ip_dpfrom").addClass('chooseDate');
            $("#ip_dpfromShow").addClass('chooseDate'); 
            $("#ip_dpto").addClass('chooseDate');
            $("#ip_dptoShow").addClass('chooseDate');

            $("#ip_dpfrom").val(datePickerFrom);
            $("#ip_dpto").val(datePickerTo);
            $("#ip_dpfromShow").val(datePickerFrom);
            $("#ip_dptoShow").val(datePickerTo);
            $("#ip_dpfromShow").css('color','#999');
            $("#ip_dptoShow").css('color', '#999');
            closingByDefault = false;
            setTravelRequestWidth();
            Semantha.renderHotelDetail();
            //$("#testform").submit();
          });

          btn.appendTo(buttonPane);

        }, 100);
      },

      onChangeMonthYear: function (input) {
        setTimeout(function () {
          var buttonPane = $(input).datepicker("widget").find(".ui-datepicker-buttonpane");
          buttonPane.html("");
          var btn = $('<button class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" type="button">' + continueWithoutDates + '</button>');
          btn.unbind("click").bind("click", function () {
            $.datepicker._clearDate(input);
            
            //Set the orange shadow on date input once the date field is cleared
            $("#ip_dpfrom").addClass('chooseDate');
            $("#ip_dpfromShow").addClass('chooseDate'); 
            $("#ip_dpto").addClass('chooseDate');
            $("#ip_dptoShow").addClass('chooseDate');

            $("#ip_dpto").val(datePickerTo);
            $("#ip_dptoShow").css('color','#999');
            setTravelRequestWidth();
            Semantha.renderHotelDetail();
            //$("#testform").submit();
          });

          btn.appendTo(buttonPane);

        }, 1);
      },

      onSelect: function (date) {
        //Remove the orange shadow on date input once the date field is clicked on
        $("#ip_dpfrom").removeClass('chooseDate');
        $("#ip_dpfromShow").removeClass('chooseDate');  
        $("#ip_dpto").removeClass('chooseDate');
        $("#ip_dptoShow").removeClass('chooseDate');

        if ($("#ip_dpto").val() == "") return;
        var date1 = Date.parse($("#ip_dpfrom").val());
        var d2 = new Date(Date.parse(date));
        var d1;
        if (!isNaN(date1)) {
          var d1 = new Date(date1);
          var sp = new TimeSpan(d2 - d1);
          if ((d2 <= d1) || (sp.days() > 28)) {
            showPrev = true;
            $("#ip_dpfrom").val(datePickerFrom);
            $("#ip_dpfromShow").val(datePickerFrom);
            $("#ip_dpfromShow").css('color','#999');
            return;
          }
          showPrev = false;
        }
        else {
          showPrev = true;
          return;
        }
        showPrev = false;
        showNext = false;
        closingByDefault = false;
        setTravelRequestWidth();
        Semantha.renderHotelDetail();
        if (Semantha.validateDate(d1, d2))
        {
           
        }

      },

      onClose: function () {
        //Once calendar is closed check if date was selected. If not highlight showing orange shadow
        if($("#ip_dpto").val().indexOf('/') == -1) {
          $("#ip_dpfrom").addClass('chooseDate');
          $("#ip_dpfromShow").addClass('chooseDate'); 
          $("#ip_dpto").addClass('chooseDate');
          $("#ip_dptoShow").addClass('chooseDate');
        }
        if (showPrev) {
          var checkoutDate = new Date($("#ip_dpto").val());
          var checkinDate = new Date(checkoutDate.getFullYear(), checkoutDate.getMonth(), checkoutDate.getDate() - 1);
          $("#ip_dpfrom").datepicker("setDate", checkinDate);

          $("#ip_dpfrom").focus();
          $("#ip_dpfrom").click();
          $('#ip_dpfromShow').css('color', '#999');

          closingByDefault = true;
          setTravelRequestWidth();
           
        }
        else {
          if (closingByDefault) {
            setTravelRequestWidth();
            Semantha.renderHotelDetail();
            $('#ip_dpfromShow').css('color', '#222');
            $('#ip_dptoShow').css('color', '#222');
          }
        }

        var date1 = Date.parse($("#ip_dpto").val());
        if (!isNaN(date1)) {
          $("#ip_dptoShow").css('color','#222');
        }            

        showPrev = false;
      }
    });
    /* end to date picker */

    $('#ip_dptoShow').click(function(evt){
      evt.preventDefault();
      $(this).blur();
      //Remove the orange shadow on date input once the date field is clicked
      $("#ip_dpfrom").removeClass('chooseDate');
      $("#ip_dpfromShow").removeClass('chooseDate');  
      $("#ip_dpto").removeClass('chooseDate');
      $("#ip_dptoShow").removeClass('chooseDate');

      //console.log('dpfromShow focus and click next');
      setTimeout(function(){
        //$("#dpto").datepicker('show');

        if($("#ip_dpto").val()==datePickerTo){

          $("#ip_dpto").val('').val(datePickerTo);
        }else{
            $("#ip_dpto").datepicker("setDate",$("#ip_dpto").val());
        }



          $("#ip_dpto").focus();
          $("#ip_dpto").click();
          setTravelRequestWidth();
          },100);
      });

    $("#ip_dpfrom").live("change", function () {
      var date1 = Date.parse($("#ip_dpfrom").val());
      if (isNaN(date1)) {
        $("#ip_dpfrom").val(datePickerFrom);
        $("#ip_dpfromShow").val(datePickerFrom);
        $("#ip_dpfromShow").css("color","#999");
        $("#ip_dpfrom").focus();

        $("#ip_dpfrom").click();
        setTravelRequestWidth();
      }
    });

    $("#ip_dpto").live("change", function () {
      var date1 = Date.parse($("#ip_dpto").val());
      if (isNaN(date1)) {
        $("#ip_dpto").val(datePickerTo);
        $("#ip_dptoShow").val(datePickerTo);
        $("#ip_dptoShow").css("color","#999");
        $("#ip_dpto").focus();

        $("#ip_dpto").click();
        setTravelRequestWidth();
      }
    });

    $("#ip_dpfrom").live("focus", function () {
      showNext = false;
      showPrev = false;
    });

    $("#ip_dpto").live("focus", function () {
      showNext = false;
      showPrev = false;
    });
    
    var dpFromDate = getURLParameter('arrivalDate');
    if ( dpFromDate == undefined ) {
      dpFromDate = getAndRemoveSessionStorageKey("checkIn");
    }
    if ( dpFromDate != undefined && dpFromDate != '') {
      $("#ip_dpfrom").datepicker("setDate",dpFromDate);
      $("#ip_dpfromShow").css('color','#222');
    }
    
    var dpToDate = getURLParameter('departureDate');
    if ( dpToDate == undefined ) {
      dpToDate = getAndRemoveSessionStorageKey("checkOut");
    }
    if ( dpToDate != undefined && dpToDate != '' ) {
      $("#ip_dpto").datepicker("setDate",dpToDate);
      $("#ip_dptoShow").css('color','#222');
    }
    
    // Now adjust the size of the date pickers.
    // Add an extra 2 (a small random number) to the size to accomodate for certain
    // alphabets that need a bit more room to display. For example 'D' versus 'l'.
    var dpFromSize = $("#ip_dpfrom").val().length + 2;
    $("#ip_dpfrom").attr( 'size', dpFromSize );
    $("#ip_dpfromShow").attr( 'size', dpFromSize );
    
    var dpToSize = $("#ip_dpto").val().length + 2;
    $("#ip_dpto").attr( 'size', dpToSize );
    $("#ip_dptoShow").attr( 'size', dpToSize );
  },

  addEventToDP: function () {
    $.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker;
    $.datepicker._updateDatepicker = function (inst) {
      $.datepicker._updateDatepicker_original(inst);
      var afterShow = this._get(inst, 'afterShow');
      if (afterShow)
        afterShow.apply((inst.input ? inst.input[0] : null),
          [(inst.input ? inst.input.val() : ''), inst, inst.dpDiv.find('td:has(a)')]);
    }
  },

  validateDate: function (date1, date2) {
    //            var d1 = Date.parse($("#dpfrom").val());
    //            var d2 = Date.parse($("#dpto").val());
    //            var date2 = new Date(d2);
    //            var date1 = new Date(d1);
    var today = new Date();
    var limitDate = new Date();
    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    if (dates.compare(date1, today) < 0) return false;

    //limitDate = new Date(limitDate.setDate(date1.getDate()+28));
    limitDate = new Date(date1.getTime() + 28 * 24 * 60 * 60 * 1000);

    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    if (dates.compare(limitDate, date2) < 0) return false;
    //limitDate = new Date(limitDate.setDate(today.getDate()+329));
    limitDate = new Date(today.getTime() + 329 * 24 * 60 * 60 * 1000);
    if (dates.compare(date1, limitDate) > 0) return false;
    //limitDate = new Date(limitDate.setDate(today.getDate()+330));
    limitDate = new Date(today.getTime() + 330 * 24 * 60 * 60 * 1000);
    if (dates.compare(date2, limitDate) > 0) return false;
    return true;
  }, 

  getDateFromTD: function (s) {
    var year = $(s).attr("data-year");
    var month = parseInt($(s).attr("data-month")) + 1;
    var day = $(s).find("a").text();
    var date1 = new Date(Date.parse(month + "/" + day + "/" + year));
    return date1;
  }, 

  compareDate: function (date1, date2) {
    return dates.compare(date1, date2);
  },

  markSelectedDate: function (inst, td) {
    //$(".ui-state-highlight").attr("class", "ui-state-default");
    //if (inst.currentYear == 0) return;
    var d1 = Date.parse($("#ip_dpfrom").val());
    var d2 = Date.parse($("#ip_dpto").val());

    td.each(function () {

      var tddate = Semantha.getDateFromTD(this);
      //console.log("tddate:"+tddate);
      if (!isNaN(d1)) {
        var date1 = new Date(d1);

        if (Semantha.compareDate(tddate, date1) == 0) {
          // console.log("date1:" + date1);
          $(this).attr("class", "ui-datepicker-current-day");
          $(this).context.children[0].className = "ui-state-default ui-state-active";
        }
      }

      if (!isNaN(d2)) {
        var date2 = new Date(d2);

        if (Semantha.compareDate(tddate, date2) == 0) {
          //console.log("date2:" + date2);
          $(this).attr("class", "ui-datepicker-current-day");
          $(this).context.children[0].className = "ui-state-default ui-state-active";
        }
      }

      if ((!isNaN(d1)) && (!isNaN(d2))) {
        var date2 = new Date(d2);
        var date1 = new Date(d1);

        if (Semantha.compareDate(tddate, date1) >= 0 && Semantha.compareDate(tddate, date2) <= 0) {
          //console.log("date1+date2:" + date1 + date2);
          $(this).attr("class", "ui-datepicker-current-day");
          $(this).context.children[0].className = "ui-state-default ui-state-active";
        }
      }
    });
  },

  renderHotelDetail: function(){
    if(typeof(HotelDetail) != 'undefined'){
      var dpFrom = $("#ip_dpfrom").val();
      var dpTo = $("#ip_dpto").val();

      if(dpFrom == getLocalizedDatePickerDefaultStartDate() || dpTo == getLocalizedDatePickerDefaultEndDate())  {
        HotelDetail("","");
      }else{
        HotelDetail(dpFrom,dpTo);
      }
    }else{
      renderHotel(true);
    }
  }
};
