/**
 * Copy files and folders.
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Copies all directories and files, exept coffescript and less fiels, from the sails
 * assets folder into the .tmp/public directory.
 *
 * # build task config
 * Copies all directories nd files from the .tmp/public directory into a www directory.
 *
 */
var reName    = require('gulp-rename');

module.exports = function(gulp, plugins, growl) {
    gulp.task('copy:vendor', function(){
        return gulp.src([ 'assets/vendors/angular/angular.min.js', 'assets/vendors/angular-sails/angular-sails.min.js',
                          'assets/vendors/sails.io.js/dist/sails.io.js', 'assets/vendors/custom-ng-bootstrap/ui-bootstrap-0.12.1.min.js',
                          'assets/vendors/custom-ng-bootstrap/ui-bootstrap-tpls-0.12.1.min.js'])
          .pipe(gulp.dest('assets/js/depends'))
          .pipe(plugins.if(growl, plugins.notify({ message: 'Moving Bower Vendor files task complete' })));
    });

    gulp.task('copy:fonts', function() {
        return gulp.src(['assets/vendors/bootstrap-sass/assets/fonts/bootstrap/*.{ttf,woff,woff2,eof,svg}'])
            .pipe(gulp.dest('assets/styles/fonts'))
            .pipe(plugins.if(growl, plugins.notify({ message: 'Copy fonts task complete' })));
    });

	gulp.task('copy:dev', function() {
		return gulp.src(['./assets/**/*.!(coffee|less|scss)', 'assets/styles/css/main.css', '!assets/vendors/**', '!assets/images{,/**}'])
				.pipe(gulp.dest('.tmp/public'))
				.pipe(plugins.if(growl, plugins.notify({ message: 'Copy dev task complete' })));
	});

    gulp.task('copy:build', function() {
		return gulp.src('.tmp/public/**/*')
				.pipe(gulp.dest('www'))
				.pipe(plugins.if(growl, plugins.notify({ message: 'Copy build task complete' })));
	});
};
