var gulp = require('gulp');
var postcss = require('gulp-postcss');
var cssnext = require('cssnext');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var precss = require('precss');
var stylelint = require('stylelint');
var reporter = require("postcss-reporter")

/*
  Other interesting looking Postcss plugins I'd consider:

  - rucksack: introduces new property shorthand syntax and aliases, amongst other 
      crazy new features.
  - doiuse: linter that validates based off of caniuse.com

*/

var paths = {
  preCss: './preCss/**/*.css',
  cssDir: './css',
  distDir: './dist',
  css: './css/**/*.css'
}

var processor = [
  autoprefixer,
  cssnext,
  precss
];

gulp.task('default', ['watch','build']);

gulp.task('css', function() {
  return gulp.src( paths.preCss )
    .pipe( postcss( processor ) )
    .pipe( gulp.dest( paths.cssDir ) );
});

gulp.task('lint', function() {
  return gulp.src( paths.css )
    .pipe(postcss([
      stylelint({
        "rules": {
          "color-no-invalid-hex": 2,
          "no-eol-whitespace": 2,
          "declaration-colon-space-before": [2, "never"],
          // indentation only accepts tabs, which is annoying
          "indentation": [2, "tab"],
          "number-leading-zero": [2, "always"]
        }
      }),
      reporter({
        clearMessages: true
      })
    ]))
});

gulp.task('watch', function() {
  gulp.watch(paths.preCss, ['css','lint']);
});

gulp.task('build', function(){
  return gulp.src( paths.css )
    .pipe( postcss([cssnano]) )
    .pipe( gulp.dest(paths.distDir) );
});