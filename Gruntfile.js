module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        ftpush: {
            beta: {
                auth: {
                    host: "wattyrev.com",
                    port: 21,
                    username: grunt.option("ftp-username"),
                    password: grunt.option("ftp-pass")
                },
                src: "./dist",
                dest: "/admin.beta.kitepaint.com",
                simple: false,
                useList: true
            },
            prod: {
                auth: {
                    host: "wattyrev.com",
                    port: 21,
                    username: grunt.option("ftp-username"),
                    password: grunt.option("ftp-pass")
                },
                src: "./dist",
                dest: "/admin.kitepaint.com",
                simple: false,
                useList: true
            }
        }
    });

    grunt.registerTask("deploy-beta", ["ftpush:beta"]);
    grunt.registerTask("deploy-prod", ["ftpush:prod"]);
};
