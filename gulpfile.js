// Here, we use dotenv  to load our env vars in the .env, into process.env
require('dotenv').load();

var es = require('event-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var merge = require('gulp-merge-json');
var scripts = require('./app.scripts.json');

var ngConfig = require('gulp-ng-config');
var fs = require('graceful-fs');
var config = require('./config.js');

var zip = require('gulp-zip');
var archiver = require('archiver')('zip');
var through = require('through2');
var filter = require('gulp-filter');
var path = require('path');


// Set Production Build.
// From command line: $> gulp --production
// or set PRODUCTION as true here implicitly.
var PRODUCTION = !!gutil.env.production || false;
var PROFILE = gutil.env.profile || 'development';

console.log("PRODUCTION: " + PRODUCTION);
console.log("PROFILE: " + PROFILE);

var source = {
  js: {
    main: 'app/main.js',
    src: [
      // application config
      'app.config.js',
      // application bootstrap file
      'app/main.js',
      // main module
      'app/app.js',
      // module files
      'app/**/module.js',
      // other js files [controllers, services, etc.]
      'app/**/!(module)*.js',
      // application environment configuration file
      'app/config.js',
    ],
    tpl: 'app/**/*.tpl.html'
  },
  msg: [
    'messages/**/*.json'
  ],
  zip: [
    'build/**/*',
    'index.html',
    'app/**/*.html',
    '!app/**/*.tpl.html',
    'styles/**/*',
    'app.scripts.json',
    //Lazy scripts loading (not included in vendor.js)
    'plugin/relayfoods-jquery.sparkline/dist/jquery.sparkline.min.js',
    'plugin/jqgrid/js/minified/jquery.jqGrid.min.js',
    'plugin/jqgrid/js/i18n/grid.locale-en.js',
    'plugin/jquery-maskedinput/dist/jquery.maskedinput.min.js',
    'plugin/jquery-validation/dist/jquery.validate.min.js',
    'plugin/fuelux/js/wizard.js',
    'plugin/ckeditor/**'
  ]
};

var destinations = {
  js: 'build'
};

/*
 *  We first generate the json file that gulp-ng-config uses as input.
 *  Then we source it into our gulp task.
 *  The env constants will be a saved as a sub-module app.config
 */
gulp.task('ng-config', function() {

  fs.writeFileSync('./config.json',
    JSON.stringify(config[PROFILE]));
  gulp.src('./config.json')
    .pipe(
      ngConfig('app.config', {
        createModule: true,
        pretty: true
      })
    )
    .pipe(gulp.dest('./app/'))
});

/**
 * Build tasks.
 */
gulp.task('build', function() {
  return es.merge(gulp.src(source.js.src), getTemplateStream())
    .pipe(plumber({ handleError: swallowError }))
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(gulp.dest(destinations.js))
    .pipe(connect.reload());
});

gulp.task('build:lite', function() {
  return es.merge(gulp.src(source.js.src), getTemplateStream())
    .pipe(plumber({ handleError: swallowError }))
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(gulp.dest(destinations.js));
});

gulp.task('build:prod', function() {
  return es.merge(gulp.src(source.js.src), getTemplateStream())
    .pipe(plumber({ handleError: swallowError }))
    .pipe(babel())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest(destinations.js));
});

/**
 * Vendor tasks.
 */
gulp.task('vendor', function() {
  var paths = [];
  scripts.prebuild.forEach(function(script) {
    paths.push(scripts.paths[script]);
  });
  gulp.src(paths)
    .pipe(plumber({ handleError: swallowError }))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(destinations.js))
    .pipe(connect.reload());
});

gulp.task('vendor:lite', function() {
  var paths = [];
  scripts.prebuild.forEach(function(script) {
    paths.push(scripts.paths[script]);
  });
  gulp.src(paths)
    .pipe(plumber({ handleError: swallowError }))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(destinations.js));
});

gulp.task('vendor:prod', function() {
  var paths = [];
  scripts.prebuild.forEach(function(script) {
    paths.push(scripts.paths[script]);
  });
  gulp.src(paths)
    .pipe(plumber({ handleError: swallowError }))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(destinations.js));
});

/**
 * Messages tasks.
 */
gulp.task('messages', function() {
  return gulp.src(source.msg)
    .pipe(merge('msg-el.json'))
    .pipe(gulp.dest(destinations.js));
});


gulp.task('connect', [PRODUCTION ? 'build:prod' : 'build'], function() {
  var app = connect.server({
    port: 8889,
    livereload: true
    // root: ['.']
  });

  
  
});

gulp.task('connect:lite', ['build:lite'], function() {
  connect.server({
    port: 8889,
    livereload: false
    // root: ['.']
  });
});

/**
 * Watch tasks.
 */
gulp.task('watch', function() {
  gulp.watch([source.js.src, source.js.tpl], [PRODUCTION ? 'build:prod' : 'build']);
  //gulp.watch(destinations.js, ['livereload']);
});

gulp.task('watch:lite', function() {
  gulp.watch([source.js.src, source.js.tpl], ['build:lite']);
});

/**
 * Create zip file (cregview-1.03.002.zip)
 * containing only files needed
 */
gulp.task('zip', function () {

  var zip = fs.createWriteStream('dist/' + config[PROFILE].ENV_VARS.name +
    '-' + config[PROFILE].ENV_VARS.version + '-' + config[PROFILE].ENV_VARS.profile.toUpperCase() + '.zip');

  archiver.pipe(zip);

  return gulp.src(source.zip)
    .pipe(filter((file) => !file.stat.isDirectory()))
    .pipe(through.obj((file, encoding, cb) => {
      var pathInZip = path.relative(file.cwd, file.path);
          archiver.append(file.contents, {
            name: pathInZip,
            mode: file.stat
          });
      cb(null, file);
      }, cb => {
        zip.on('finish', cb);
        archiver.finalize();
      }
    ));
});

/**
 * Default tasks.
 */
gulp.task('default', [
  'ng-config',
  PRODUCTION ? 'vendor:prod' : 'vendor',
  PRODUCTION ? 'build:prod' : 'build',
  'messages',
  'connect',
  'watch'
]);

gulp.task('default:lite', [
  'ng-config',
  'vendor:lite',
  'build:lite',
  'messages',
  'connect:lite',
  'watch:lite'
]);

/**
 * Package task (Build and Zip)
 */
gulp.task('package', [
  'ng-config',
  PRODUCTION ? 'vendor:prod' : 'vendor',
  PRODUCTION ? 'build:prod' : 'build',
  'messages'
], function () {
  gulp.run('zip');
});

/**
 * Utilities.
 */
var swallowError = function(error) {
  console.log(error.toString());
  this.emit('end');
};

var getTemplateStream = function() {
  return gulp.src(source.js.tpl)
    .pipe(templateCache({
      root: 'app/',
      module: 'app'
    }));
};
