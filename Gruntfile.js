module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            all: {
                options: {
                    process: function (content) {
                        return grunt.template.process(content);
                    }
                },
                files: {
                    'dist/ng-wizmass-notifications.js': ['src/notifications.js', 'src/requests.js', 'src/connection.js', 'src/aggregator.js' ]
                }
            }
        },
        uglify: {
            options: {
                preserveComments: 'some',
                banner: '/*! <%= pkg.version %> */\n'
            },
            build: {
                files: [{
                    'dist/ng-wizmass-notifier.min.js': 'dist/ng-wizmass-notifications.js'
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                'src/{,*/}*.js'
            ]
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        'dist',
                        '!dist/.git*'
                    ]
                }]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['jshint:all', 'clean:dist', 'concat:all', 'uglify']);

};