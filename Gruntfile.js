module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        watch: {

            css: {
                files: ['css/**/*.css'],
                tasks: ['css']
            },

            js: {
                files: ['js/**/*.js'],
                tasks: ['js']
            },

            livereload: {
                files: ['index.html', 'dist/app.css', 'dist/app.js'],
                options: {
                    livereload: true
                }
            }
        },

        jshint: {
            options: {
                smarttabs: true,
                eqeqeq: true,
                newcap: true,
                eqnull: true
            },
            gruntfile: {
                options: {
                    globals: {
                        module: true
                    }
                },
                files: {
                    src: ['Gruntfile.js']
                }
            },
            src: {
                files: {
                    src: ['js/**/*.js']
                }
            }
        },

        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer-core')(),
                    require('precss')(),
                    require('cssnano')()
                ]
            },
            dist: {
                src: 'css/app.css',
                dest: 'dist/app.css'
            }
        },

        uglify: {
            dist: {
                options: {
                    sourceMap: true
                },
                files: {
                    'dist/app.js': [
                        'js/mancala/mancala.js',
                        'js/mancala/move-stones.js',
                        'js/mancala/check-winner.js',

                        'js/game/game.js',
                        'js/game/draw-stones.js',
                        'js/game/save-manager.js',

                        'js/app.js'
                    ]
                }
            }
        }
    });

    grunt.registerTask( 'css', ['postcss'] );
    grunt.registerTask( 'js', ['jshint', 'uglify'] );
    grunt.registerTask( 'default', ['css', 'js'] );
};
