---
title: Proxapi, a helper for accessing quota limited APIs
date: 2014-09-08
tags: javascript, api, twitter, gmaps
lang: en
template: en/post.jade
---

What is this ? 
--------------

_Proxapi_ is a javascript library acting between your code and APIs of services like Twitter, Google ou Facebook which limit the number of requests allowed in a period of time. With it, you can set up various strategies dealing with the cases when limits are reached : send back an informative error message, wait for the end of the limited period to retry the request, etc.

How it works
------------

Let's look at a call to the Google geocoding service. Here is a code example, without Proxapi, which displays an address coordinates if everything is ok, and an error message if usage limitations have been reached. 

```
var geocoder = new google.maps.Geocoder();
geocoder.geocode({ 'address': 'Bordeaux, France' }, function(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
    console.log(results[0].geometry.location);
  } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
    console.log("Error : usage limitations reached");
  }
});
```

We are going to use Proxapi in order to call the API every minute if we are notified that the usage limit has been reached. Here is how we initialize and call Proxapi, the _translate_ function content is explained next.

```
var geocoder_proxy = new Proxapi({
  retryDelay: 60, // Retrying every minute
  translate: function(params, proxy_callback){
        //...
        }
};

  
geocoder_proxy.call({address: 'Bordeaux, France'}, {strategy: 'retry'} ,function(err, results){
  if (err) {
    console.log(err);
  } else {
    console.log(results[0].geometry.location);
  }
});

```
The _translate_ function used in the initialization allows Proxapi to call the API and to understand the results. It follows this scenario : 
 * call the API with the _params_ parameters which are the same as those given to the _Proxapi.call_ function (in our example : ``{adress: 'Bordeaux, France'}``)
 * get the results
 * catch errors and detect quota limits
 * return to Proxapi by calling _proxy\_callback_ with the following arguments:
   * _err_ : errors not associated to usage limitations
   * _results_ : API request results
   * _aqm\_status_ : information about the request, you must set at least _aqm\_status.quota_ boolean value ( _true_ if the request failed due to usage limitations, _false_ if there wasn't any quota error).

Here is the complete code. When using other APIs, you only need to modify the sections marked "XXX needs modifications" in the _translate_ function : 

```
var geocoder_proxy = new Proxapi({
  strategy: 'retry',
  retry_delay: 60, //Retrying every minute
  translate: function(params, proxy_callback){ 
    // XXX following line needs modifications (API call)
    geocoder.geocode({ 'address': params.address }, function(results, status) {
      var aqm_status = { quota: false };
      var err = null;
  
      // Transformation from the API response format to the proxy_callback format
      // XXX following block needs modifications
      if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        aqm_status.quota = true;
      } else if (status !== google.maps.GeocoderStatus.OK) { 
          err = status;
      }
  
      //Finally return to Proxapi
      proxy_callback(err, results, aqm_status); 
    });
  }
});

geocoder_proxy.call({address: 'Bordeaux, France'}, function(err, results){
  if (err) {
    console.log(err);
  } else {
    console.log(results[0].geometry.location);
  }
});

```

More complete concrete examples are available with [proxapi source code](http://github.com/mmai/proxapi/).
