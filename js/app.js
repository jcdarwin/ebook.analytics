// Filename: app.js

define([
  'jquery',
  'library',
  'book',
  'analytic',
  'milestone',
  'underscore',
  'backbone'
], function($, Library, Book, Analytic, Milestone){
  var initialize = function(){

    /* Define our router */
    /* Note that we only need to worry about #routes */
    var Router = Backbone.Router.extend({
        routes: {
            ''                                : 'library',
            'book/:book'                      : 'book',
            'book/:book/analytics'            : 'analytics',
            'book/:book/analytics/milestones' : 'milestones'
        },
        library: function(){
            var libraryView = new Library.LibraryBooksView();
        },
        book: function(book){
            var bookView = new Book.BookView(book);
        },
        analytics: function(book){
            var analyticsView = new Analytic.AnalyticsView(book);
        },
        milestones: function(book){
            var milestonesView = new Milestone.MilestonesView(book);
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
