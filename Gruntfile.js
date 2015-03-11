/**
 * Gruntfile
 *
 * If you created your Sails app with `sails new foo --linker`,
 * the following files will be automatically injected (in order)
 * into the EJS and HTML files in your `views` and `assets` folders.
 *
 * At the top part of this file, you'll find a few of the most commonly
 * configured options, but Sails' integration with Grunt is also fully
 * customizable.  If you'd like to work with your assets differently
 * you can change this file to do anything you like!
 *
 * More information on using Grunt to work with static assets:
 * http://gruntjs.com/configuring-tasks
 */
var lodash = require('lodash');

module.exports = function(grunt) {



    /**
     * CSS files to inject in order
     * (uses Grunt-style wildcard/glob/splat expressions)
     *
     * By default, Sails also supports LESS in development and production.
     * To use SASS/SCSS, Stylus, etc., edit the `sails-linker:devStyles` task
     * below for more options.  For this to work, you may need to install new
     * dependencies, e.g. `npm install grunt-contrib-sass`
     */

    var cssFilesToInject = [
        '.tmp/public/styles/css/main.css'
    ];


    /**
     * Javascript files to inject in order
     * (uses Grunt-style wildcard/glob/splat expressions)
     *
     * To use client-side CoffeeScript, TypeScript, etc., edit the
     * `sails-linker:devJs` task below for more options.
     */

    var jsFilesToInject = [
        '.tmp/public/js/depends/*.js',
        '.tmp/public/js/app.js'
    ];


    /**
     * Client-side HTML templates are injected using the sources below
     * The ordering of these templates shouldn't matter.
     * (uses Grunt-style wildcard/glob/splat expressions)
     *
     * By default, Sails uses JST templates and precompiles them into
     * functions for you.  If you want to use jade, handlebars, dust, etc.,
     * edit the relevant sections below.
     */



    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    //
    // DANGER:
    //
    // With great power comes great responsibility.
    //
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////

    // Modify css file injection paths to use
    cssFilesToInject = cssFilesToInject.map(function(path) {
        return '.tmp/public/' + path;
    });

    // Modify js file injection paths to use
    jsFilesToInject = jsFilesToInject.map(function(path) {
        return '.tmp/public/' + path;
    });




    // Get path to core grunt dependencies from Sails
    var path = require('path');
    var depsPath = 'node_modules';
    grunt.task.loadTasks("tasks");
    grunt.loadTasks(path.join(depsPath, '/grunt-contrib-clean/tasks'));
    grunt.loadTasks(path.join(depsPath, '/grunt-contrib-copy/tasks'));
    grunt.loadTasks(path.join(depsPath, '/grunt-contrib-concat/tasks'));
    grunt.loadTasks(path.join(depsPath, '/grunt-sails-linker/tasks'));
    grunt.loadTasks(path.join(depsPath, '/grunt-contrib-jst/tasks'));
    grunt.loadTasks(path.join(depsPath, '/grunt-contrib-watch/tasks'));
    grunt.loadTasks(path.join(depsPath, '/grunt-contrib-uglify/tasks'));
    grunt.loadTasks(path.join(depsPath, '/grunt-contrib-cssmin/tasks'));
    grunt.loadTasks(path.join(depsPath, '/grunt-contrib-sass/tasks'));
    //  grunt.loadTasks(path.join(depsPath, '/grunt-contrib-compass/tasks'));
    grunt.loadTasks(path.join(depsPath, '/grunt-sync/tasks'));
    grunt.loadNpmTasks("grunt-remove-logging");


    //creating a grunt watch to update everytime a js or .scss file changes
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            prod : {
                files : [
                    {
                        expand: true,
                        cwd: 'dist/min',
                        src: ['**/*'],
                        dest: '.tmp/public/min'
                    }
                ]
            },

            prodfonts : {
                files : [
                    {
                        expand: true,
                        cwd: 'assets/styles/fonts',
                        src: ['**/*'],
                        dest: '.tmp/public/min/fonts'
                    }
                ]
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '.tmp/public',
                    src: ['**/*'],
                    dest: 'www'
                }]
            }
        },

        sync: {
            dev: {
                files: [{
                    cwd: './assets',
                    src: ['**/*.!(coffee)','!**/lib/bootstrap-sass-official/**', '!**/lib/ns-custom/**'],
                    dest: '.tmp/public'
                }]
            }
        },

        clean: {
            dev: ['.tmp/public/**'],
            dest: 'www'
        },


        sass: {
            options: {
                style: 'expanded',
                sourcemap: 'none'
            },
            dist: {
                files: {
                    "assets/styles/css/production.css": "assets/styles/css/main.scss"
                }
            }
        },

        /* Production JS and CSS minification
         */
        concat: {
            js: {
                src: '.tmp/public/js/**/*.js',
                dest: 'dist/concat/production.js'
            },
            css: {
                src: '.tmp/public/styles/css/main.css',
                dest: 'dist/concat/production.css'
            }
        },
        removelogging: {
            dist: {
                src: "dist/concat/production.js",
                dest: "dist/cleaned/production.js",
                options: {}
            }
        },
        uglify: {
            dist: {
                src: ['dist/concat/production.js'],
                dest: 'dist/min/production-<%= pkg.version %>.js'
            },
            options :{
                mangle: false
            }

        },

        cssmin: {
            dist: {
                src: ['dist/concat/production.css'],
                dest:'dist/min/production-<%= pkg.version %>.css'
            }
        },

        /**
         * Automatically injects <link> and <script> tags
         */
        'sails-linker': {
            prodJs: {
                options: {
                    startTag: '<!--SCRIPTS-->',
                    endTag: '<!--SCRIPTS END-->',
                    fileTmpl: '<script src="%s"></script>',
                    appRoot: '.tmp/public/js'
                },
                files: {
                    '.tmp/public/**/*.html': ['/min/production-<%= pkg.version %>.js'],
                    'views/**/*.html': ['/min/production-<%= pkg.version %>.js'],
                    'views/**/*.ejs': ['/min/production-<%= pkg.version %>.js']
                }
            },

            prodStyles: {
                options: {
                    startTag: '<!--STYLES-->',
                    endTag: '<!--STYLES END-->',
                    fileTmpl: '<link rel="stylesheet" href="%s">',
                    appRoot: '.tmp/public/styles/css'
                },
                files: {
                    '.tmp/public/index.html': ['.tmp/public/min/production-<%= pkg.version %>.css'],
                    'views/**/*.html': ['dist/min/production-<%= pkg.version %>.css'],
                    'views/**/*.ejs': ['dist/min/production-<%= pkg.version %>.css']
                }
            },
            // Bring in JST template object
            devTpl: {
                options: {
                    startTag: '<!--TEMPLATES-->',
                    endTag: '<!--TEMPLATES END-->',
                    fileTmpl: '<script type="text/javascript" src="%s"></script>',
                    appRoot: '.tmp/public'
                },
                files: {
                    '.tmp/public/index.html': ['.tmp/public/jst.js'],
                    'views/**/*.html': ['.tmp/public/jst.js'],
                    'views/**/*.ejs': ['.tmp/public/jst.js']
                }
            }
        }
    });



    // When Sails is lifted:
    grunt.registerTask('default', [
        'compileAssets',
        'linkAssets'
    ]);

    grunt.registerTask('compileAssets', [
        'sass',
    ]);

    grunt.registerTask('linkAssets', [

        // Update link/script/template references in `assets` index.html
        'sails-linker:devJs',
        'sails-linker:devStyles',
        'sails-linker:devTpl'
    ]);


    // Build the assets into a web accessible folder.
    // (handy for phone gap apps, chrome extensions, etc.)
    grunt.registerTask('build', [
        'compileAssets',
        'clean:build',
        'copy:build'
    ]);

    // When sails is lifted in production
    grunt.registerTask('prod', [
        'concat',
        'uglify',
        'cssmin',
        'copy:prod',
        'copy:prodfonts',
        'sails-linker:prodJs',
        'sails-linker:prodStyles',
        'sails-linker:devTpl'
    ]);

};