var app = angular.module("kitePaintAdmin", ["ui.router"]);

app.config(function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/");

    // Store some domain references based on environment
    var currentDomain = window.location.hostname;
    var apiDomains = {
        "admin.beta.kitepaint.com": "https://api.beta.kitepaint.com/php/admin/",
        "beta.kitepaint.com": "https://api.beta.kitepaint.com/php/admin/",
        "admin.kitepaint.com": "https://api.kitepaint.com/php/admin/",
        "kitepaint.com": "https://api.kitepaint.com/php/admin/",
        default: ""
    };
    app.apiDomain = apiDomains[currentDomain] || apiDomains.default;

    // Override AJAX to redirect on 401
    var originalAjax = $.ajax;
    $.ajax = function(config) {
        var loginUrls = {
            "admin.beta.kitepaint.com": "https://beta.kitepaint.com/login.php",
            "beta.kitepaint.com": "https://beta.kitepaint.com/login.php",
            "admin.kitepaint.com": "https://kitepaint.com/login.php",
            "kitepaint.com": "https://kitepaint.com/login.php",
            default: ""
        };
        var loginUrl = loginUrls[currentDomain] || loginUrls.default;
        var originalHandler = config.error;
        config.error = function(data) {
            if (data.status === 401) {
                window.location.replace(loginUrl);
            }
            return originalHandler ? originalHandler(data) : null;
        };
        return originalAjax(config);
    };

    // Hit the Ping API to confirm authentication
    $.ajax({
        type: "GET",
        dataType: "json",
        url: app.apiDomain + "ping.php"
    });

    $stateProvider
        .state("designs", {
            url: "/designs",
            templateUrl: "html/pages/designs.html",
            controller: "DesignsController",
            data: {
                title: "Designs"
            }
        })
        .state("home", {
            url: "/",
            templateUrl: "html/pages/home.html",
            controller: "HomeController",
            data: {
                title: "Home"
            }
        })
        .state("products", {
            url: "/products",
            templateUrl: "html/pages/products.html",
            controller: "ProductsController",
            data: {
                title: "Products"
            }
        })
        .state("manufacturers", {
            url: "/manufacturers",
            templateUrl: "html/pages/manufacturers.html",
            controller: "ManufacturersController",
            data: {
                title: "Manufacturers"
            }
        })
        .state("retailers", {
            url: "/retailers",
            templateUrl: "html/pages/retailers.html",
            controller: "RetailersController",
            data: {
                title: "Retailers"
            }
        })
        .state("users", {
            url: "/users",
            templateUrl: "html/pages/users.html",
            controller: "UsersController",
            data: {
                title: "Users"
            }
        });
});
