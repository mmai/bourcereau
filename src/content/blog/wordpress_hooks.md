---
title: Découvrir les hooks cachés de Wordpress
date: 2014-10-03
tags: wordpress, hooks, plugins, php
lang: .
draft: true
template: post.jade
---

Si Wordpress propose de nombreux points d'entrée permettant le développement de plugins évolués, ils ne sont pas. On se retrouve à  

Je cherche des hook permettant de surcharger la page d'administration des utilisateurs du réseau : rien n'y fait référence dans les listes du codex wordpress qui font référence.

Il n'existe aucune référence exhaustive listant les hooks utilisables dans le développement de plugins wordpress.
Les listes existantes sont construites par un simple parsing du code source de Wordpress et ne déclinent pas les hooks aux noms composés d'une partie variable comme par exemple le filter hook manage_{$screen->id}_columns défini dans la fonction get_column_headers de include/screen.php

La seule façon de dénicher ces hooks est de regarder le code source. 

Première étape : déterminer quel fichier est responsable de l'action que je veux surcharger. 
Dans mon cas 

Ainsi le hook "manage_users-network_columns" permettant de d'ajouter une colonne dans la page d'administration des utilisateurs d'un réseau wordpress n'est référencé ni sur 
http://codex.wordpress.org/Plugin_API/Filter_Reference, .

Voici une technique permettant de découvrir ces hooks cachés.

Les hooks sont appelés avec la fonction "apply_filters", la première étape va consister à effectuer une recherche de la chaîne de caractères "apply_filters" dans les fichiers 

Si on ignore complètement, on peut y, la liste est longue : 
https://wordpress.org/plugins/hook-sniffer/
éditer le fichier 
