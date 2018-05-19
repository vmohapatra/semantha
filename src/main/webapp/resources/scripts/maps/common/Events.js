var Util = aidep.dmap.common.Utilities;// import

Util.namespace("aidep.dmap.common");

/**
 * Events class is a helper to manage events
 * @param {Object} owner the owner of the events to be fired
 * @param {Array} evts array of event names
 * @param {Object} handlers associative array of {String} to {Function} that should be invoked when a listener is first registered for an event
 * 
 * @namespace
 * @authur <mailto:svenz@aidep.com>Sven Zethelius</mailto>
 */
aidep.dmap.common.Events = Events = function(owner, evts, handlers) {
	this.owner=owner;
	this.events=evts;
	this.listeners = {};
	this.onFirstRegister=handlers||{};
};

/**
 * Add a listener function to call whenever the event is fired.
 * 
 * @param {String}
 *            evt the event to listen for
 * @param {Function}
 *            listener the function to invoke when the event is fired.
 * @return number of event handlers for this event
 */
aidep.dmap.common.Events.prototype.addEventListener = function(evt,listener) {
	var q = this.listeners[evt],
		handler;
	if (!q) {
		checkRegistered(this.events, evt);

		// delay initialize
		q=[];
		this.listeners[evt]=q; 
		handler=this.onFirstRegister[evt];
		if(handler) {
			handler.call(this.owner);
		}
	}
	q.push(listener);
	return q.length;
};

/**
 * Remove a listener function
 * 
 * @param {String} evt the event to listen for
 * @param {Function} listener the function previously added by addEventListener
 * @returns {Boolean} true if the listener was removed, false otherwise
 */
aidep.dmap.common.Events.prototype.removeEventListener = function(evt,listener) {
	var q = this.listeners[evt], idx=-1;
	if (q) {
		idx = Util.indexOf(q,listener); // Find the index
		if (idx != -1) {
			// copy the array in case we are iterating this event.
			q=q.concat([]);
			// remove the listener from the copy
			q.splice(idx,1);
			// replace the main list for future events
			this.listeners[evt]=q;
		}
	} else {
		checkRegistered(this.events, evt);
	}
	return idx != -1;
};

/**
 * Fire an event, invoking all listeners registered by addEventListener for that event
 * 
 * @param {String} evt the event to fire
 * @param {Array} params the parameters to pass to the listeners
 */
aidep.dmap.common.Events.prototype.fireEvent = function(evt,params) {
	var q = this.listeners[evt],
		idx;
	if (q) {
		for (idx=0;idx<q.length;idx++) {
			if (q[idx] != null)
				q[idx].apply(this.owner, params);
		}
	} else {
		checkRegistered(this.events, evt);
	}
};

/**
 * Clear all registered listeners
 * 
 * @param {String} evt the event to remove listeners for.  null/undefined will clear listeners for all events 
 */
aidep.dmap.common.Events.prototype.clearListeners = function(evt) {
	if(evt) {
		checkRegistered(this.events, evt);
		this.listeners[evt]=[];
	} else {
		for(var key in this.listeners) {
			this.listeners[key]=[];
		}
	}
};

/**
 * Helper to confirm the event is legal
 * @param events
 * @param evt
 */
function checkRegistered(events, evt) {
	if(0 > Util.indexOf(events,evt)) {
		throw new Error("Event '"+evt+"' is not defined");
	}
}

