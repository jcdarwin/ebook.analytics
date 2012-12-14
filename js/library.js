// Filename: library.js

define([
  'jquery',
  'underscore',
  'backbone'
], function($){

    // We'll be using Backbone.
    // A good tutorial for this is to be found at:
    // http://net.tutsplus.com/sessions/build-a-contacts-manager-using-backbone-js/

    /* Define our model */
    var LibraryBook = Backbone.Model.extend();

    /* Define our collection */
    var LibraryBooks = Backbone.Collection.extend({
        model: LibraryBook,
        url: 'http://localhost:8001/books/',
        initialize: function(models, options){
        },
        sync: function(method, model, options) {
            // We're using the --jsonp option wth mongodb, so
            // a simple $.getJSON() request won't work as we run
            // into problems with the mime-type returned by mongodb.
            var that = this;
            var params = _.extend({
                type: 'GET',
                dataType: 'jsonp',
                jsonp: 'jsonp',
                url: that.url,
                processData: true
            }, options);

            return $.ajax(params);
        },
        parse: function(response) {
            return response;
        }
    });

    /* Define our view */
    var LibraryBooksView = Backbone.View.extend({
        el: $('#content'),
        initialize: function() {
            _.bindAll(this, 'render');
            this.$el.empty();
            this.collection = new LibraryBooks();
            // Fetch the collection and call render() method
            var that = this;
            this.collection.fetch({
            success: function (s) {
                that.render();
            }
            });
        },
        render: function(){
            var that = this;
            that.$el.prepend( _.template( $('#library_header_template').html() ) );
            _.each(this.collection.models, function(library_book){
                var template = _.template( $('#library_book_template').html(), library_book.toJSON() );
                that.$el.append(template);
            }, this);
        },
        events: {
        }
    });

  return {
    LibraryBooksView: LibraryBooksView
  };
});
