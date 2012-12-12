// Filename: app.js

define([
  'jquery',
  'library',
  'book',
  'analytic',
  'underscore',
  'backbone'
], function($, Library, Book, Analytic){
  var initialize = function(){

    /* Define our router */
    /* Note that we only need to worry about #routes */
    var Router = Backbone.Router.extend({
        routes: {
            ''                      : 'library',
            'book/:book'            : 'book',
            'book/:book/analytics'  : 'analytics'
        },
        library: function(){
            var libraryView = new Library.LibraryBooksView();
        },
        book: function(book){
            var bookView = new Book.BookView(book);
        },
        analytics: function(book){
            var analyticsView = new Analytic.AnalyticsView(book);
        }
    });

    /* Kick-off the app. */
    var router = new Router();
    Backbone.history.start();

  };

  return {
    initialize: initialize
  };
});
