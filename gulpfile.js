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
