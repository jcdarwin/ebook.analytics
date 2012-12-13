// Filename: milestone.js

define([
  'jquery',
  'book',
  'underscore',
  'backbone'
], function($, Book){

    // We'll be using Backbone.
    // A good tutorial for this is to be found at:
    // http://net.tutsplus.com/sessions/build-a-contacts-manager-using-backbone-js/

    /* Define our model */
    var Milestone = Backbone.Model.extend();

    /* Define our collection */
    var Milestones = Backbone.Collection.extend({
        model: Milestone,
        initialize: function(models, options){
            this.book = options.book;
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
                url: that.url(),
                processData: true
            }, options);

            return $.ajax(params);
        },
        parse: function(response) {
            return _.map(response, function(a){
                return $.parseJSON(a);
            });
        },
        url: function(){
            //return 'http://localhost:28017/local/analytics/?filter_book=' + this.book;
            return 'http://localhost:8001/book/' + this.book + '/analytics/milestones/';
        }
        });

    /* Define our view */
    var MilestonesView = Backbone.View.extend({
        el: $('#content'),
        initialize: function(book) {
            var bookHeaderView = new Book.BookHeaderView(book);
            _.bindAll(this, 'render');
            this.$el.empty();
            this.collection = new Milestones( {}, {book: book} );
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
            that.$el.prepend( _.template( $('#analytic_header_template').html() ) );
            that.$el.append( _.template( $('#analytic_subheader_template').html() ) );
            _.each(this.collection.models, function(analytic){
                var template = _.template( $('#milestone_template').html(), analytic.toJSON() );
                that.$el.append(template);
            }, this);
        },
        events: {
        }
    });

  return {
    MilestonesView: MilestonesView
  };
});
