<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

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
		<c:set var="supportEmail" value="bestsupport@expedia.com"/>
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
		<c:set var="feedbackEmail" value="semantha@expedia.com"/>
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
<c:set var="pageTitle">${requestScope['javax.servlet.forward.servlet_path']}</c:set>
<c:if test="${pageTitle != '/hotelfinder'}">
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
		<li><a id="lnk_logout" href="logout"></a></li>
	</ul>
</div>
</c:if>

