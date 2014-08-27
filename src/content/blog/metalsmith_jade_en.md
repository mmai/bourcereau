---
title: Using Metalsmith with Jade
date: 2014-08-20
tags: metalsmith, jade, gulp, static, javascript
lang: en
template: post.jade
---

I made this site with a static pages generator. Several reasons for that: ease of hosting and archiving, performance ... and then I just gave in to fashion!

The best known tools are [Jekyll](http://jekyllrb.com/) used to make Github pages, or [Pelican](http://blog.getpelican.com/) in the Python world, but I choose [Metalsmith](http://www.metalsmith.io/), a modular javascript solution, very easy to extend, and benefiting from the huge ecosystem of libraries available on npm.

Robin Thrift wrote a [very good three parts introductory tutorial](http://www.robinthrift.com/posts/metalsmith-part-1-setting-up-the-forge/) on  Metalsmith. The [sources of his blog](https://github.com/RobinThrift/RobinThrift.com) are also available and are an excellent basis to start.

Apart from these references, the documentation is quite poor. I document here the problems I faced and the techniques I used to solve them.

## Gulp

First of all, I inserted Metalsmith into a Gulp script. The gulp script enable live-reload in the browser and automatically generate HTML pages each time a source file is modified.
For this I encapsulated the Metalsmith generation script in a CommonJS module in order to call it from the gulpfile.js file.

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

Notice the final error handling in metalsmith.js, very useful when debugging.

## Jade configuration

I replaced Handlebar by the elegant and concise [Jade](http://jade-lang.com) as a template system.
Jade allows external libraries usage, but unlike Handlebars, you must explicitly declare them in the options when calling the _templates()_ function. Here I use [Moment.js](http://momentjs.com/), a dates manipulation library.


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

We can then use _moment.js_ in the templates:
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


