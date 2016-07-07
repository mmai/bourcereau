---
title: Petite astuce de productivité sous linux 
date: 2015-09-07
tags: productivité, linux
lang: .
draft: false
template: post.jade
---

Owen Williams explique dans [cet article](http://thenextweb.com/insider/2015/02/25/this-weird-productivity-hack-actually-made-me-more-efficient/) comment il a amélioré sa productivité en paramétrant MacOS pour qu'une voix de synthèse lui annonce l'heure automatiquement. Ce rappel régulier l'incite à se recentrer sur son travail plutôt que de se laisser aller au jeu des errements sur twitter et wikipedia. 

Voici comment implémenter la même fonctionnalité sous Debian/Ubuntu.

Nous avons besoin de *Espeak* pour la synthèse vocale proprement dite et de *Mbrola* afin d'améliorer le rendu final avec une voix plus agréable:

```sh
sudo apt-get install espeak mbrola mbrola-fr1
```

Nous pouvons d'ores et déjà synthétiser une phrase avec cette commande :
```sh
espeak -s 140 -v mb/mb-fr1 "Il est "`date +%R`
```

L'option `-v mb/mb-fr1` indique à mbrola d'utiliser la voix française et `-s 140`  permet de ralentir la vitesse d'élocution tandis que la commande `date +%R` retourne l'heure courante.

Il reste à executer automatiquement cette commande toutes les heures en configurant une tâche cron.
Cron a besoin de connaitre la variable d'environnement XDG_RUNTIME_DIR pour que le flux audio soit géré correctement. 
Dans une installation debian/ubuntu de base, cette valeur est */run/user/1000*, vous pouvez la vérifier en executant la commande `env |grep XDG_RUNTIME_DIR`.

Avec ces infos, nous pouvons créer un script */usr/local/bin/saytime.sh* avec le contenu suivant : 
```sh
#!/bin/sh

export XDG_RUNTIME_DIR=/run/user/1000
/usr/bin/espeak -s 140 -v mb/mb-fr1 "il est "`date +%H`" heures"
```

et ajouter la ligne `0 * * * * sh /usr/local/bin/saytime.sh` dans cron via la commande `crontab -e ` afin que le script soit executé toutes les heures.



