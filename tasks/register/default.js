module.exports = function (gulp, plugins) {
	gulp.task('default', function(cb) {
		plugins.sequence(
            'copy:fonts',
            'copy:vendor',
            'copy:dev',
			'compileAssets',
			['images', 'linkAssets'],
			['watch:api', 'watch:assets'],
			cb
		);
	});
};
