var gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  sass = require("gulp-sass");

// Compile sass into CSS & auto-inject into browsers
gulp.task(
  "sass",
  gulp.series(function () {
    return gulp
      .src("app/scss/*.scss")
      .pipe(sass())
      .pipe(gulp.dest("app/css"))
      .pipe(browserSync.stream());
  })
);

// Static Server + watching scss/html files
gulp.task(
  "serve",
  gulp.series("sass", function () {
    browserSync.init({
      server: "./app",
      // or
      // proxy: 'yourserver.dev'
    });

    gulp.watch("app/scss/*.scss", ["sass"]);
    gulp.watch("app/*.html").on("change", browserSync.reload);
  })
);

gulp.task("default", gulp.series("serve"));
