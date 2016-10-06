module.exports = function(grunt) {
  // Loads each task referenced in the packages.json file
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  require('time-grunt')(grunt);

  // Initiate grunt tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    moment: require('moment'),
    // Tasks


    sass: {
      options: {
      },
      dist: {
        files: {
          'build/<%= pkg.name %>.css': 'app/assets/sass/p360.scss'
        }
      }
    },


    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9']
        //diff: 'build/config/*.diff'
      },
      prefix: {
        expand: true,
        //flatten: true,
        src: 'build/*.css'
        //dest: 'tmp/css/prefixed/'
      }
    },
    css_important: {
      options: {
        minified: true,
        // Task-specific options go here.
      },
      files: {
        'build/p360-important.css': ['build/p360.css']
      },
    },
    cssmin: {
      main: {
        options: {
          banner: '/*! <%= pkg.name %> v<%= pkg.version %> by <%= pkg.author %>, released: <%= moment().format("HH:mm DD-MM-YYYY") %> */',
          keepSpecialComments: 1
        },
        expand: true,
        cwd: 'build',
        src: ['*.css', '!*.min.css'],
        dest: 'build/',
        ext: '.v<%= pkg.version %>.min.css'
      }
    },
    copy: {
      dist: {
        expand: true,
        cwd: 'build/',
        src: '**',
        dest: 'dist',
        filter: 'isFile'
      },
    },
    clean: {
      options: {
        force: true
      },
      dist: ['dist/**/*'],
      deploy: ['deploy/**/*'],
      build: ['build/**/*']
    },

    versioning: {
      options: {
        cwd: 'build/',
        outputConfigDir: 'build/',
        namespace: 'hiof'
      },
      build: {
        files: [{
          assets: [{
            src: 'build/<%= pkg.name %>.v<%= pkg.version %>.min.css',
            dest: 'build/<%= pkg.name %>.v<%= pkg.version %>.min.css'
          }],
          key: 'assets',
          dest: '',
          type: 'css',
          ext: '.min.css'
        }]
      },
      deploy: {
        options: {
          output: 'php',
          outputConfigDir: 'build/',
        },
        files: [{
          assets: [{
            src: 'build/<%= pkg.name %>.v<%= pkg.version %>.min.css',
            dest: 'build/<%= pkg.name %>.v<%= pkg.version %>.min.css'
          }],
          key: 'assets',
          dest: '',
          type: 'css',
          ext: '.min.css'
        }
      ]
    }
  },
});

//grunt.registerTask('subtaskJs', ['jshint', 'concat:scripts', 'uglify']);
grunt.registerTask('subtaskCss', ['sass', 'autoprefixer', 'cssmin', 'css_important']);


grunt.registerTask('build', ['clean:build', 'clean:dist', 'subtaskCss', 'versioning:build']);
grunt.registerTask('dist', ['clean:build', 'clean:dist', 'subtaskCss', 'versioning:build', 'copy:dist']);
grunt.registerTask('deploy', ['clean:build', 'clean:dist', 'subtaskCss', 'versioning:deploy', 'copy:dist']);



//grunt.registerTask('deploy-stage', ['deploy', 'sftp:stage']);
//grunt.registerTask('deploy-prod', ['deploy', 'sftp:prod']);

};
