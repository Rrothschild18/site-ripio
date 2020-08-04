const gulp = require("gulp");
const pkg = require("./package.json");
const $ = require("gulp-load-plugins")({
	pattern: ["*"],
	scope: ["devDependencies"],
});
const { EventEmitter } = require("events");

const onError = (err) => {
	console.log(err);
};

const banner = [
	"/* @project        <%= pkg.name %>",
	" * @author         <%= pkg.author %>",
	" * @version         <%= pkg.version %>",
	" * @build          " + $.moment().format("YYYY-MM-DD HH:mm") + "",
	" * @copyright      Copyright (c) " +
		$.moment().format("YYYY") +
		", <%= pkg.copyright %>",
	" */",
].join("\n");

function scss() {
	$.fancyLog("-> Compiling scss");
	return gulp
		.src(pkg.paths.src.styles + pkg.vars.scssName)
		.pipe($.sassGlobImport())
		.pipe($.sass()) // Using gulp-sass
		.pipe($.autoprefixer())
		.pipe(gulp.dest(pkg.paths.src.stylesDist))
		.pipe($.livereload({ start: true }));
}

function css() {
	$.fancyLog("-> Building css");
	return gulp
		.src(pkg.globs.distCss)
		.pipe($.plumber({ errorHandler: onError }))
		.pipe($.print())
		.pipe($.sourcemaps.init({ loadMaps: true }))
		.pipe($.concat(pkg.vars.siteCssName))
		.pipe(
			$.cssnano({
				discardComments: {
					removeAll: true,
				},
				discardDuplicates: true,
				discardEmpty: true,
				minifyFontValues: true,
				minifySelectors: true,
			})
		)
		.pipe($.header(banner, { pkg: pkg }))
		.pipe($.sourcemaps.write("./"))
		.pipe($.size({ gzip: true, showFiles: true }))
		.pipe(gulp.dest(pkg.paths.build.css))
		.pipe($.livereload());
}

function js() {
	$.fancyLog("-> Building js");
	return gulp
		.src(pkg.globs.distJs)
		.pipe($.concat(pkg.vars.siteJsName))
		.pipe($.plumber({ errorHandler: onError }))
		.pipe($.if(["*.js", "!*.min.js"], $.uglify()))
		.pipe($.if(["*.js", "!*.min.js"], $.rename({ suffix: ".min" })))
		.pipe($.header(banner, { pkg: pkg }))
		.pipe($.sourcemaps.write("./"))
		.pipe($.size({ gzip: true, showFiles: true }))
		.pipe(gulp.dest(pkg.paths.build.js))
		.pipe($.filter("**/*.js"))
		.pipe($.livereload());
}

function imagemin() {
	return gulp
		.src(pkg.paths.src.img + "**/*")
		.pipe(
			$.imagemin({
				progressive: true,
				interlaced: true,
				optimizationLevel: 7,
				svgoPlugins: [{ removeViewBox: false }],
				verbose: true,
				use: [],
			})
		)
		.pipe(gulp.dest(pkg.paths.build.img));
}

function fonts() {
	return gulp
		.src(pkg.paths.src.fonts + "**/*")
		.pipe(gulp.dest(pkg.paths.build.fonts));
}

function fontello() {
	return gulp
		.src(pkg.paths.src.fontello + "config.json")
		.pipe($.fontello())
		.pipe($.print())
		.pipe(gulp.dest(pkg.paths.build.fontello));
}

function watch() {
	gulp.watch([pkg.paths.src.styles + "**/*.scss"], gulp.series([scss, css]));
	gulp.watch([pkg.paths.src.js + "**/*"], js);
	gulp.watch([pkg.paths.src.img + "**/*"], imagemin);
}

exports.default = gulp.parallel(css, js, fonts, imagemin);
exports.css = css;
exports.watch = gulp.parallel(watch);
exports.scss = scss;
exports.js = js;
exports.imagemin = imagemin;
exports.fonts = fonts;
exports.fontello = fontello;

// // -----------------------------------------------------------------------------
// // Default watch
// // -----------------------------------------------------------------------------
// gulp.task("watch", ["scss", "browserSync"], () => {
// 	$.livereload.listen();
// 	gulp.watch([pkg.paths.src.styles + "**/*"], ["scss"]);
// });

// // -----------------------------------------------------------------------------
// // Live-Reload
// // -----------------------------------------------------------------------------

// // -----------------------------------------------------------------------------
// // js task - minimize any distribution Javascript
// // -----------------------------------------------------------------------------
// gulp.task("js", () => {
// 	$.fancyLog("-> Building js");
// 	return gulp
// 		.src(pkg.globs.distJs)
// 		.pipe($.concat(pkg.vars.siteJsName))
// 		.pipe($.plumber({ errorHandler: onError }))
// 		.pipe($.if(["*.js", "!*.min.js"], $.uglify()))
// 		.pipe($.if(["*.js", "!*.min.js"], $.rename({ suffix: ".min" })))
// 		.pipe($.header(banner, { pkg: pkg }))
// 		.pipe($.sourcemaps.write("./"))
// 		.pipe($.size({ gzip: true, showFiles: true }))
// 		.pipe(gulp.dest(pkg.paths.build.js))
// 		.pipe($.filter("**/*.js"))
// 		.pipe($.livereload());
// });
