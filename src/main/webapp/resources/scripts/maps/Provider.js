/**
 * The prupose of this file is move provider specific API to the non-provider namespaces so clients of the javascript 
 * API can be provider agnostic.
 */

var 
	providerNS=aidep.dmap.google;

for(var key in providerNS) {
	aidep.dmap[key]=providerNS[key];
}
