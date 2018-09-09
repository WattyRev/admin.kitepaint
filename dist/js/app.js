var app = angular.module("kitePaintAdmin", ["ui.router"]);

app.config(function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/");

    // Store some domain references based on environment
    var currentDomain = window.location.hostname;
    var staticDomains = {
        "beta.kitepaint.com": "https://static.beta.kitepaint.com/",
        "kitepaint.com": "https://static.kitepaint.com/",
        default: ""
    };
    var apiDomains = {
        "beta.kitepaint.com": "https://api.beta.kitepaint.com/php/",
        "kitepaint.com": "https://api.kitepaint.com/php/",
        default: ""
    };
    app.staticDomain = staticDomains[currentDomain] || staticDomains.default;
    app.apiDomain = apiDomains[currentDomain] || apiDomains.default;

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
