/*global module:false*/
module.exports = function (grunt) {
    'use strict';

    var unique = Math.round(new Date().getTime() / 1000),
        minJsFile = '<%= pkg.name %>-' + unique + '.min.js',
        combinedJsFile = 'tmp/all.js';

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            ' <%= pkg.author %> */\n',

        // Task configuration.
        clean: {
            clean: ['html/dist/', 'tmp/']
        },

        concat: {
            dist: {
                src: [
                    'html/js/*.js',
                ],
                dest: combinedJsFile
            }
        },

        replace: {
            main: {
                src: ['html/qwirkle.php'],
                dest: 'html/dist/scrammed.php',
                replacements: [{
                    from: /^.*includeClasses.html.*$/gm,
                    to: '  <script type="text/javascript" src="js/' + minJsFile + '"></script>'
                }, {
                    from: /.*resetdw.css.*/g,
                    to: ''
                }, {
                    from: /main.css/g,
                    to: 'scrammed-' + unique + '.min.css'
                }, {
                    from: /<script.*jquery-1.8.3.min.js.*/g,
                    to: '<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>'
                }, {
                    from: /.*console.*/g,
                    to: 'xxxxxxxx'
                }, {
                    from: 'Foo',
                    to: function (matchedWord) { // callback replacement
                        return matchedWord + ' Bar';
                    }
                }]
            },
            debugsOff: {
                src: [combinedJsFile],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    from: /.*console.*/g,
                    to: ""
                }, {
                    from: /throw .* Error.*ASSERTION FAIL.*/g,
                    to: ""
                }]
            }
        },

        uglify: {
            min: {
                options: {
                    report: 'min',
                    banner: '<%= banner %>'
                },
                src: combinedJsFile,
                dest: 'html/dist/js/' + minJsFile
            }
        },

        cssmin: {
            options: {
                report: 'min'
            },
            minify: {
                src: ['/home/sean/projects/css/resetdw.css', 'html/css/main.css'],
                dest: 'html/dist/css/scrammed-' + unique + '.min.css'
            }
        },

        copy: {
            images: {
                files: [
                    {
                        expand: true,
                        cwd: 'html/imgs/',
                        src: ['heading.png', 'mountains.jpg', 'background.jpg',
                            'sprite-sheet.png', 'bgBrown.png', 'bgGreen.png'],
                        dest: 'html/dist/imgs/'
                    }
                ]
            },
            frags: {
                files: [
                    {
                        expand: true,
                        cwd: 'html/frags/',
                        src: ['*.html'],
                        dest: 'html/dist/frags/'
                    }
                ]
            }
        },

        jshint: {
            options: {
                jshintrc: '/home/sean/.jshintrc',
                ignores: ['html/js/seedrandom.js', 'html/js/json2.js',
                    'html/js/jquery.horizontalNav.js', 'html/js/jquery.cookie.js']
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            source: {
                src: ['html/js/*.js']
            },
            tests: {
                src: ['html/tests/**/*.js', 'html/tests/sharedHelpers.js']
            },
            dist: {
                src: 'html/dist/js/' + minJsFile
            }
        },

        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            tests: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'qunit']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task.
    grunt.registerTask('default', ['clean', 'concat', 'replace', 'uglify', 'cssmin', 'copy']);
};
