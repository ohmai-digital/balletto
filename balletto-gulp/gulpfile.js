var gulp = require('gulp');
var fs = require('fs');

var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var babelPreset = {
  presets: ['es2015'],
  plugins: ['transform-es2015-modules-commonjs']
}

var packageSettings = JSON.parse(fs.readFileSync('./package.json'));
var filePrefix = packageSettings.filePrefix || ''

gulp.task('sass', function () {
    return gulp.src(['assets/styles/**/*.css', 'assets/styles/*.scss'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass().on('error', sass.logError))
        //.pipe(concat('main.css'))
        .pipe(cssmin())
        .pipe(rename({prefix: filePrefix, suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/arquivos/'));
});

gulp.task('scripts', function() {
    return gulp.src(['assets/scripts/**/*.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel(babelPreset))
        .on('error', swallowError)
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(rename({prefix: filePrefix, suffix: '.min' }))
        .pipe(gulp.dest('build/arquivos/'));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('assets/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss'
  }));
  return spriteData.pipe(gulp.dest('build/arquivos'));
});

gulp.task('watch', function() {
    gulp.watch('assets/scripts/**/*.js',['scripts']);
    gulp.watch('assets/styles/**/*.scss',['sass']);
    gulp.watch('assets/images/**', ['images']);
});

gulp.task('default', ['watch', 'sass', 'scripts','sprite' ]);
gulp.task('server', ['watch']);
gulp.task('build',  ['sass', 'scripts','sprite' ]);
gulp.task('js', ['scripts']);

function swallowError (error) {
  console.log(error.toString());
  this.emit('end');
}
