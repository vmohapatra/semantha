function namespace(namespace){
	var pkgCurr=window,
		ns = namespace.split('.'),
		pkgName;
	for(idx in ns) {
		pkgName=ns[idx];
		pkgCurr[pkgName]=pkgCurr[pkgName]||{};
		pkgCurr=pkgCurr[pkgName];
	}
	return pkgCurr;
};
namespace("aidep.dmap.common");

/**
 * @namespace Common utilities 
 * @Author  <mailto:svenz@aidep.com>Sven Zethelius</mailto>
 */
aidep.dmap.common.Utilities={
	/**
	 * Dynamically add a javascript include. Note that the javascript is not
	 * immediately available. This function should only be called before the
	 * onload event, otherwise some browsers may have problems loading.
	 * 
	 * @param {String}
	 *            url javascript to load
	 */
	addJS:function(url){
		document.write('<' + 'script src="' + url + '"' +' type="text/javascript"><' + '/script>');
	},

	/**
	 * Create/Declare a namespace.  Does nothing if the namespace already exists
	 * @function
	 * @param {String} namespace
	 * @return {Object} the namespace object
	 */
	namespace:namespace,
	
	/**
	 * execute f until it succeeds, or exhausts attempts.
	 * @param {Function} f 
	 * 		function to execute
	 * @param {Number} period 
	 * 		milliseconds between attempts
	 * @param {Number} attempts 
	 * 		number of attempts before stopping with exception
	 */
	retry:function(f,period,attempts){
		var retryf;
		retryf=function() {
			try {
				f();
			} catch(err) {
				if(0 <= attempts--)
					setTimeout(retryf,period);
				else
					setTimeout(f,period);
			}
		};
		retryf();
	},
	
	/**
	 * Merge 2 associative arrays
	 * @param {Object} d destination 
	 * @param {Object} s object to add to destination
	 */
	merge:function(d,s) {
		for(var key in s) {
			d[key]=s[key];
		}
	},

	/**
	 * Check if an associative array is not empty.
	 * @param o1
	 * @returns {Boolean} true if the array is not empty
	 */
	hasKeys:function(o1) {
		for(var key in o1) {
			return true;
		}
		return false;
	},
	
	/**
	 * Wrapper for DOM.addEventListener for cross browser support without doing prototype hacking to provide it.
	 * @param {Node} node the DOM element to target
	 * @param {String} event the event to listen to
	 * @param {Function} listener the listener for the event
	 */
	addEventListener:function(node,event,listener) {
		node.addEventListener(event, listener);
	},
	
	/**
	 * Wrapper for Array.indexOf for cross browser support without doing prototype hacking to provide it.
	 * @param {Array} arr
	 * @param {Object} val
	 * @returns
	 */
	indexOf:function(arr,val) {
		return arr.indexOf(val);
	}
};


/**
 * For browsers that don't support DOM addEventListener (IE8 and below), emulate it by replacing the onevent function.
 */
if(!window.addEventListener) {
	aidep.dmap.common.Utilities.addEventListener=function(target,event,listener) {
		if(target["on"+event] !== undefined) {
			var on=target["on"+event];
			target["on"+event]=on ? 
					function(){ // chain to existing event
						on.apply(this, arguments);
						listener.apply(this, arguments);
					} : listener; // just use this
		} else {
			throw new Error('Unable to apply event '+event+' to '+target);
		}
	};
};

/**
 * For browsers that don't support Array.indexOf, provide an alternative
 */
if(! Array.prototype.indexOf) {
	aidep.dmap.common.Utilities.indexOf=function(arr,val) {
		for(var idx=0; idx < arr.length;idx++) {
			if(val==arr[idx])
				return idx;
		}
		return -1;
	};
};
