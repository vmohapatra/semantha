/*
 * TipTip
 * Copyright 2010 Drew Wilson
 * www.drewwilson.com
 * code.drewwilson.com/entry/tiptip-jquery-plugin
 *
 * Version 1.3   -   Updated: Mar. 23, 2010
 *
 * This Plug-In will create a custom tooltip to replace the default
 * browser tooltip. It is extremely lightweight and very smart in
 * that it detects the edges of the browser window and will make sure
 * the tooltip stays within the current window size. As a result the
 * tooltip will adjust itself to be displayed above, below, to the left 
 * or to the right depending on what is necessary to stay within the
 * browser window. It is completely customizable as well via CSS.
 *
 * This TipTip jQuery plug-in is dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */


function deactive_tiptip() {
	if ($("#tiptip_holder"))
		$("#tiptip_holder").hide();

}

function deactive_click_tiptip() {
	if ($("div[name='tiptip_holder_click']"))
	{
		$("div[name='tiptip_holder_click']").hide();
	}
	$(".searchsItem").removeClass("resultItemSelected");
}

function active_tiptip(opts, org_title, tiptip_holder, tiptip_content, tiptip_arrow) {
	var timeout = false;
	var org_elem = opts.target;
	tiptip_content.html(org_title);
	tiptip_holder.hide().removeAttr("class").css("margin", "0");
	tiptip_arrow.removeAttr("style");

	var top = parseInt(org_elem.offset()['top']);
	var left = parseInt(org_elem.offset()['left']);
	var org_width = parseInt(org_elem.outerWidth());
	var org_height = parseInt(org_elem.outerHeight());
	var tip_w = tiptip_holder.outerWidth();
	var tip_h = tiptip_holder.outerHeight();
	var w_compare = Math.round((org_width - tip_w) / 2);
	var h_compare = Math.round((org_height - tip_h) / 2);
	var marg_left = Math.round(left + w_compare);
	var marg_top = Math.round(top + org_height + opts.edgeOffset);
	var t_class = "";
	var arrow_top = "";
	var arrow_left = Math.round(tip_w - 12) / 2;

	var win_width = $(window).width();
	var win_height = $(window).height();
	var result_list_width = $('#div_resultsListContainer').outerWidth();
	var visual_map_width = win_width - result_list_width;
	var header_height = parseInt($("#div_headerContainer").outerHeight() + $(".filterBarContainer").outerHeight());

	if (opts.defaultPosition == "bottom") {
		t_class = "_bottom";
	} else if (opts.defaultPosition == "top") {
		t_class = "_top";
	} else if (opts.defaultPosition == "left") {
		t_class = "_left";
	} else if (opts.defaultPosition == "right") {
		t_class = "_right";
	}

	var right_compare = (w_compare + left) < parseInt($(window).scrollLeft());
	var left_compare;
	if (opts.target.attr("class")=="poi")
	{
		left_compare = (tip_w + left + org_width) > visual_map_width;
	} else {
		left_compare = (360 + left + org_width) > visual_map_width;
	}

	if ((right_compare && w_compare < 0) || (t_class == "_right" && !left_compare) || (t_class == "_left" && left < (tip_w + opts.edgeOffset + 5))) {
		t_class = "_right";
		arrow_top = Math.round(org_height - 8);
		if (arrow_top > tip_h - 12 )
		{
			arrow_top = arrow_top;
		}
		arrow_left = 0;
		if (tiptip_holder.attr("id") == "tiptip_holder") {
			marg_left = Math.round(left + org_width / 2 + opts.edgeOffset + 8) + 12;
			marg_top = Math.round(top + org_height - 6);
		} else {
			marg_left = Math.round(left + org_width / 2 + opts.edgeOffset + 8) + 4;
			marg_top = Math.round(top + org_height - 8) - 1;
		}
	} else if ((left_compare && w_compare < 0) || (t_class == "_left" && !right_compare)) {
		t_class = "_left";
		arrow_top = Math.round(org_height - 8);
		if (arrow_top > tip_h - 12 )
		{
			arrow_top = arrow_top - 10;
		}
		arrow_left = Math.round(tip_w) -5;
		if (tiptip_holder.attr("id") == "tiptip_holder") {
			marg_left = Math.round(left - (tip_w + opts.edgeOffset) + org_width / 2 - 10 ) - 12;
			marg_top = Math.round(top + h_compare);
		} else {
			marg_left = Math.round(left - (tip_w + opts.edgeOffset) + org_width / 2 - 10 ) - 4;
			marg_top = Math.round(top + h_compare) - 1;
		}
		
	}

	/*
    var top_compare = (top + org_height + opts.edgeOffset + tip_h + 8) > parseInt($(window).height() + $(window).scrollTop());
    var bottom_compare = ((top + org_height) - (opts.edgeOffset + tip_h + 8)) < 0;

    if (top_compare || (t_class == "_bottom" && top_compare) || (t_class == "_top" && !bottom_compare)) {
        if (t_class == "_top" || t_class == "_bottom") {
            t_class = "_top";
        } else {
            t_class = t_class;
        }

        marg_top = Math.round(top + h_compare);

    } else if (bottom_compare || (t_class == "_top" && bottom_compare) || (t_class == "_bottom" && !top_compare)) {
        if (t_class == "_top" || t_class == "_bottom") {
            t_class = "_bottom";
        } else {
            t_class = t_class;
        }
        marg_top = Math.round(top + h_compare);
    }

	 */

	/*
    if (t_class == "_right_top" || t_class == "_left_top") {
    marg_top = marg_top + 5;
    } else if (t_class == "_right_bottom" || t_class == "_left_bottom") {
    marg_top = marg_top - 5;
    }
    if (t_class == "_left_top" || t_class == "_left_bottom") {
    marg_left = marg_left + 5;
    }
	 */
	marg_top = top - 6;
	arrow_top = arrow_top + 5;
	tiptip_arrow.css({ "margin-left": arrow_left + "px", "margin-top": arrow_top + "px" });
	tiptip_holder.css({ "margin-left": marg_left + "px", "margin-top": marg_top + "px" }).attr("class", "tip" + t_class).addClass("tiptip_holder");


	if ((marg_top < header_height) && ((marg_top + tip_h) <= win_height)) 
	{
		tiptip_content.css("top", header_height - marg_top + 4);
	} 
	else if ((marg_top + tip_h) > win_height) {
		tiptip_content.css("top", win_height - marg_top - tip_h -10 - 8);
	} 
	else {
		tiptip_content.css("top", 0);
	}

	tiptip_holder.show();
	//if (timeout) { clearTimeout(timeout); }
	//timeout = setTimeout(function () { tiptip_holder.stop(true, true).fadeIn(opts.fadeIn); }, opts.delay);	
}

(function($){
	$.fn.tipTip = function(options) {
		var defaults = { 
				activation: "hover",
				keepAlive: false,
				maxWidth: "200px",
				edgeOffset: 3,
				defaultPosition: "bottom",
				delay: 400,
				fadeIn: 200,
				fadeOut: 200,
				attribute: "title",
				content: false, // HTML or String to fill TipTIp with
				enter: function(){},
				exit: function(){},
				target:false,
				click:false
		};
		var opts = $.extend(defaults, options);

		// Setup tip tip elements and render them to the DOM
		if($("#tiptip_holder").length <= 0){             
			tiptip_holder = $('<div id="tiptip_holder" class="tiptip_holder" style="max-width:'+ opts.maxWidth +';"></div>');
			tiptip_content = $('<div id="tiptip_content" class="tiptip_content"></div>');
			tiptip_arrow = $('<div id="tiptip_arrow" class="tiptip_arrow"></div>');
			$("body").append(tiptip_holder.html(tiptip_content).prepend(tiptip_arrow.html('<div id="tiptip_arrow_inner" class="tiptip_arrow_inner"><span class="poptip-arrow"><em>&#9670;</em><i>&#9670;</i></span></div>')));
		}

		var tiptip_holder = $("#tiptip_holder");
		var tiptip_content = $("#tiptip_content");
		var tiptip_arrow = $("#tiptip_arrow");
		
		tiptip_holder.live("mouseover", function () {
			$(this).css("display","block");
		});
		tiptip_holder.live("mouseout", function () {
			$(this).css("display","none");
		});

		//CLICK
		if(opts.click)
		{
			deactive_click_tiptip();
			tiptip_holder.removeAttr("id");
			tiptip_content.removeAttr("id");
			tiptip_arrow.removeAttr("id");
			tiptip_holder.attr("name","tiptip_holder_click");
			tiptip_content.attr("name","tiptip_holder_click");
			tiptip_arrow.attr("name","tiptip_holder_click");
			tiptip_holder.css("z-index","1002");
			tiptip_holder.html(tiptip_content).prepend(tiptip_arrow.html('<div name="tiptip_arrow_inner_click" class="tiptip_arrow_inner"><span class="poptip-arrow"><em>&#9670;</em><i>&#9670;</i></span></div>'));

//			if($("div[name='tiptip_holder_click']").length==0)
//			{
//			tiptip_holder = $('<div name="tiptip_holder_click" class="tiptip_holder" style="display:block;max-width:'+ opts.maxWidth +';"></div>');
//			tiptip_content = $('<div name="tiptip_content_click" class="tiptip_content"></div>');
//			tiptip_arrow = $('<div name="tiptip_arrow_click" class="tiptip_arrow"></div>');
//			$("body").append(tiptip_holder.html(tiptip_content).prepend(tiptip_arrow.html('<div name="tiptip_arrow_inner_click" class="tiptip_arrow_inner"></div>')));
//			}
//			tiptip_holder=$("div[name='tiptip_holder_click']");
//			tiptip_content=$("div[name='tiptip_content_click']");
//			tiptip_arrow =  $("div[name='tiptip_arrow_click']");
		}
		//HOVER
		else
		{
			//if a click bubble is present, don't display the hover bubble
			var tiptipHolderClick = $("div[name='tiptip_holder_click']");
			if(tiptipHolderClick && tiptipHolderClick.is(':visible'))
			{
				return;
			}
		}


		if(opts.content){
			var org_title = opts.content;
		} else {
			var org_title = org_elem.attr(opts.attribute);
		}


		active_tiptip(opts,org_title,tiptip_holder,tiptip_content,tiptip_arrow);
		if(opts.click)
		{
			tiptip_holder.addClass("tiptip_holder_click");
		}
		opts.enter.call(this);
		opts.exit.call(this);
		return;


	}
})(jQuery);  	
