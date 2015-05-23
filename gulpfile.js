var gulp          = require('gulp')
    , coffee      = require('gulp-coffee')
    , stylus      = require('gulp-stylus')
    , imagemin    = require('gulp-imagemin')
    , jade        = require('gulp-jade')
    , prefix      = require('gulp-autoprefixer')
    , minifyCSS   = require('gulp-minify-css')
    , concat      = require('gulp-concat')
    , deploy      = require('gulp-gh-pages')
    , dirs = {
        'source': {
            coffee:     './developer/coffee/**/*.coffee'
            , images:     './developer/images/**'
            , stylus:     './developer/styl/**/*.styl'
            , jade:       './developer/*.jade'
          }
        , 'build': {
            css:        './build/css/'
            , images:   './build/images/'
            , js:       './build/js/'
            , html:     './build/'
          }
        };


gulp.task('stylus', function () {
  return gulp.src(dirs.source.stylus)
    .pipe(stylus())
    .pipe(prefix())
    .pipe(minifyCSS({removeEmpty:true}))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(dirs.build.css));
});

gulp.task('jade', function () {
  return gulp.src(dirs.source.jade)
    .pipe(jade())
    .pipe(gulp.dest(dirs.build.html));
});

gulp.task('coffee', function () {
  return gulp.src(dirs.source.coffee)
    .pipe(coffee())
    .pipe(gulp.dest(dirs.build.js));
});

gulp.task('images', function () {
  return gulp.src(dirs.source.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(dirs.build.images));
});

gulp.task('watch', function () {
  gulp.watch(dirs.source.coffee, ['coffee']);
  gulp.watch(dirs.source.images, ['images']);
  gulp.watch(dirs.source.jade, ['jade']);
  gulp.watch(dirs.source.stylus, ['stylus']);
});

gulp.task('deploy', function () {
  console.log('deploying');
  return gulp.src('build/**')
          .pipe(deploy({
            cacheDir:   'gh-cache',
            remoteUrl:  'git@github.com:SilentImp/offline-first.git'
          }).on('error', function(){
            console.log('error', arguments);
          }));
});


gulp.task('default', ['stylus','jade','coffee', 'images', 'watch']);
