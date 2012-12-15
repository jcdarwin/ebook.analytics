// main.js

require.config({
    paths: {
        underscore: 'lib/underscore-1.4.2.min',
        backbone: 'lib/backbone-0.9.2.min',
        raphael: 'lib/raphael-min.amd',
        eve: 'lib/eve'
    },
    shim: {
        'eve': {
            deps: ['jquery'],
            exports: 'eve'
        },
        'raphael': {
            deps: ['eve'],
            exports: 'Raphael'
        },
        'backbone' : {
            deps : ['underscore','jquery'],
            exports : 'Backbone'
         }
   }
});

require([
  'app'
], function(App){
  App.initialize();
});