module.exports = function (gulp, plugins) {
	gulp.task('compileAssets', function(cb) {
		plugins.sequence(
			'jst:dev',
			'rubySass:dev',
            'clean:dev',
			'copy:dev',
			//'coffee:dev',
			cb
		);
	});
};
