// Filename: book.js

define([
  'jquery',
  'underscore',
  'backbone'
], function($){

    // We'll be using Backbone.
    // A good tutorial for this is to be found at:
    // http://net.tutsplus.com/sessions/build-a-contacts-manager-using-backbone-js/

    /* Define our model */
    var Book = Backbone.Model.extend();

    /* Define our collection */
    var Books = Backbone.Collection.extend({
        model: Book,
        url: function(id){
            return 'http://localhost:8001/book/' + id;
        },
        options: {},
        initialize: function(models, options){
            this.options = options;
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
                url: that.url(that.options.id),
                processData: true
            }, options);

            return $.ajax(params);
        },
        parse: function(response) {
            return response;
        }
        });

    /* Define our views */
    var BookHeaderView = Backbone.View.extend({
        el: $('#content'),
        initialize: function(id) {
            _.bindAll(this, 'render');
            this.$el.empty();
            this.collection = new Books({}, {id : id});
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
            _.each(this.collection.models, function(book){
                var template = _.template( $('#book_header_template').html(), book.toJSON() );
                that.$el.append(template);
            }, this);
        },
        events: {
        }
    });

    var BookView = Backbone.View.extend({
        el: $('#content'),
        initialize: function(id) {
            _.bindAll(this, 'render');
            this.$el.empty();
            this.collection = new Books({}, {id : id});
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
            _.each(this.collection.models, function(book){
                that.$el.append( _.template( $('#book_header_template').html(), book.toJSON() ) );
                that.$el.append( _.template( $('#book_template').html(), book.toJSON() ) );
            }, this);
        },
        events: {
        }
    });

  return {
    BookHeaderView: BookHeaderView,
    BookView: BookView
  };
});
