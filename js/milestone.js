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

    /* Define our header view */
    // Note that although $el='#header', the donuts will
    // actually get added to canvas: "pvcPie1" */
    var MilestonesHeaderView = Backbone.View.extend({
        el: $('#header'),
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
            data = {};

            // http://lostechies.com/derickbailey/2012/04/26/view-helpers-for-underscore-templates/
            var viewHelpers = {
                make_pie: function(){
                    var pie = new pvc.PieChart({
                      canvas: "pvcPie1",
                      width: 400,
                      height: 400,
                      title: "Completed reading",
                      titlePosition: "bottom",
                      legend: false,
                      showTooltips: false,
                      innerGap: 0.8,
                      showValues: true,
                    
                      extensionPoints: {
                        pie_innerRadius:70,
                        titleLabel_font: "18px sans-serif"
                      }
                    });

                    var data = {
                      "resultset":[
                          ["Green",74],
                          ["Bender",41]
                      ],
                      "metadata":[{
                        "colIndex":0,
                        "colType":"String",
                        "colName":"Categories"
                      },{
                        "colIndex":1,
                        "colType":"Numeric",
                        "colName":"Value"
                      }]
                    };

                    pie.setData($.extend(true, {},data),
                        {crosstabMode: false,
                         seriesInRows: false});
                    pie.render();
                }
            };

            _.extend(data, viewHelpers);
            that.$el.append( _.template( $('#analytic_overview_template').html(), data ) );
        },
        events: {
        }
    });

    /* Define our content view */
    var MilestonesView = Backbone.View.extend({
        el: $('#content'),
        initialize: function(book) {
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
            that.$el.append( _.template( $('#analytic_subheader_milestones_template').html() ) );
            _.each(this.collection.models, function(milestone){
                var template = _.template( $('#milestone_template').html(), milestone.toJSON() );
                that.$el.append(template);
            }, this);
        },
        events: {
        }
    });

  return {
    MilestonesHeaderView: MilestonesHeaderView,
    MilestonesView: MilestonesView
  };
});
