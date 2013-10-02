/*global module:false*/
module.exports = function (grunt) {
    'use strict';
    /* jshint -W003 */

    var unique = Math.round(new Date().getTime() / 1000),
        minJsFile = '<%= pkg.name %>-' + unique + '.min.js',
        mainFile = 'html/game2.php',
        dist = 'dist/',
        combinedJsFile = '.tmp/all.js',
        concatSrcArray = getScriptPaths(mainFile);

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
            clean: [dist, '.tmp/']
        },

        concat: {
            dist: {
                src: concatSrcArray,
                dest: combinedJsFile
            }
        },

        replace: {
            main: {
                src: [mainFile],
                dest: '.tmp/fiveormore.php',
                replacements: [{
                    from: /^.*src=.(js|lib).*$/gm,
                    to: ''
                }, {
                    from: /.*resetdw.css.*/g,
                    to: ''
                }, {
                    from: /css\/screen.css/g,
                    to: 'css/fiveormore-' + unique + '.min.css'
                }, {
                    from: /<script.*jquery-1.8.3.min.js.*/g,
                    to: '<script src="//ajax.googleapis.com/ajax/libs/' +
                        'jquery/1.8.3/jquery.min.js"></script>\n' +
                        '  <script src="js/fiveormore-' + unique +
                        '.min.js"></script>'
                }, {
                    from: /.*div id=.endGame.*/g,
                    to: ''
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

        lineremover: {
            blanks: {
                options: {
                    exclusionPattern: /^$/g
                },
                src: '.tmp/fiveormore.php',
                dest: dist + 'fiveormore.php'
            }
        },

        uglify: {
            min: {
                options: {
                    report: 'min',
                    banner: '<%= banner %>'
                },
                src: combinedJsFile,
                dest: dist + 'js/' + minJsFile
            }
        },

        cssmin: {
            options: {
                report: 'min'
            },
            minify: {
                src: ['html/css/resetdw.css',
                    'html/css/screen.css'],
                dest: dist + 'css/fiveormore-' + unique + '.min.css'
            }
        },

        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: 'html/imgs/',
                    src: ['mountains.jpg', 'loading.gif', 'diamond.png',
                    'circle.png', 'splat.png', 'triangle.png', 'square.png',
                    'star.png'],
                    dest: dist + 'imgs/'
                }]
            },
            server: {
                src: 'html/server.php',
                dest: dist + 'server.php'
            },
            database: {
                src: 'html/db/fiveormore.db',
                dest: dist + 'db/fiveormore.db'
            }
        },

        jshint: {
            options: {
                jshintrc: '/home/sean/.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            source: {
                src: ['html/js/*.js']
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
    grunt.loadNpmTasks('grunt-line-remover');

    // Default task.
    grunt.registerTask('default', ['clean', 'jshint', 'concat', 'replace',
        'lineremover', 'uglify', 'cssmin', 'copy']);
    grunt.registerTask('dev', ['clean', 'jshint', 'concat', 'replace',
        'lineremover', 'uglify', 'cssmin', 'copy']);
    grunt.registerTask('staging', ['clean', 'jshint', 'concat', 'replace',
        'lineremover', 'uglify', 'cssmin', 'copy']);
    grunt.registerTask('production', ['clean', 'jshint', 'concat', 'replace',
        'lineremover', 'uglify', 'cssmin', 'copy']);

    function getScriptPaths(htmlFile) {
        var contents = grunt.file.read(htmlFile),
            lines = contents.split('\n'),
            scripts = [];
        // match my script tags, extract the path
        for (var idx = 0; idx < lines.length; idx += 1) {
            //~ <script type="text/javascript" src="js/const.js"></script>
            var m = lines[idx].match(/src=.((?:lib|js)\/.+\.js)/);
            if (m && m.length > 1) {
                scripts.push('html/' + m[1]);
            }
        }
        return scripts;
    }

};
