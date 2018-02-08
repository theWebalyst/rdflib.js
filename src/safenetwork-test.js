// JUNK - was cut down ver of safenetwork-solid.js but that is now buildable

// TEST fetch() for safe: URI

// Debugging
localStorage.debug = 'solid:*'
var safeLog = require('debug')('solid:safe')

// Safe API object, used by rdflib.js to access the API
//
// Properties overwriteable by app (app can also call auth explicitly)
var safeConfig = {
  safeUriActive:    true,   // fetch() will intercept safe: URIs

  authOnAccess:     false,  // Trigger auth on safe: access
  authOnAuthError:  true,   // Trigger auth on auth error and retry once
}

function parentPath(path) {
  return path.replace(/[^\/]+\/?$/, '');
}

// Used to cache file info
var Cache = function (maxAge) {
  this.maxAge = maxAge;
  this._items = {};
};

// Cache of file version info
Cache.prototype = {
  get: function (key) {
    var item = this._items[key];
    var now = new Date().getTime();
    // Google backend expires cached fileInfo, so we do too
    // but I'm not sure if this is helpful. No harm tho.
    return (item && item.t >= (now - this.maxAge)) ? item.v : undefined;
  },

  set: function (key, value) {
    this._items[key] = {
      v: value,
      t: new Date().getTime()
    };
  },

  'delete': function (key) {
    if ( this._items[key] ) {
      delete this._items[key];
    }
  }
};

/**
 * A Linked Data Protocol interface to SafeNetwork
 *
 * @class
 * TODO revise these comments...
 * @param rdf {Object}
 * @param config {Object}
 *
 * config is an object with members:
 *    safeUriConfig - see below
 *    safeAppConfig - see SAFE API window.safeApp.initialise()
 *    safeAppPermissions - see SAFE API window.safeApp.authorise
 *
 * Example:
 * (for safeUriConfig - see prototype)
 *
 * The solidConfig allows the user to specify a webid, as well as the
 * storage that will allow LDP style mutations once the user authorises
 * with SAFE Network (logs in to their account). So the storage URI must
 * be a public ID owned by the account the user authorises.
 *
 * solidConfig = {
 *    webid:    'safe://solid.happybeing/profile/card#me' // Public readable resource
 *    storage:  'safe://solid.happybeing'                 // Public read/write solid service
 * }
 *
 * safeAppConfig = {
 *    id:     'net.maidsafe.test.webapp.id',
 *    name:   'WebApp Test',
 *    vendor: 'MaidSafe Ltd.'
 * }
 *
 * safeAppPermissions = {
 *    _public: ['Insert'],         // request to insert into `_public` container
 *    _other: ['Insert', 'Update'] // request to insert and update in `_other` container
 * }
 *
 */
// Helpers
function protocol (uri) {
  var i
  i = uri.indexOf(':')
  if (i < 0) {
    return null
  } else {
    return uri.slice(0, i)
  }
}

var SafenetworkLDP = function () {
}

SafenetworkLDP.prototype = {
  // SAFE API State
  _connected: false,
  _online: true,
  _isPathShared: true,        // App private storage mrhTODO shared or
                              // private? app able to control?
  _mdRoot:   null,             // Handle for root mutable data (mrhTODO:
                              // initially maps to _public)
  _nfsRoot:  null,             // Handle for nfs emulation

  // Defaults
  _safeUriEnabled:   false,  // Enable Fetcher.js fetchUri() for safe: URLs
  _authOnAccess:     false,  // Trigger auth on safe: access
  _authOnAuthError:  true,   // Trigger auth on auth error and retry once

  _solidConfig: {},           // Supplied by the App (see above)
  _safeAppConfig: {},         // Supplied by the App (see above)
  _safeAppPermissions: {},    // Supplied by the App (see above)

  isEnabled: function (){      return this._safeUriEnabled },

  // Application must provide config and permissions for writeable store

  Configure: function (solidConfig, appConfig, appPermissions, enable){
    this._solidConfig = solidConfig
    this._safeAppConfig = appConfig
    this._safeAppPermissions = appPermissions
    Enable(enable && this._solidConfig && this._safeAppConfig && this._appPermissions)
  },

  Enable: function (flag){
    safeLog.log('Enable('+flag+')')
    safeLog.log('Enable(%o)',flag)
    this._safeUriEnabled = flag;

    if ( flag && this.authImmediately )
      Authorise()
  },

  // Synchronous authorisation with SAFE Network
/*  Authorise: async function (){
    //await ???
  },
*/
/**
 * Explicitly authorise with Safenetwork using config already provided
 *
 * @returns
 */
    SafeAuthorise: function (){
        //???
    },

/**
 * Handle 'safe:' URIs to provide LDP interface to Safenetwork backend
 *
 * For Safenetwork proof of concept we:
 *  - assume a public container _public/solid/
 *  - use SAFE API simulateAs('NFS') to manage container contents
 *  - so the URI will be some public name (e.g. pubid) such as
 *      safe:pubid/solidfile
 *    where solidresource maps to _public/solid
 *
 * TODO refactor to implement Safenetwork service 'solid' (cf 'www')
 * TODO Implement PATCH (using GET, modify, POST)
 *
 * @param docuri {string}
 * @param options {Object}
 *
 * @returns null if not handled, or a {Promise<Object} on handling a safe: URI
 */

  fetch: function (docUri, options){
    safeLog('SafenetworkLDP.fetch(%s,%o)', docUri, options)
    return httpFetch(docUri,options) // TESTING so pass through

    if ( 'safe' == protocol(docUri) ){
      // ???
    }
    if (_ensureInitialised()){
      //do safe stuff
    }

    return null;
  },

/**
 * Ensures SAFE API is ready for the given operation (GET/PUT/POST/DELETE/PATCH)
 *
 * GET can be achieved
 * @returns true if SAFE network is
 */

  _ensureInitialised: function (){

  },

}

const Safenetwork = new SafenetworkLDP;

// Protocol handlers for fetch()
const httpFetch = require('isomorphic-fetch')
const protoFetch = require('proto-fetch')

// map protocol to fetch() handler
const fetch = protoFetch({
  http: Safenetwork.fetch.bind(Safenetwork), //httpFetch,
  https: Safenetwork.fetch.bind(Safenetwork), //httpFetch,
  safe: Safenetwork.fetch.bind(Safenetwork),
})

module.exports = Safenetwork;
module.exports.fetch = fetch;
