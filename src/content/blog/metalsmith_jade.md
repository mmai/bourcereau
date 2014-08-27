---
title: Utiliser jade avec Metalsmith
date: 2014-08-20
tags: metalsmith, jade, gulp, static, javascript
lang: .
template: post.jade
---
J'ai construit ce site avec un générateur de pages statiques. Plusieurs raisons à cela : la facilité d'hébergement et d'archivage, les performances... et puis j'ai un peu cédé à la mode !

Les solutions les plus connues sont [Jeckyll](http://jekyllrb.com/) utilisé pour les pages Github, ou [Pelican](http://blog.getpelican.com/) dans le monde Python, mais j'ai préféré porter mon choix sur [Metalsmith](http://www.metalsmith.io/), un outil javascript totalement modulaire et donc très facilement extensible, bénéficiant de l'énorme écosystème de bibliothèques disponible sur npm.

Robin Thrift a écrit un [très bon tutoriel d'introduction](http://www.robinthrift.com/posts/metalsmith-part-1-setting-up-the-forge/) en trois parties sur Metalsmith. Les [sources de son blog](https://github.com/RobinThrift/RobinThrift.com) sont également disponibles et forment une excellente base pour démarrer.

En dehors de ces références, la documentation reste encore famélique. Je documente ici les problèmes auxquels j'ai été confrontés et les techniques que j'ai employées pour les résoudre.

## Cohabitation avec Gulp

Avant toute chose, j'ai intégré Metalsmith à un script Gulp afin de générer automatiquement les pages HTML à chaque modification de fichier source et de bénéficier du live-reload dans le navigateur. 
Pour cela j'ai encapsulé le script de génération Metalsmith dans un module CommonJs pour l'appeler ensuite depuis le fichier gulpfile.js.

metalsmith.js:
```javascript
var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    include  = require('metalsmith-include'),
    templates  = require('metalsmith-templates');

module.exports = function metalSmith(){
  return Metalsmith(__dirname)
    .use(include())
    .use(markdown())
    .use(templates('handlebars')
    .destination('./build')
    .build(function(err,files){
      if (err){ console.log(err); }
    });
};
```
gulpfile.js : 
```javascript
var gulp = require("gulp");
var browserSync = require('browser-sync');

gulp.task('default', ['server', 'watch']);

gulp.task('server', function () {
  return browserSync.init(['build/js/*.js', 'build/main.css', 'build/index.html'], {
    server: {
      baseDir: './build'
    }
  });
});

gulp.task('watch', function(){
        gulp.watch('./src/content/**/*', ['build']);
        gulp.watch('./src/styles/**/*', ['build']);
        gulp.watch('./src/*.md', ['build']);
        gulp.watch('./templates/**/*', ['build']);
});

gulp.task('build', function(){
        require('./metalSmith')();
});
```

Notez dans metalsmith.js l'interception finale des erreurs, bien utile pour le débogage.

## Utilisation de Jade

J'ai remplacé le système de template Handlebars par [Jade](http://jade-lang.com) dont j'apprécie l'élégance et la concision.
Jade autorise l'utilisation de bibliothèques externes, mais à la différence d'Handlebars, il faut explicitement les déclarer dans les options lors de l'appel de la fonction _templates()_. Ici j'utilise la bibliothèque de manipulation des dates [moment](http://momentjs.com/) : 


```javascript
var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    include  = require('metalsmith-include'),
    templates  = require('metalsmith-templates');

// Template helpers
var moment = require('moment');

module.exports = function metalSmith(){
  return Metalsmith(__dirname)
    .use(include())
    .use(markdown())
    .use(templates({
        engine: 'jade',
        moment: moment
        }))
    .destination('./build')
    .build(function(err,files){
      if (err){ console.log(err); }
    });
};
```

On peut ensuite utiliser _moment_ dans les templates : 
```jade
extends base
block content
  .post
    h2!= title
    .metas
      - moment.locale('fr')
      span.date!= "Publié le " + moment(date).format("dddd DD MMMM YYYY")
    div!= contents
```


