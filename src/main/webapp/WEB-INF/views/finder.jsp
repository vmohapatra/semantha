<!DOCTYPE HTML>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="text/javascript">
        (function() {
            var favIconSrc = "/semantha/resources/css/images/favicon.ico";
            var highResfavIconSrc = "/semantha/resources/css/images/favicon@2x.ico";
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
    <title>Finder</title>
</head>
<body>
Hello Finder
</body>
</html>
