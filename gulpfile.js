var env     = process.env.NODE_ENV || 'development';

var gulp    = require('gulp');
var $       = require('gulp-load-plugins')({ lazy: false });

gulp.task('default', function(done) {
    $.nodemon({ script: 'server/app.js', ext: 'js' });
});