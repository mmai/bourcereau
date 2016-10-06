---
title: Proxapi facilite l'accès aux API limitées par des quotas
date: 2014-09-08
tags: javascript, api, twitter, gmaps
lang: .
template: post.jade
---

Qu'est-ce que c'est ?
---------------------

_Proxapi_ est une bibliothèque javascript s'interfaçant avec les API de services comme Twitter, Google ou Facebook qui limitent la quantité de requêtes autorisée pour une période donnée. Elle permet de mettre en place différentes stratégies lorsque les quotas sont atteints, comme retourner un message d'erreur informatif ou attendre la fin de la période limitée pour effectuer de nouveau la requête.

Comment ça marche ?
-------------------

Prenons un appel à l'API de géocodage de google maps, voici un exemple de code, sans Proxapi, qui affiche les coordonnées d'une addresse si tout se passe bien, et le message ``Erreur: quota atteint`` si les limites d'utilisation de l'API sont atteintes. 

```
var geocoder = new google.maps.Geocoder();
geocoder.geocode({ 'address': 'Bordeaux, France' }, function(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
    console.log(results[0].geometry.location);
  } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
    console.log("Erreur : quota atteint!");
  }
});
```

Nous allons utiliser Proxapi pour lancer la requête toutes les minutes tant que la réponse indique un blocage pour cause de quotas dépassés. L'initialisation de Proxapi et la requête se font de la manière suivante, le contenu de la fonction _translate_ est détaillé par la suite.

```
var geocoder_proxy = new Proxapi({
  retryDelay: 60, //On tente la requête toutes les minutes
  translate: function(params, proxy_callback){
        //...
        }
};

geocoder_proxy.call({address: 'Bordeaux, France'}, {strategy: 'retry'}, function(err, results){
  if (err) {
    console.log(err);
  } else {
    console.log(results[0].geometry.location);
  }
});

```

La fonction _translate_ utilisée lors de l'initialisation permet à Proxapi d'interroger l'API du service distant et d'interpréter les résultats en suivant ce scénario :
 * appel à l'API avec les paramètres _params_ qui reprennent ceux fournis à la fonction _Proxapi.call_ ( dans notre exemple : ``{adress: 'Bordeaux, France'}``)
 * réception des résultats de la requête
 * détection d'une limite d'utilisation atteinte, interception des autres erreurs
 * retour à Proxapi en appelant la fonction _proxy\_callback_ avec les paramètres suivant :
   * _err_ : les erreurs autres que celles liés à la limitation par quota
   * _results_ : le résultat de l'appel à l'API
   * _aqm\_status_ : informations concernant la requête, il faut au moins renseigner la valeur _aqm\_status.quota_ (_true_ si la requête n'a pu aboutir pour cause de limitation par quota, _false_ sinon). 

Voici le code complet. Il suffit de modifier les portions de la fonction _translate_ annotées ``XXX à modifier``  pour adapter ce code à une API différente.

```
var geocoder_proxy = new Proxapi({
  strategy: 'retry',
  retry_delay: 60, //On tente la requête toutes les minutes
  translate: function(params, proxy_callback){ 
    // XXX ligne suivante à modifier (Appel à l'API) :
    geocoder.geocode({'address': params.address}, function(results, status){
      var aqm_status = { quota: false };
      var err = null;
  
      // Transformation du résulat de l'appel à l'API dans le format de proxy_callback
      // XXX bloc à modifier
      if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        aqm_status.quota = true;
      } else if (status !== google.maps.GeocoderStatus.OK) { 
          err = status;
      }
  
      //Retour à Proxapi par l'appel final à proxy_callback
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

Des exemples fonctionnels plus détaillés sont visibles avec [code source du projet](http://github.com/mmai/proxapi/).
