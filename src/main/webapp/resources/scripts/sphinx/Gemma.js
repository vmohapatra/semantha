function getData() {

	var code;
	if (!e) e = window.event;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;

	// closeInfoWindow();
	if (code == 13) {
		//console.log('Enter....');

		var eventTrigger = 'SearchBoxEnter';
		var searchType= 'Manual';
		if(autoCompleteSelected){
			eventTrigger = 'SearchBoxSuggestionSelectThenEnter';
			searchType = 'Autosuggest';
		}

		//console.log(searchType + ':' + eventTrigger);
		createTravelRequest(searchType, eventTrigger);
		$("#ip_travelRequest").autocomplete('close');
	}

	var selectedLocale = $.cookie( 'localeId' ) || 'en_US';
	//turn off for those non-english locale
	if(selectedLocale!="en_US")return;

	keycode = String.fromCharCode(code);
	if (keycode.length == 0) return myData;
	var prefix = escape($("#ip_travelRequest").val());
	if (prefix.length == 0) return myData;

	var autoUrl = serverPrefix + "sphinx/AutoSuggestService?travelRequest=" + prefix;
	oldQuery = escape($("#ip_travelRequest").val());

	if(lcmAffinityMappingData==null){
		getLcmAffinityMappings();
	}
	if(gemmaServerData==null){
		getGemmaServerData();
	}
	if (!$.browser.msie||window.XDomainRequest)
		autoUrl =  gemmaServerData.gemmaURL + "&prefix=" + prefix;

	if (!window.XDomainRequest) {
		$.ajax({
			url: autoUrl,
			dataType: "xml",
			success: parsexml,
			complete: setupAC,
			error: function (jqXHR, textStatus, errorThrown) {

			}

		});
	}
	else {
		var xdr = new XDomainRequest();
		xdr.open("get", autoUrl);
		xdr.onload = function () {
			var doc = new ActiveXObject('Microsoft.XMLDOM');
			doc.async = false;
			try {
				doc.loadXML(xdr.responseText);
				// alert("Got: " + xdr.responseText);
			} catch (e) {
				doc = undefined;
			}
			if (doc != undefined) {
				parsexml(doc);
				setupAC();
			}

		}
		xdr.send();
	}
}

function getGemmaVersion(){
	//console.log('getGemmaVersion');
	var autoUrl =  gemmaServerData.gemmaURL + "&prefix=v";
	if (!window.XDomainRequest) {
		$.ajax({
			url: autoUrl,
			dataType: "xml",
			success: getVersion,
			complete: function(){},
			error: function (jqXHR, textStatus, errorThrown) {

			}

		});
	}
	else {
		var xdr = new XDomainRequest();
		xdr.open("get", autoUrl);
		xdr.onload = function () {
			var doc = new ActiveXObject('Microsoft.XMLDOM');
			doc.async = false;
			try {
				doc.loadXML(xdr.responseText);
				// alert("Got: " + xdr.responseText);
			} catch (e) {
				doc = undefined;
			}
			if (doc != undefined) {
				getVersion(doc);
			}

		}
		xdr.send();
	}

	function getVersion(xmlResponse){
		var gemmaVersion = $("GemmaSuggestResponse ", xmlResponse).attr('productVersion');
		$('#spn_gemmaVersion').text(gemmaVersion);
		//console.log('gemmaVersion: ' + gemmaVersion);
	}
}

//parse auto suggestion xml response
function parsexml(xmlResponse) {
	myData = $("Suggestion", xmlResponse).map(function () {
		return {
			value: $(this).text(),
			id: $(this).text()
		};
	}).get();
}

function getGemmaVersionProcess(){
	//console.log('getGemmaVersionProcess');
	getGemmaVersion();
	gemmaVersionHandler = setTimeout(function(){
		//console.log('setTimeout');
		if($('#spn_gemmaVersion').text()==''){
			getGemmaVersionProcess();
		}else{
			//console.log('clearTimeout');
			clearTimeout(gemmaVersionHandler);
		}
	},2000);
}

