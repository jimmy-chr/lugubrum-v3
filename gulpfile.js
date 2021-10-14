const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");

// Browser server
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: "./dist",
    },
  });
  cb();
}

// Browser reload
function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Process html
function html() {
  return gulp
    .src("./src/*.html")
    .pipe(fileinclude())
    .on("error", function () {
      notify("HTML include error");
    })
    .pipe(gulp.dest("dist/"));
}

// Process images
function images() {
  return gulp
    .src("src/images/**/*.{png,gif,jpg}")
    .pipe(gulp.dest("dist/images/"));
}

// Process images
function css() {
  return gulp.src("src/styling/**/*.css").pipe(gulp.dest("dist/styling/"));
}

// Watch Task
function watchTask() {
  gulp.watch("./src/*.html", gulp.series(html, browsersyncReload));
  gulp.watch(
    "./src/images/**/*.{png,gif,jpg}",
    gulp.series(images, browsersyncReload)
  );
  gulp.watch("src/styling/**/*.css", css);
}

const build = gulp.parallel(images, html, css);
const watch = gulp.parallel(watchTask, browsersyncServe);

// export tasks
exports.build = build;
exports.watch = watch;
exports.default = build;
