<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="text/javascript">
        (function() {
            var favIconSrc = "/resources/images/favicon.ico";
            var highResfavIconSrc = "/resources/images/favicon@2x.ico";
            var link = document.createElement('link');
            //link.type = 'image/x-icon';
            link.rel = 'shortcut icon';

            if(window.devicePixelRatio && window.devicePixelRatio>1)
            {
                link.href = highResfavIconSrc;
            }
            else
            {
                link.href = favIconSrc;
            }
            document.getElementsByTagName('head')[0].appendChild(link);
        }());
    </script>
    <!-- Styles -->
    <!--[if lte IE 8]>
    <style type="text/css">
        .headerShadow {
            filter: progid:DXImageTransform.Microsoft.Shadow(Color='gray', Direction=175, Strength=8);
        }
    </style>
    <![endif]-->
    <!--[if gt IE 8]>
    <link href="/resources/styles/normalize/normalize.css" rel="stylesheet">
    <link href="/resources/styles/bootstrap/bootstrap.min.css" rel="stylesheet">
    <![endif]-->
    <![if !IE]>
    <link href="/resources/styles/normalize/normalize.css" rel="stylesheet">
    <link href="/resources/styles/bootstrap//bootstrap.min.css" rel="stylesheet">
    <![endif]>
    <title>Finder</title>


    <!-- Script Statements start -->
    <script type="text/javascript" src="/resources/scripts/libs/jquery/jquery-1.8.3.min.js"></script>
    <!-- Script Statements start -->

    <!-- Style statements start -->
    <link href="/resources/styles/plugin-styles/jquery.ui.all.css" rel="stylesheet" type="text/css" />
    <link href="/resources/styles/general/tipTip.css?" rel="stylesheet" type="text/css" />
    <link href="/resources/styles/plugin-styles/jquery.qtip.min.css" rel="stylesheet" type="text/css" />
    <link href="/resources/styles/general/XMLDisplay.css" rel="stylesheet" type="text/css" />
    <link href="/resources/styles/pages/settingsContainer.css" rel="stylesheet" type="text/css" />
    <link href="/resources/styles/pages/hotelfinder.css" rel="stylesheet" type="text/css" />
    <!--[if IE 9]>
    <link href="/resources/styles/sphinx/custom-main.css" rel="stylesheet" type="text/css" />
    <link href="/resources/styles/sphinx/custom-ie9.css" rel="stylesheet" type="text/css" />
    <link href="/resources/styles/sphinx/custom-responsive.css" rel="stylesheet" type="text/css" />
    <![endif]-->
    <![if !IE]>
    <link href="/resources/styles/semantha/custom-main.css" rel="stylesheet" type="text/css" />
    <link href="/resources/styles/semantha/custom-responsive.css" rel="stylesheet" type="text/css" />

    <!--[if lt IE 9]>
    <link href="/resources/styles/sphinx/custom-ie8.css" rel="stylesheet" type="text/css" />
    <![endif]-->
    <!-- Style Statements end -->

</head>
<body>
<div id="div_pageWrapper" class="pageWrapper">
    <div id="div_pageHeader" class="pageHeader"><tiles:insertAttribute name="header" ignore="true" /></div>
    <div id="div_pageBody" class="pageBody">

        <input id="ip_reviewSummaryHost" type="hidden" name="reviewSummaryHost" value="${reviewSummaryHost}" />
        <div id="div_context" style="display:none"><%=request.getContextPath()%></div>
        <div class="search-header-container">
            <div id="div_headerContainer" style="position:relative;">
                <div id="div_searchBlockContainer" class="searchBlock">
                    <div id="div_searchBlockInnerContainer" class="searchBlockInner clearfix">
                        <div class="floatL logoContainer"><a id="lnk_logo" class="logo floatL" onclick='window.location.href="/finder"'></a></div>
                        <div id="div_searchCriteria" class="searchCriteria floatL">
                            <div id="div_input" class="inputcontainer">
                                <label id="lbl_searchText"></label>
                                <label id="lbl_englishOnlySearchText"></label>
                                <input id="ip_defaultSearchTxt" type="hidden" value="${default_search_text}" />
                                <input id="ip_englishOnlySearchTxt" type="hidden" value="${englishonly_search_text}" />
                                <input id="ip_travelRequest" class="inputbox jq_watermark menuItem" placeholder="${default_search_text}" type="text" spellcheck="false" />
                                <div id="div_roundEdgeContainer" class="roundEdgeForIE9">
                                    <a id="lnk_search" class="blueButton search" onclick="searchIconClick();">
                                        <span class="spn_search"></span>
                                    </a>
                                    <a id="lnk_nosearch" class="blueButton search">
                                        <span class="spn_search"></span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div id="div_parsePopup">
                            <div id="div_parsePopupStyleContainer">
                                <h3 id="hdr_parsePopupContainer" color="#222 "style="margin-bottom:5px;">
                                    <span id='spn_semanthaVersionLabel'>Semantha:</span> <span id='spn_semanthaVersion'>${version}</span><br/>
                                    <span id='spn_nautilusVersionLabel'>Nautilus:</span> <span id='spn_nautilusVersion'></span><br/>
                                    <span id='spn_gemmaVersionLabel'>Gemma:</span> <span id='spn_gemmaVersion'></span>
                                </h3>
                                <div id="div_parseHeader">Semantha Parse</div>
                                <div id="div_originalParseHeader">Raw Nautilus</div>
                            </div>
                            <div id="div_parseContent"></div>
                            <div id="div_originalParse"></div>
                        </div>
                        <div id="div_datepicker" class="dpContainer floatL" >
                            <div id="div_dpFromContainer" class="dpfromDiv floatL">
                                <label id="lbl_datePickerDefaultStartDate"></label>
                                <input id="ip_dpfrom" type="text" value="${datePickerDefaultStartDate}" />
                                <input id="ip_dpfromShow" type="text" class="waterMarker menuItem" value="${datePickerDefaultStartDate}" />
                            </div>
                            <div id="div_startDateSeperatorContainer" class="dpT0Txt floatL">
                                <label id="lbl_startDateSeparator"></label>
                            </div>
                            <div id="div_datePickerToContainer" class="dpToDiv floatL">
                                <label id="lbl_datePickerDefaultEndDate"></label>
                                <input id="ip_dpto" type="text" value="${datePickerDefaultEndDate}" />
                                <input id="ip_dptoShow" type="text" class="waterMarker menuItem" value="${datePickerDefaultEndDate}" />
                            </div>
                        </div>
                        <div id="div_roomSelect" class="roomSelectContainer floatL">
                            <a id="lnk_roomSelect">
                                <span id="spn_roomSelectDownIcon" class="downIcon"></span>
                                <span class="roomSelectText menuItem" id="spn_roomSelect">
                                    <label id="lbl_roomGuestSummarySingle"></label>
                                    <label id="lbl_roomGuestNumber"></label>
					            </span>
                            </a>
                        </div>

                        <div id="div_settingsContainer" class="settingsContainer floatR menuItem">
                            <a id="lnk_settingsContainer" >
                                <span id="spn_settingsGearIcon" class="gearIcon"></span>
                            </a>
                        </div>
                        <div id="div_viewLanguageContainer" class="roomSelectContainer floatR">
                            <a id="lnk_viewLanguage">
                                <span id="spn_viewLangDownIcon" class="downIcon"></span>
                                <span class="roomSelectText menuItem" id="spn_viewLanguage">
			<label id="lbl_viewLanguage">EN</label><br />
		</span>
                            </a>
                        </div>
                        <div id="div_viewReservationsContainer" class="roomSelectContainer floatR">
                            <a id="lnk_viewReservation">
                                <span id="spn_viewReservationDownIcon" class="downIcon"></span>
                                <span class="roomSelectText menuItem" id="spn_viewReservation">
			<label id="lbl_viewReservation"></label><br />
		</span>
                            </a>
                        </div>
                        <div id="div_feedbackDialog" class="settingsDialog" style="display:none">
                            <div id="div_customerService" style="margin-bottom: 31px;">
                                <h1 id="hdr_CustomerService"></h1>
                                <c:set var="supportEmail" value="bestsupport@aidep.com"/>
                                <c:set var="supportEmailElement">
                                    <span id="spn_supportEmail" class="hyperlink" onclick="mailTo('${supportEmail}?subject=Semantha BEST Booking Support Request')">${supportEmail}</span>
                                </c:set>
                                <c:set var="supportPhoneNumber1">
                                    <span id="spn_supportPhoneNumber_1" style="white-space: nowrap">1-866-539-8120</span>
                                </c:set>
                                <c:set var="supportPhoneNumber2">
                                    <span id="spn_supportPhoneNumber_2" style="white-space: nowrap">417-520-5306</span>
                                </c:set>

                            </div>
                            <div id="div_semanthaFeedback" style="margin-bottom: 31px;">
                                <h1 id="hdr_semanthaFeedback" ></h1>
                                <c:set var="feedbackEmail" value="semantha@aidep.com"/>
                                <span id="spn_feedbackEmail" class="hyperlink" onclick="mailTo('${feedbackEmail}?subject=Semantha Feedback')">${feedbackEmail}</span>
                            </div>
                            <div id="div_bestDiscount">
                                <h1 id="hdr_bestDiscount"></h1>
                            </div>
                        </div>
                        <div id="div_localeDialog" class="settingsDialog" style="display:none">
                            <h1 id="hdr_chooseLocale"></h1>
                            <ul id="ul_languages">
                                <li id="cs_CZ" data-langId="cs">
                                    <span id="spn_flag_CZ" class="">CS</span>
                                    <a id="lnk_select_CZ" onclick="selectLocale($(this))">&#268;esky</a>
                                </li>
                                <li id="da_DK" data-langId="da">
                                    <span id="spn_flag_DA" class="">DA</span>
                                    <a id="lnk_select_DA"  onclick="selectLocale($(this))">Dansk</a>
                                </li>
                                <li id="de_DE" data-langId="de">
                                    <span id="spn_flag_DE" class="">DE</span>
                                    <a id="lnk_select_DE"  onclick="selectLocale($(this))">Deutsch</a>
                                </li>
                                <li id="en_US" data-langId="en">
                                    <span id="spn_flag_US" class="">EN</span>
                                    <a id="lnk_select_US"  onclick="selectLocale($(this))">English</a>
                                </li>
                                <li id="es_ES" data-langId="es">
                                    <span id="spn_flag_ES" class="">ES</span>
                                    <a id="lnk_select_ES"  onclick="selectLocale($(this))">Espa&ntilde;ol</a>
                                </li>
                                <li id="fr_CA" data-langId="fr_CA">
                                    <span id="spn_flag_CA" class="">CF</span>
                                    <a id="lnk_select_CA"  onclick="selectLocale($(this))">Fran&ccedil;ais Canadien</a>
                                </li>
                                <li id="fr_FR" data-langId="fr">
                                    <span id="spn_flag_FR" class="">FR</span>
                                    <a id="lnk_select_FR"  onclick="selectLocale($(this))">Fran&ccedil;ais</a>
                                </li>
                                <li id="it_IT" data-langId="it">
                                    <span id="spn_flag_IT" class="">IT</span>
                                    <a id="lnk_select_IT"  onclick="selectLocale($(this))">Italiano</a>
                                </li>
                                <li id="no_NO" data-langId="nb">
                                    <span id="spn_flag_NO" class="">NO</span>
                                    <a id="lnk_select_NO"  onclick="selectLocale($(this))">Norsk</a>
                                </li>
                                <li id="sv_SE" data-langId="sv">
                                    <span id="spn_flag_SE" class="">SV</span>
                                    <a id="lnk_select_SE"  onclick="selectLocale($(this))">Svenska</a>
                                </li>
                            </ul>
                        </div>
                        <div id="div_currencyDialog" class="settingsDialog" style="display:none">
                            <h1 id="hdr_chooseCurrency" ></h1>
                            <ul id="ul_currency" >
                                <c:forEach var="entry" items="${currencies.getSupportedCurrencies(pageContext.response.locale).entrySet()}">
                                    <li id="${entry.value.currencyCode}" onclick="selectCurrency($(this))">${entry.key}</li>
                                </c:forEach>
                            </ul>
                        </div>


                        <p id="prg_searchMsg"></p>
                    </div>
                </div>
                <div id="div_settingsPopContainer" class="poptip">
                    <span id="spn_settingsPopTip" class="poptip-arrow poptip-arrow-top"><em>&#9670;</em><i>&#9670;</i></span>
                    <ul id="ul_settings">
                        <!--
			<li id="li_viewTripSummaries" >
				<a id="lnk_tripSummary" onclick="viewReservation();" target="_blank">
				</a>
			</li>
			<li id="li_chooseLocale">
				<span id="spn_localeFlagImg" class="flag flag_US"></span>
				<a id="lnk_locale" onclick="openSettingsDialog(event, $('#div_localeDialog'))">English</a>
			</li>
			-->
                        <li id="li_chooseCurrency">
                            <a id="lnk_currency" onclick="openSettingsDialog(event, $('#div_currencyDialog'))"></a>
                        </li>
                        <li id="li_feedback">
                            <a id="lnk_feedback" onclick="openSettingsDialog(event, $('#div_feedbackDialog'))"></a>
                        </li>
                        <li><a id="lnk_logout" href="logout">Logout</a></li>
                    </ul>
                </div>
            </div>
            <div id="div_filterBarOuterContainer" class="filterBarContainer">
                <div id="div_filterBarHeaderShadowContainer" class="filterBarInner headerShadow clearfix">
                    <div id="div_filterWrapperContainer" class="filterWrapper">
                        <div id="div_tagContainer">
                        </div>
                        <a id="lnk_priceFilterMenuItem" class="price filterLabel menuItem">
                            <span id="spn_priceFilterMenuSpan" class="menu-label"></span>
                            <span id="spn_priceGreyDownIcon" class="greyDownIcon"></span>
                        </a>
                        <a id="lnk_starFilterMenuItem" class="starRating filterLabel menuItem">
                            <span id="spn_starFilterMenuSpan" class="menu-label"></span>
                            <span id="spn_starGreyDownIcon" class="greyDownIcon"></span>
                        </a>
                        <a id="lnk_amenityiesFilterMenuItem" class="amenities filterLabel menuItem">
                            <span id="spn_amenitiesFilterMenuSpan" class="menu-label"></span>
                            <span id="spn_amenitiesGreyDownIcon" class="greyDownIcon"></span>
                        </a>
                        <a id="lnk_themesFilterMenuItem" class="themes filterLabel menuItem">
                            <span id="spn_themeFilterMenuSpan" class="menu-label"></span>
                            <span id="spn_themes" class="greyDownIcon"></span>
                        </a>

                        <input id="ip_hotelRefine" class="hotelName jq_watermark menuItem" type="text" placeholder="${hotelNameFilterDefaultText}" customPlaceholder="${hotelNameFilterDefaultText}" />
                        <!--<span id="spn_filterLabel" class="spanPlaceholder filterLabel"></span>-->
                        <div id="div_xsListToggleBtnContainer" class="visible-xs">
                            <!--<span id="spn_toggleShadowPlaceholder"></span>-->
                            <div id="div_xsListToggleBtn" data-toggle="offcanvas">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--Responsive Map and List Container-->
        <div id="div_mapAndListContainer" class="row no-margin map-list-container row-offcanvas row-offcanvas-right active">
            <!-- Map Container-->
            <div id="div_mapContainer" class="col-xs-12 col-sm-6 col-md-7 col-lg-8"></div>

            <!-- Results Container -->
            <div id="div_resultsContainer" class="col-xs-11 col-sm-6  col-md-5 col-lg-4 full-height no-padding sidebar-offcanvas">
                <!-- Semantha terms and privacy Container-->
                <div id="div_termsPrivacy">
                    <label id="lbl_termsPrivacy">

                    </label>
                    -
                    <a id="lnk_localTerms" href="resources/web/privacyterm/<%=response.getLocale()%>/user_term.html" target="_blank">

                    </a>
                    &
                    <a id="lnk_localPrivacy" href="resources/web/privacyterm/<%=response.getLocale()%>/privacy_statement.html" target="_blank">

                    </a>
                </div>

                <div id="div_resultsInfoContainer">
                    <div id="div_sort" class="floatR popRightAlign">
                        <a id="lnk_sortFilterTitle" class="sort filterLabel popRightAlign">
					<span id="spn_sortFilterTitle" class="sort-label menuItem" id="sortFilter">

					</span>
                            <span id="spn_sortGreyDownIcon" class="greyDownIcon"></span>
                        </a>
                    </div>
                    <div id="div_listCount">

                    </div>
                    <div id="div_priceUpdateNotice" class="priceUpdateNotice">

                    </div>
                </div>
                <div id="div_resultsListContainer">
                    <div id="div_resultsList"></div>
                </div>
                <div id="div_zeroCountComment" class="zeroCountComment">

                </div>

            </div>
            <div id="div_detailsPaneContainer" class="col-xs-11 col-sm-6  col-md-5 col-lg-4 full-height no-padding details-pane-container">
            </div>
        </div>
        <!-- -->
        <div id="div_hoverContent" class="hoverContent" style="display:none;">
            <div id="div_hoverTipHotelName"></div>
            <div id="div_hoverTipStarPrice">
                <span id="spn_hoverTipHotelStar"></span>
                <span id="spn_hoverTipReviewStar"></span>
                <span id="spn_hoverTipReviewCount"></span>
                <span id="spn_hoverTipHotelPrice"></span>
            </div>
        </div>
        <div id="div_poiName" class="hoverContent" style="display:none;"></div>
        <div id="div_roomGuestContainer" class="poptip">
	<span id="spn_poptipArrow" class="poptip-arrow poptip-arrow-top">
		<em id="em_popuptip">&#9670;</em><i id="i_popuptip">&#9670;</i>
	</span>
            <span id="spn_closeIcon" class="close-icon"></span>
            <form id="form_roomSelect" action= name="roomSelectForm">
                <fieldset id="fld_roomsGuests" >
                </fieldset>
                <div id="div_maxGuestCountWarning" class="boxedErrorOnWhite">

                </div>
                <ul id="ul_roomLinks">
                    <li id="li_roomLinkFloatL" class="floatL">
                        <a id="lnk_addRoom" href= class="addRoomsLink">

                        </a>
                    </li>
                    <li id="li_roomLinkFloatR" class="floatR">
                        <div id="div_roundEdgeForIE9" class="roundEdgeForIE9">
                            <a id="lnk_updateRoomGuest" class="blueButton updateButton grey">

                            </a>
                        </div>
                    </li>
                </ul>
                <%
                    if(request.getParameter("query")!=null)
                    {
//                        out.println("<script>$().ready(function() { $('#ip_travelRequest').val(\+request.getParameter('query')+'\');createTravelRequest('Manual', 'SearchBoxEnter'); });</script>");
                    }
                %>
            </form>
        </div>
        <div id="div_roomsTemplate" style="display:none">
            <div class="roomItem clearfix" id="div_roomRow_{sysRoomNumber}">
                <ul id="ul_roomGuestHeader" class="roomGuestsHeader clearfix">
                    <li id="li_roomLeftLabel">
                        <label id="lbl_roomLeft" class="leftLabel">&nbsp;</label>
                    </li>
                    <li id="li_ageRangeAdult" class="select">
                        <label id="lbl_roomAndGuestAdult">

                            <span id="spn_adultAgeRange">

					</span>
                        </label>
                    </li>
                    <li id="li_ageRangeChildren" class="select">
                        <label id="lbl_roomAndGuestChildren">

                            <span id="spn_childrenAgeRange">

					</span>
                        </label>
                    </li>
                </ul>
                <ul id="ul_roomNumLabel" class="clearfix">
                    <li id="li_roomNumLabel">
                        <label id="lbl_roomNum" class="roomNumLabel leftLabel">

                        </label>
                    </li>
                    <li id="li_adultCount" class="adult select">
                        <select class="adultsCount" name="rooms[{sysRoomNumber}].adultsCount" id="sel_rooms[{sysRoomNumber}].adultsCount">
                            <option value="1">1</option>
                            <option value="2" selected="selected">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                        </select>
                    </li>
                    <li id="li_childrenCount" class="children select">
                        <select name="rooms[{sysRoomNumber}].childrenCount" id="sel_rooms[{sysRoomNumber}].childrenCount">
                            <option value="0" selected="selected">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </li>
                    <li id="li_lastChild" class="lastChild">
                        <a id="lnk_removeRooms" class="remove-row" href=>

                        </a>
                    </li>
                </ul>
                <div id="div_childAgeContainer" class="childAge clearfix">
                    <label id="lbl_childerAge" class="leftLabel">

                    </label>
                    <select name="rooms[{sysRoomNumber}].children[0].age" id="sel_rooms[{sysRoomNumber}].children[0].age" disabled>
                        <option value=>?</option>
                        <option value="0">&lt;1</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                    </select>
                    <select name="rooms[{sysRoomNumber}].children[1].age" id="sel_rooms[{sysRoomNumber}].children[1].age" disabled>
                        <option value=>?</option>
                        <option value="0">&lt;1</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                    </select>
                    <select name="rooms[{sysRoomNumber}].children[2].age" id="sel_rooms[{sysRoomNumber}].children[2].age" disabled class="lastChild">
                        <option value=>?</option>
                        <option value="0">&lt;1</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                    </select>
                </div>
            </div>
        </div>
        <div id="div_amenitiesList" class="filterMenu">
            <ul id="ul_multiSelect" class="multiSelect">
                <li id="AIR_CONDITIONING"></li>
                <li id="ALL_INCLUSIVE"></li>
                <li id="li_hasSubBreakfast" class="hasSub">
                    <h4 id="hdr_amenitiesItemBreakfast"></h4>
                    <ul id="ul_breakfast">
                        <li id="BREAKFAST" name="Breakfast"></li>
                        <li id="FREE_BREAKFAST"></li>
                    </ul>
                </li>
                <li id="BUSINESS_CENTER"></li>
                <li id="FITNESS_CENTER"></li>
                <li id="li_hasSubInternet" class="hasSub">
                    <h4 id="hdr_amenitiesItemInternet"></h4>
                    <ul id="ul_internet">
                        <li id="INTERNET" name="Internet"></li>
                        <li id="FREE_Internet"></li>
                        <li id="WIFI"></li>
                    </ul>
                </li>
                <li id="li_hasSubParking" class="hasSub">
                    <h4 id="hdr_amenitiesItemParking"></h4>
                    <ul id="ul_parking">
                        <li id="PARKING" name="Parking"></li>
                        <li id="FREE_PARKING"></li>
                    </ul>
                </li>
                <li id="PET_FRIENDLY"></li>
                <li id="li_hasSubPool" class="hasSub">
                    <h4 id="h4_amenitiesItemPool"></h4>
                    <ul id="ul_pool">
                        <li id="POOL" name="Pool"></li>
                        <li id="INDOOR_POOL"></li>
                        <li id="OUTDOOR_POOL"></li>
                    </ul>
                </li>
                <li id="li_hasSubView" class="hasSub">
                    <h4 id="h4_amenitiesItemView"></h4>
                    <ul id="ul_view">
                        <li id="VIEW" name="View"></li>
                        <li id="OCEAN_VIEW"></li>
                    </ul>
                </li>
            </ul>
        </div>
        <div id="div_themesList" class="filterMenu">
            <ul id="ul_multiThemesSelect" class="multiSelect">
                <li id="AIRPORT"></li>
                <li id="BEACH" name="Beach"></li>
                <li id="li_hasSubBoutique" class="hasSub">
                    <h4 id="hdr_themesItemBoutique"></h4>
                    <ul id="ul_themesItemBoutique">
                        <li id="BOUTIQUE" name="Boutique"></li>
                        <li id="DESIGN"></li>
                    </ul>
                </li>
                <li id="BUSINESS"></li>
                <li id="CASINO"></li>
                <li id="COUNTRYSIDE"></li>
                <li id="FAMILY_FRIENDLY"></li>
                <li id="GOLF"></li>
                <li id="SUSTAINABLE"></li>
                <li id="HISTORIC"></li>
                <li id="LGBT_FRIENDLY"></li>
                <li id="LUXURY"></li>
                <li id="ROMANTIC"></li>
                <li id="SKI"></li>
                <li id="SPA"></li>
            </ul>
        </div>
        <div id="div_priceList" class="filterMenu">
            <ul class="singleSelect" id="ul_priceList">
                <li id="li_anyPrice">
                    <label id="lbl_priceFilterAnyPrice">
                    </label>
                    <span count='0'></span>
                </li>
            </ul>
        </div>
        <div id="div_starRatingList" class="filterMenu">
            <ul class="singleSelect" id ='ul_starRating'>
                <li id="anyStar"><label id="lbl_ratingFilterAnyRating"></label><span count="0"></span></li>
                <li id="star-5-5"><label id="lbl_ratingFilterFive"></label><span count="0"></span></li>
                <li id="star-4-5"><label id="lbl_ratingFilterFour"></label><span count="0"></span></li>
                <li id="star-3-5"><label id="lbl_ratingFilterThree"></label><span count="0"></span></li>
                <li id="star-2-5"><label id="lbl_ratingFilterTwo"></label><span count="0"></span></li>
            </ul>
            <p id="prg_startFooter"></p>
        </div>
        <div id="div_sortList" class="filterMenu">
            <ul id="ul_sortList" class="singleSelect">
                <li id="aidep_PICKS"><label id="lbl_sortItemPicks"></label></li>
                <li id="PRICE_ASCENDING"><label id="lbl_sortItemlowestPrice"></label></li>
                <li id="PRICE_DESCENDING"><label id="lbl_sortItemHighestPrice"></label></li>
                <li id="STAR_RATING_DESCENDING"><label id="lbl_sortItemRating"></label></li>
                <li id="HOTEL_NAME_ASCENDING"><label id="lbl_sortItemName"></label></li>
            </ul>
        </div>
        <div id="div_disambigDialog" class="settingsDialog" style="display:none">
            <h1 id="hdr_ambiguousResult"></h1>
            <div id="div_disambigOptionContainer">
                <ul id="ul_disambigOptions"></ul>
            </div>
            <div id="div_ambigFeedback"><span id='ambig_thumbup' class='thumbup thumbgreen'></span><span id='ambig_thumbdown' class='thumbdown thumbred'></span></div>
            <div id="div_ambigUp" style="display:none">
                <span id='ambigup_thumbup' class='thumbup thumbgreen'></span><span id='ambigup_thumbdown' class='thumbdown thumbblack'></span>
                <div id="div_ambigUpText" class="ambigTextAreaContainer clearfix">
                    <div><textarea id="ip_ambigfeedbackup" class="jq_watermark" spellcheck="false" placeholder="s"></textarea></div>
                    <div id="div_sendVoteButtonAmbigOuter1" class="roundEdgeForIE9 sendVoteButtonOuter"><a class="blueButton sendFeedbackButton" id="lnk_sendAmbig1">Send</a></div>
                </div>
            </div>
            <div id="div_ambigDown" style="display:none">
                <span id='ambigdown_thumbup' class='thumbup thumbblack'></span><span id='ambigdown_thumbdown' class='thumbdown thumbred'></span>\
                <div id="div_ambigDownText" class="ambigTextAreaContainer clearfix">
                    <div><textarea id="ip_ambigfeedbackdown" class="jq_watermark" spellcheck="false" placeholder=""></textarea></div>
                    <div id="div_sendVoteButtonAmbigOuter" class="roundEdgeForIE9 sendVoteButtonOuter"><a class="blueButton sendFeedbackButton" id="lnk_sendAmbig">Send</a></div>
                </div>
            </div>
            <div id="div_ambigFinal" style="display:none"></div>
        </div>
        <div id="div_nlpSupportedLangs" data="${supportedLocale}"></div>


        <!-- Script Statements start -->
        <script type="text/javascript" src="/resources/scripts/libs/jquery/ui/jquery-ui-1.8.23.custom.min.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/jquery/plugins/nanobar-v0.2.0.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/jquery/plugins/jquery.watermark-v1.3.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/jquery/plugins/jquery.layout-v1.3.0.min.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/xmldisplay/XMLDisplay.js" ></script>
        <script type="text/javascript" src="/resources/scripts/libs/jquery/plugins/jquery.tipTip-v1.3.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/jquery/plugins/jquery.qtip-v2.2.0.min.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/datetime/datetime-v1.1.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/date.format/date.format-v1.2.3.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/jquery/plugins/jquery.cookie-v1.3.1.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/jquery/plugins/jquery.lazyload-v1.9.3.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/utils/commonUtil.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/hotelFinder.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/utils/selectRoom.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/utils/filterMenu.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/utils/settingsContainer.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/mobile-detect/mobile-detect-v0.4.0.min.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/utils/browserUtils.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/jquery/ui/jquery.ui.datepicker-v1.0.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/handlebars/handlebars-v2.0.0.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/utils/handlebarsHelpers.js"></script>
        <script type="text/javascript" src="${googleMapApi}"></script>
        <!--<script type="text/javascript" src="/resources/scripts/Map-Full.js"></script>-->
        <!-- Lodash noConflict -->
        <script type="text/javascript" src="/resources/scripts/libs/lodash/lodash-v3.7.0.min.js"></script>
        <script>
            // Create global 'lodash', revert global '_' to old value
            var lodash = _.noConflict();
        </script>


        <!-- Backbone libs -->
        <script type="text/javascript" src="/resources/scripts/libs/underscore/underscore-v1.6.0.min.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/json2/json2-v1.0.2.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/backbone/backbone-v1.1.2.min.js"></script>
        <script type="text/javascript" src="/resources/scripts/libs/backbone/backbone.marionette-v2.1.0.min.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/utils/marionetteOverrides.js"></script>

        <!-- Backbone app files -->
        <script type="text/javascript" src="/resources/scripts/semantha/app.js"></script>
        <!-- Results list files -->
        <script type="text/javascript" src="/resources/scripts/semantha/models/ResultListItem.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/collections/ResultList.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/views/subviews/ResultListView.js"></script>

        <script type="text/javascript" src="/resources/scripts/semantha/views/Search.js"></script>

        <!-- Details pane files -->
        <script type="text/javascript" src="/resources/scripts/semantha/models/DetailsPaneItem.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/collections/DetailsPane.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/views/subviews/DetailsPaneView.js"></script>


        <!-- JS file containing the custom map style -->
        <script type="text/javascript" src="/resources/scripts/semantha/utils/mapStyle.js"></script>


        <!-- Semantha files -->
        <script type="text/javascript" src="/resources/scripts/mapui.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/utils/semanthaAttr.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/servicePlugins/Review.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/servicePlugins/Nautilus.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/servicePlugins/Gemma.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/servicePlugins/Capture.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/servicePlugins/HotelSearch.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/servicePlugins/PriceRange.js"></script>
        <script type="text/javascript" src="/resources/scripts/semantha/servicePlugins/HotelBrief.js"></script>


        <script>
            var Map = aidep.dmap.Map,
                Item = aidep.dmap.Item,
                ItemService = aidep.dmap.ItemService,
                LatLong = aidep.dmap.LatLong,
                Bounds = aidep.dmap.Bounds,
                Content = aidep.dmap.Content;
            /*
             * Overrides the selectCurrency() function defined in settingsContainer.js.
             *
             * For a currency change on the hotel finder page, a back end call is not
             * required because the prices are obtained from the DMaps service (client
             * side call) instead of EAN.
             */
            function selectCurrency(selected) {

                // Close the dialog box as we are done
                $('#div_currencyDialog').dialog('close');

                setCurrencyCode( selected.attr('id') );
                initializeCurrency();
                renderHotel(false);
                getPriceRange();
                $('#li_anyPrice').click();
            }

            $(document).ready(function () {

                $('[data-toggle=offcanvas]').click(function() {
                    if($('.details-pane-container').css('right')=="0px") {
                        $('.details-pane-container').css('margin-right','-90%');
                    }
                    else {
                        $('.details-pane-container').css('margin-right','0%');
                    }
                    $('.row-offcanvas').toggleClass('active');
                });

                // Call setNautilusVersion to set nautilus version for capture requests
                App.searchView.setNautilusVersion();

                //Utility function to find the size of a object by counting keys
                Object.size = function(obj) {
                    var size = 0, key;
                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) size++;
                    }
                    return size;
                };

                //Call to get serverData on document ready
                capture.fetchServerData();

            });
        </script>
        <!-- Script Statements end -->


        <!-- Handlebars Templates start -->
        <script type="text/x-handlebars-template" id="listItemHotelTemplate">
            <div class="hotel-hover-overlay"></div>
            <div class="hotel-info floatR">
                <div class="hover-btn blueButton floatR"><span class="hover-icon"></span></div>
                {{#isDatelessSearch}}
                {{#if itemPrice}}
                <div class="price-info floatR">
                    <h2 class="list-hotel-price">{{ itemFormattedPrice }}</h2>
                    <!--<h4 class='promo-date'>{{ itemStartDate }}</h4>
                    <h4 class='promo-date'>{{ dateSeparator }}</h4>
                    <h4 class='promo-date'>{{ itemEndDate }}</h4>-->
                </div>
                {{else}}
                <div class="price-info floatR">
                    {{!-- Limited availability --}}
                    <h4 class="no-room-txt floatR test">{{ i18n 'hotel-finder.limited-availability' }}</h4>
                </div>
                {{/if}}

                {{else}}
                {{#if itemPrice}}
                <div class="price-info floatR">
                    <h2 class="list-hotel-price full-price">{{ itemPrice.regularPrice }}</h2>
                    <h2 class="list-hotel-price discounted-price">{{ itemPrice.discountPrice }}</h2>
                </div>
                {{else}}
                <div class="price-info floatR">
                    {{!-- No availability --}}
                    <h4 class="no-room-txt floatR">{{ i18n 'hotel-finder.no-rooms' }}</h4>
                </div>
                {{/if}}

                {{/isDatelessSearch}}

                <!-- Review Score -->
                <div id="div_reviewScoreAndCount_h{{ itemaidepId }}" class="list-review-container">
                    {{#if itemReview }}
                    <span class="guestRating guestRating-lg">
                <span id="spn_reviewScore_h{{ itemaidepId }}" class="listStarValue {{ reviewStarRatingClass itemReview }}"></span>
            </span>
                    <p>
                        <span id="spn1_reviewCount_h{{ itemaidepId }}" class="reviewCount">{{ formatReviewCount itemReview.count }}</span>
                    </p>
                    {{else}}
                    <span id="spn_reviewCount_h{{ itemaidepId }}" class="reviewCount">{{ i18n 'hotel-finder.brief-content.no-reviews' }}</span>
                    {{/if}}
                </div>
                <div style="padding-left:10px;">
                    {{#if itemReasonToBelieve }}
                    <ul class="list-reasonToBelieve">{{{ formatReasonToBelieve itemReasonToBelieve itemaidepId }}}</ul>
                    {{/if}}
                </div>


            </div>
            <div class="hotel-thumb floatL">
                <!--<div id="div_hotel_{{ itemId }}" class="hotel-img floatL">{{{ handleImage itemImage itemId }}}</div>-->
                {{{ handleImage itemImage itemId }}}
            </div>
            <div class="hotel-name-starrating">
                <h3 class="hotel-name" title="{{ itemName }}">{{ itemName }}</h3>
                <div class="hotel-starrating">
            <span class="hotel-rating rating stars-lg ir">
            <span class="value stars{{{ formatStarRating itemStarRating }}}"></span>
            </span>
                </div>
            </div>

        </script>

        <script type="text/x-handlebars-template" id="listItemClusterTemplate">
            <div class="cluster-hover-overlay"></div>
            <div class="cluster-info floatR">
                <span class="hotelCount">{{localizedClusterSize itemSize}}</span>
            </div>
            <div id="thumb_{{ itemId }}" class="cluster-thumb floatL">
            </div>
            <div class="destination-name">
                <h3 class="destination-name" title="{{ itemName }}">{{itemShortName}}</h3>
            </div>

        </script>

        <script type="text/x-handlebars-template" id="listPartialDividerTemplate">
            <div id="results-list-partial-divider">
                {{{ i18n 'hotel-finder.results-list.partial-divider' }}}
            </div>
        </script>

        <script type="text/x-handlebars-template" id="detailsPaneItemTemplate">
            <div class="details-pane-nav clearfix">
                <div class="redirect-to-results-list full-height floatL" onclick="App.searchView.hideDetailsPane()" >&nbsp;<span class="details-pane-redirect-icon"></span>&nbsp;<span class="redirect-to-results-txt">{{{ i18n 'hotel-finder.brief-content.return-to-list' }}}</span></div>
                <div class="pane-results-info full-height floatL"></div>
                <div class="pane-prev-next full-height floatR"></div>
            </div>
            <div class="details-pane-content">
                <div class="details-pane-carousel-container">
                    {{#if currentHotelImage}}
                    <div class="pane-slide" style="background-image:url({{{handlePaneImage currentHotelImage}}})" ></div>
                    {{else}}
                    <div class="pane-no-photo" >{{{ i18n 'hotel-finder.brief-content.no-photo' }}}</div>
                    {{/if}}
                </div>
                {{#if currentHotelId}}
                {{#if currentHotelaidepId}}
                <div class="details-pane-name-starrating">
                    <h2>
                        <a id="lnk_detailsPaneHotelName" onclick="hoteldetails(&quot;{{currentHotelaidepId}}&quot;)" target="_blank">{{ currentHotelName }}</a>
                    </h2>
                    <span class="hotelRating rating stars-lg ir"><span class="value stars{{{formatStarRating currentHotelStarRating }}}"></span></span>
                </div>
                <div class="details-pane-price-redirect clearfix">
                    <div class="details-pane-price-info floatR">
                        {{#isDatelessSearch}}
                        {{{ chooseDateStringPane }}}
                        {{else}}
                        {{#if currentHotelDiscountPrice}}
                        <h2 class="full-price">{{ currentHotelFullPrice }}</h2>
                        <h1 class="discount-price">{{ currentHotelDiscountPrice }}</h1>
                        <span class="pane-employee-price-txt">{{{ i18n 'hotel-finder.brief-content.employee-rate' }}}</span>
                        {{else}}
                        {{{ hotelSoldOutStringPane }}}
                        {{/if}}
                        {{/isDatelessSearch}}
                    </div>
                    <div class="details-pane-redirect-btn floatR">
                        <div class="roundEdgeForIE9 floatR details-btn-outer">
                            <a class="blueButton details-pane-btn" onclick="hoteldetails(&quot;{{currentHotelaidepId}}&quot;)">{{{ i18n 'hotel-finder.brief-content.view-details' }}}&nbsp;<span class="hover-icon"></span></a>
                        </div>
                    </div>
                </div>
                <div class="details-pane-review-container clearfix">
                    <div class="details-pane-review-score-starrating-count" class="reviewScores">
                        {{#if currentHotelReviewScores.reviewScore }}
                        <h2 class="reviewScore">{{{ formatReviewRating currentHotelReviewScores.reviewScore.rating }}}</h2>
                        <span class="guestRating guestRating-lg"><span id="spn_scoreStars" style="margin:0px;" class="value {{ reviewStarRatingClass currentHotelReviewScores.reviewScore }}"></span></span>
                        <span class="reviewCount">{{ formatReviewCount currentHotelReviewScores.reviewScore.count }}</span>
                        {{else}}
                        <span class="reviewCount">{{{ i18n 'hotel-finder.brief-content.no-reviews' }}}</span>
                        {{/if}}
                    </div>
                    <div class="detail-pane-review">
                        {{#if currentHotelReviewReasonToBelieve}}
                        <ul class="details-pane-review-reason-to-believe">
                            {{{addDetailsPaneReasonToBelieve currentHotelReviewReasonToBelieve }}}
                        </ul>
                        {{else}}
                        {{/if}}

                        {{#if currentHotelReviewSummaries.summaries}}
                        <ul class="details-pane-review-summaries">
                            {{{addReviewSummaries currentHotelReviewSummaries.summaries }}}
                        </ul>
                        {{else}}
                        {{/if}}
                    </div>
                </div>
                {{else}}
                <div id="div_detailsPaneEanError" class="details-pane-ean-error">{{{ i18n 'hotel-finder.brief-content.ean-error' }}}</div>
                {{/if}}
                {{else}}
                {{#if currentHotelaidepId}}
                <div class="details-pane-name-starrating">
                    <h2>
                        {{ currentHotelName }}
                    </h2>
                </div>
                <div class="details-pane-missing-hotel-message">{{{ i18n 'hotel-finder.brief-content.missing-hotel-error' }}}</div>
                {{else}}
                <div id="div_detailsPaneError" class="details-pane-ean-error">{{{ i18n 'hotel-finder.brief-content.error' }}}</div>
                {{/if}}
                {{/if}}
            </div>
        </script>
        <!-- Handlebars Templates end -->
    </div>
    <div id="div_pageFooter" class="pageFooter"><tiles:insertAttribute name="footer" /></div>
</div>
</body>
</html>
