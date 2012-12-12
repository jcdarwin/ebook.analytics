// main.js

require.config({
  paths: {
    underscore: 'lib/underscore-1.4.2.min',
    backbone: 'lib/backbone-0.9.2.min'
  }
});

require([
  'app'
], function(App){
  App.initialize();
});