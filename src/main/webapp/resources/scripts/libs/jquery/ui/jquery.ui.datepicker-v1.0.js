(function ()
{
	var localeId = getLocaleId();

	var defaults;
	switch (localeId)
	{
		// French (France or Canada)
		case 'fr_FR': // fall through
		case 'fr_CA':
			defaults = {
				monthNames: ['Janvier', 'F\u00e9vrier', 'Mars', 'Avril', 'Mai', 'Juin',
					'Juillet', 'Ao\u00fbt', 'Septembre', 'Octobre', 'Novembre', 'D\u00e9cembre'],
				monthNamesShort: ['Jan', 'F\u00e9v', 'Mar', 'Avr', 'Mai', 'Jun',
					'Jul', 'Ao\u00fb', 'Sep', 'Oct', 'Nov', 'D\u00e9c'],
				dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
				dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
				dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],

				// This is the format that determines the actual displayed value
				altFormat:'M d',

				// Don't specify 'dateFormat'.  It doesn't affect the displayed value,
				// and the code that interacts with the datepicker requires this to be
				// the default value of 'dd/mm/yyyy' so that it can parse the date using
				// Javascript's Date.parse method.
				//
				// In this case the locale uses the default date format, but we leave it commented out
				// to avoid the potential bug of copy/pasting this config and modifying the date format.
				//
//				dateFormat: 'dd/mm/yyyy',

				firstDay: 1,
				prevText: '&#x3c;Pr\u00e9c', prevStatus: 'Voir le mois pr\u00e9c\u00e9dent',
				prevJumpText: '&#x3c;&#x3c;', prevJumpStatus: 'Voir l\'ann\u00e9e pr\u00e9c\u00e9dent',
				nextText: 'Suiv&#x3e;', nextStatus: 'Voir le mois suivant',
				nextJumpText: '&#x3e;&#x3e;', nextJumpStatus: 'Voir l\'ann\u00e9e suivant',
				currentText: 'Courant', currentStatus: 'Voir le mois courant',
				todayText: 'Aujourd\'hui', todayStatus: 'Voir aujourd\'hui',
				clearText: 'Effacer', clearStatus: 'Effacer la date s\u00e9lectionn\u00e9e',
				closeText: 'Fermer', closeStatus: 'Fermer sans modifier',
				yearStatus: 'Voir une autre ann\u00e9e', monthStatus: 'Voir un autre mois',
				weekText: 'Sm', weekStatus: 'Semaine de l\'ann\u00e9e',
				dayStatus: '\'Choisir\' le DD d MM',
				defaultStatus: 'Choisir la date',
				isRTL: false };
			break;

		// Italian
		case 'it_IT':
			defaults = {
				monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
					'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
				monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
					'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
				dayNames: ['Domenica', 'Luned&#236', 'Marted&#236', 'Mercoled&#236', 'Gioved&#236', 'Venerd&#236', 'Sabato'],
				dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
				dayNamesMin: ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'],

				// This is the format that determines the actual displayed value
				altFormat:'M d',

				// Don't specify 'dateFormat'.  It doesn't affect the displayed value,
				// and the code that interacts with the datepicker requires this to be
				// the default value of 'dd/mm/yyyy' so that it can parse the date using
				// Javascript's Date.parse method.
				//
				// In this case the locale uses the default date format, but we leave it commented out
				// to avoid the potential bug of copy/pasting this config and modifying the date format.
				//
//				dateFormat: 'dd/mm/yyyy',

				firstDay: 1,
				prevText: '&#x3c;Prec', prevStatus: '',
				prevJumpText: '&#x3c;&#x3c;', prevJumpStatus: '',
				nextText: 'Succ&#x3e;', nextStatus: '',
				nextJumpText: '&#x3e;&#x3e;', nextJumpStatus: '',
				currentText: 'Oggi', currentStatus: '',
				todayText: 'Oggi', todayStatus: '',
				clearText: '-', clearStatus: '',
				closeText: 'Chiudi', closeStatus: '',
				yearStatus: '', monthStatus: '',
				weekText: 'Sm', weekStatus: '',
				dayStatus: 'DD d MM',
				defaultStatus: '',
				isRTL: false };
			break;

		// Norwegian
		case 'no_NO':
			defaults = {
				monthNames: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
					'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'],
				monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun',
					'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
				dayNamesShort: ['S\u00f8n', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'L\u00f8r'],
				dayNames: ['S\u00f8ndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'L\u00f8rdag'],
				dayNamesMin: ['S\u00f8', 'Ma', 'Ti', 'On', 'To', 'Fr', 'L\u00f8'],

				// This is the format that determines the actual displayed value
				altFormat:'M d',

				// Don't specify 'dateFormat'.  It doesn't affect the displayed value,
				// and the code that interacts with the datepicker requires this to be
				// the default value of 'dd/mm/yyyy' so that it can parse the date using
				// Javascript's Date.parse method.
				//
//				dateFormat: 'yyyy-mm-dd',

				firstDay: 0,
				prevText: '&laquo;Forrige', prevStatus: '',
				prevJumpText: '&#x3c;&#x3c;', prevJumpStatus: '',
				nextText: 'Neste&raquo;', nextStatus: '',
				nextJumpText: '&#x3e;&#x3e;', nextJumpStatus: '',
				currentText: 'I dag', currentStatus: '',
				todayText: 'I dag', todayStatus: '',
				clearText: '-', clearStatus: '',
				closeText: 'Lukk', closeStatus: '',
				yearStatus: '', monthStatus: '',
				weekText: 'Uke', weekStatus: '',
				dayStatus: 'DD d MM',
				defaultStatus: '',
				isRTL: false };
			break;

		// Swedish
		case 'sv_SE':
			defaults = {
				monthNames: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
					'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'],
				monthNamesShort: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun',
					'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
				dayNamesShort: ['S\u00f6n', 'M\u00e5n', 'Tis', 'Ons', 'Tor', 'Fre', 'L\u00f6r'],
				dayNames: ['S\u00f6ndag', 'M\u00e5ndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'L\u00f6rdag'],
				dayNamesMin: ['S\u00f6', 'M\u00e5', 'Ti', 'On', 'To', 'Fr', 'L\u00f6'],

				// This is the format that determines the actual displayed value
				altFormat:'d M',

				// Don't specify 'dateFormat'.  It doesn't affect the displayed value,
				// and the code that interacts with the datepicker requires this to be
				// the default value of 'dd/mm/yyyy' so that it can parse the date using
				// Javascript's Date.parse method.
				//
//				dateFormat: 'yyyy-mm-dd',

				firstDay: 1,
				prevText: '&laquo;F\u00f6rra', prevStatus: '',
				prevJumpText: '&#x3c;&#x3c;', prevJumpStatus: '',
				nextText: 'N\u00e4sta&raquo;', nextStatus: '',
				nextJumpText: '&#x3e;&#x3e;', nextJumpStatus: '',
				currentText: 'Idag', currentStatus: '',
				todayText: 'Idag', todayStatus: '',
				clearText: '-', clearStatus: '',
				closeText: 'St\u00e4ng', closeStatus: '',
				yearStatus: '', monthStatus: '',
				weekText: 'Ve', weekStatus: '',
				dayStatus: 'DD d MM',
				defaultStatus: '',
				isRTL: false };
			break;

		// Danish
		case 'da_DK':
			defaults = {
				monthNames: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni',
					'Juli', 'August', 'September', 'Oktober', 'November', 'December'],
				monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun',
					'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
				dayNames: ['S\u00f8ndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'L\u00f8rdag'],
				dayNamesShort: ['S\u00f8n', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'L\u00f8r'],
				dayNamesMin: ['S\u00f8', 'Ma', 'Ti', 'On', 'To', 'Fr', 'L\u00f8'],

				// This is the format that determines the actual displayed value
				altFormat:'M d',

				// Don't specify 'dateFormat'.  It doesn't affect the displayed value,
				// and the code that interacts with the datepicker requires this to be
				// the default value of 'dd/mm/yyyy' so that it can parse the date using
				// Javascript's Date.parse method.
				//
//				dateFormat: 'dd-mm-yyyy',

				firstDay: 1,
				prevText: '&#x3c;Forrige', prevStatus: '',
				prevJumpText: '&#x3c;&#x3c;', prevJumpStatus: '',
				nextText: 'N\u00e6ste&#x3e;', nextStatus: '',
				nextJumpText: '&#x3e;&#x3e;', nextJumpStatus: '',
				currentText: 'Idag', currentStatus: '',
				todayText: 'Idag', todayStatus: '',
				clearText: '-', clearStatus: '',
				closeText: 'Luk', closeStatus: '',
				yearStatus: '', monthStatus: '',
				weekText: 'Uge', weekStatus: '',
				dayStatus: 'DD d MM',
				defaultStatus: '',
				isRTL: false };
			break;

		// Czech
		case 'cs_CZ':
			defaults = {
				monthNames: ['leden', '\u00fanor', 'b\u0159ezen', 'duben', 'kv\u011bten', '\u010derven',
					'\u010dervenec', 'srpen', 'z\u00e1\u0159\u00ed', '\u0159\u00edjen', 'listopad', 'prosinec'],
				monthNamesShort: ['led', '\u00fano', 'b\u0159e', 'dub', 'kv\u011b', '\u010der',
					'\u010dvc', 'srp', 'z\u00e1\u0159', '\u0159\u00edj', 'lis', 'pro'],
				dayNames: ['ned\u011ble', 'pond\u011bl\u00ed', '\u00fater\u00fd', 'st\u0159eda', '\u010dtvrtek', 'p\u00e1tek', 'sobota'],
				dayNamesShort: ['ne', 'po', '\u00fat', 'st', '\u010dt', 'p\u00e1', 'so'],
				dayNamesMin: ['ne', 'po', '\u00fat', 'st', '\u010dt', 'p\u00e1', 'so'],

				// This is the format that determines the actual displayed value
				altFormat:'M d',

				// Don't specify 'dateFormat'.  It doesn't affect the displayed value,
				// and the code that interacts with the datepicker requires this to be
				// the default value of 'dd/mm/yyyy' so that it can parse the date using
				// Javascript's Date.parse method.
				//
//				dateFormat: 'dd.mm.yyyy',
				firstDay: 1,
				prevText: '&#x3c;D\u0159\u00edve', prevStatus: '',
				prevJumpText: '&#x3c;&#x3c;', prevJumpStatus: '',
				nextText: 'Pozd\u011bji&#x3e;', nextStatus: '',
				nextJumpText: '&#x3e;&#x3e;', nextJumpStatus: '',
				currentText: 'Nyn\u00ed', currentStatus: '',
				todayText: 'Nyn\u00ed', todayStatus: '',
				clearText: '-', clearStatus: '',
				closeText: 'Zav\u0159\u00edt', closeStatus: '',
				yearStatus: '', monthStatus: '',
				weekText: 'T\u00fdd', weekStatus: '',
				dayStatus: 'DD d MM',
				defaultStatus: '',
				isRTL: false };
			break;

		// German
		case 'de_DE':
			defaults = {
				monthNames: ['Januar', 'Februar', 'M\u00e4rz', 'April', 'Mai', 'Juni',
					'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
				monthNamesShort: ['Jan', 'Feb', 'M\u00e4r', 'Apr', 'Mai', 'Jun',
					'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
				dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
				dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
				dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],

				// This is the format that determines the actual displayed value
				altFormat:'M d',

				// Don't specify 'dateFormat'.  It doesn't affect the displayed value,
				// and the code that interacts with the datepicker requires this to be
				// the default value of 'dd/mm/yyyy' so that it can parse the date using
				// Javascript's Date.parse method.
				//
//				dateFormat: 'dd.mm.yyyy',
				firstDay: 1,
				prevText: '&#x3c;zur\u00fcck', prevStatus: '',
				prevJumpText: '&#x3c;&#x3c;', prevJumpStatus: '',
				nextText: 'Vor&#x3e;', nextStatus: '',
				nextJumpText: '&#x3e;&#x3e;', nextJumpStatus: '',
				currentText: 'heute', currentStatus: '',
				todayText: 'heute', todayStatus: '',
				clearText: '-', clearStatus: '',
				closeText: 'schlie\u00dfen', closeStatus: '',
				yearStatus: '', monthStatus: '',
				weekText: 'Wo', weekStatus: '',
				dayStatus: 'DD d MM',
				defaultStatus: '',
				isRTL: false
			};
			break;

		// Spanish
		case 'es_ES':
			defaults = {
				monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
					'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
				monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
					'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
				dayNames: ['Domingo', 'Lunes', 'Martes', 'Mi&eacute;rcoles', 'Jueves', 'Viernes', 'S&aacute;bado'],
				dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mi&eacute;', 'Juv', 'Vie', 'S&aacute;b'],
				dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'S&aacute;'],

				// This is the format that determines the actual displayed value
				altFormat:'M d',

				// Don't specify 'dateFormat'.  It doesn't affect the displayed value,
				// and the code that interacts with the datepicker requires this to be
				// the default value of 'dd/mm/yyyy' so that it can parse the date using
				// Javascript's Date.parse method.
				//
				// In this case the locale uses the default date format, but we leave it commented out
				// to avoid the potential bug of copy/pasting this config and modifying the date format.
				//
//				dateFormat: 'dd/mm/yyyy',
				firstDay: 1,
				prevText: '&#x3c;Ant', prevStatus: '',
				prevJumpText: '&#x3c;&#x3c;', prevJumpStatus: '',
				nextText: 'Sig&#x3e;', nextStatus: '',
				nextJumpText: '&#x3e;&#x3e;', nextJumpStatus: '',
				currentText: 'Hoy', currentStatus: '',
				todayText: 'Hoy', todayStatus: '',
				clearText: '-', clearStatus: '',
				closeText: 'Cerrar', closeStatus: '',
				yearStatus: '', monthStatus: '',
				weekText: 'Sm', weekStatus: '',
				dayStatus: 'DD d MM',
				defaultStatus: '',
				isRTL: false };
			break;

		case 'en_US': // fall through
		default:
			defaults = {
				altFormat:'M d'
			}
	}

	jQuery.datepicker.setDefaults(defaults);
})();
