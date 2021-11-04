const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const notify = require("gulp-notify");
const sass = require("gulp-sass")(require("sass"));
const { SiteChecker } = require("broken-link-checker");

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
    .pipe(gulp.dest("./dist/"));
}

// Process images
function images() {
  return gulp
    .src("./src/images/*.{png,gif,jpg}")
    .pipe(gulp.dest("./dist/images/"));
}

// Process css
function css() {
  // return gulp.src("src/styling/*.css").pipe(gulp.dest("dist/styling/"));
  return gulp
    .src("./src/styling/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./dist/styling/"));
}

// Process mp3 audio files
function audio() {
  return gulp.src("./src/audio/*.mp3").pipe(gulp.dest("./dist/audio/"));
}

// Favicon
function favicon() {
  return gulp.src("./src/favicon/*.*").pipe(gulp.dest("./dist/"));
}

// Watch task
function watchTask() {
  gulp.watch("./src/**/*.html", gulp.series(html, browsersyncReload));
  gulp.watch(
    "./src/images/**/*.{png,gif,jpg}",
    gulp.series(images, browsersyncReload)
  );
  gulp.watch("src/styling/**/*.scss", gulp.series(css, browsersyncReload));
}

// Broken link checker
function checkLinks() {
  const siteChecker = new SiteChecker(
    {
      excludeInternalLinks: false,
      excludeExternalLinks: false,
      filterLevel: 3,
      acceptedSchemes: ["http", "https"],
      excludedKeywords: [
        "linkedin",
        "facebook",
        "twitter",
        "reddit",
        "youtube",
        "ycombinator",
        "namecheap",
      ],
      excludeLinksToSamePage: false,
    },
    {
      robots: function (robots, customData) {},
      html: function (tree, robots, response, pageUrl, customData) {},
      junk: function (result, customData) {
        // console.log(result);
      },
      link: function (result, customData) {
        if (result.broken) {
          console.log(result);
        }
      },
      page: function (error, pageUrl, customData) {},
      site: function (error, siteUrl, customData) {},
      end: function () {
        console.log("checkLinks done");
      },
    }
  );

  siteChecker.enqueue("http://localhost:3000/");
}

const build = gulp.parallel(images, html, css, audio, favicon);
const watch = gulp.series(build, gulp.parallel(watchTask, browsersyncServe));

// Export tasks
exports.build = build;
exports.watch = watch;
exports.default = build;
exports.checkLinks = checkLinks;
