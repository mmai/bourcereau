var gulp = require("gulp");

var lr = require('tiny-lr')();//Live reload

var EXPRESS_ROOT = __dirname + '/build';
function startExpress() {
  var EXPRESS_PORT = 4000;
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')());

  express.static.mime.define({'text/html': ['html', 'php']});
  app.use(express.static(EXPRESS_ROOT));
  app.listen(EXPRESS_PORT);
  require('open')('http://localhost:' + EXPRESS_PORT);

  //Start livereload
  lr.listen(35729);
}
 
// Notifies livereload of changes detected by `gulp.watch()` 
function notifyLivereload(event) {
  var fileName = require('path').relative(EXPRESS_ROOT, event.path);
  lr.changed({
    body: { files: [fileName] }
  });
}
 
gulp.task('default', function () {
  startExpress();
  gulp.watch('build/**/*', notifyLivereload);
});

gulp.task('build', function(){
        require('./metalSmith')();
});

gulp.task('watch', function(){
        gulp.watch('./src/content/**/*', ['build']);
        gulp.watch('./src/styles/**/*', ['build']);
        gulp.watch('./templates/**/*', ['build']);
});
