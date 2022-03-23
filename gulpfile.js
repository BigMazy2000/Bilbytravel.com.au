import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import del from 'del';
import browser from 'browser-sync';


// Styles
const styles = () => {
  return gulp.src('source/less/style.less', {
      sourcemaps: true
    })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', {
      sourcemaps: '.'
    }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(gulp.dest('build'));
}

// Scripts

// const jsfile = [
//   'source/js/script.js'
// ];
// const scripts = (js_files) => {
//   return gulp.src(js_files)
//     .pipe(plumber())
//     .pipe(stripComments({
//       precision: false
//     }))
//     .pipe(terser())
//     .pipe(concat('functions.js'))
//     .pipe(gulp.dest('build/js/'))
//     .pipe(browser.stream());
// };

// Copy

const copy = (done) => {
  gulp.src([
      'source/fonts/*.{woff2,woff}',
      'source/*.ico',
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('build'))
  done();
}

// Clean

const clean = () => {
  return del('build');
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
    //browser: 'C:\\Program Files\\Firefox Developer Edition\\firefox.exe',
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  //gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

//Build

export const build = gulp.series(
  clean,
  copy,
  gulp.parallel(
    styles,
    html,
    //scripts
  ),
);

// Default

export default gulp.series(
  clean,
  copy,
  gulp.parallel(
    styles,
    html,
    //scripts,
  ),
  gulp.series(
    server,
    watcher
  ));