var mobileDetect = new MobileDetect(window.navigator.userAgent);

  
//Function to determine whether it is a mobile or not
function isMobile() {
    return !!mobileDetect.mobile();
}

// Function to determine if is supported mobile device and browser.
// Doesn't do anything currently, as we don't support mobile yet.
function isSupportedMobile() {
    if (isMobile) {
        return false;
    }
    return false;
}

function getIEVersion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');

    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    if (trident > 0) {
        // IE 11 (or newer) => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    // other browser
    return 0;
}

//Function to determine if IE version is supported
function isSupportedIE() {    
    var vNum = getIEVersion();
    if(!isMobile() && vNum >= 8 && vNum <= 11) {
        return true;
    }
    return false;       
}

// Function to determine if desktop Chrome version is supported
function isSupportedChrome() {
    // Support Chrome version 25 and above
    if (!isMobile() && $.browser.chrome && parseFloat($.browser.version) >= 25) {
        return true;
    }
    return false;
}

// Function to determine if Firefox version is supported
function isSupportedFirefox() {
    // Support Firefox version 19 and above
    if (!isMobile() && $.browser.mozilla && parseInt($.browser.version) >= 19) {
        return true;
    }
    return false;
}

// Function to determine if browser is supported
function isSupportedBrowser() {
    if (isSupportedFirefox() || isSupportedChrome() || 
        isSupportedIE() || isSupportedMobile()) {
        return true;
    }
    return false;
}
