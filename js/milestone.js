// Filename: milestone.js

define([
  'jquery',
  'book',
  'raphael',
  'underscore',
  'backbone'
], function($, Book){

    // We'll be using Backbone.
    // A good tutorial for this is to be found at:
    // http://net.tutsplus.com/sessions/build-a-contacts-manager-using-backbone-js/

    /* Define our model */
    var Milestone = Backbone.Model.extend();

    /* Define our collection */
    var MilestoneDonuts = Backbone.Collection.extend({
        model: Milestone,
        initialize: function(models, options){
            this.book = options.book;
            this.milestone = options.milestone;
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
            return 'http://localhost:8001/books/' + this.book + '/analytics/milestone/' + this.milestone;
        }
    });

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
            return 'http://localhost:8001/books/' + this.book + '/analytics/milestones/';
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
        },
        events: {
        }
    });

    /* Define our donut view */
    var MilestonesDonutsView = Backbone.View.extend({
        el: $('#donuts'),
        initialize: function(book, milestone) {
            _.bindAll(this, 'render');
            this.$el.empty();
            this.collection = new MilestoneDonuts( {}, {book: book, milestone: milestone} );
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

            // Render the donut charts
            // http://blog.andyleclair.com/post/18022594090/raphael-js-donut-chart
            // http://lostechies.com/derickbailey/2012/04/26/view-helpers-for-underscore-templates/
            var viewHelpers = {
                make_donut: function(size, num, total, target, description, outerColor, innerColor, font){
                  that.$el.append('<div id="' + target + '" style="float:left;"></div>');
                  var outerFill = { stroke: outerColor, fill: outerColor };
                  var innerFill = { stroke: innerColor, fill: innerColor };
                  var greenFill = { stroke: '#FFAABB', fill: '#FFAABB' };
                  var r = Raphael(target, size, size),
                      halfSize = (size / 2),
                      outerSize = halfSize - (halfSize / 4),
                      arcSize = halfSize * 0.585,
                      bigTxtSize = halfSize * 0.275,
                      smallTxtSize = halfSize * 0.125,
                      percentage = Math.round((num / total) * 100),
                      numVsTotal = num + "/" + total,
                      param = {
                          stroke: "#fff",
                          "stroke-width": halfSize * 0.30
                      };
                  r.customAttributes.arc = function(value, total, R) {
                      var alpha = 360 / total * value,
                          a = (90 - alpha) * Math.PI / 180,
                          x = halfSize + R * Math.cos(a),
                          y = halfSize - R * Math.sin(a),
                          path;
                      if (total == value) {
                          path = [["M", halfSize, halfSize - R], ["A", R, R, 0, 1, 1, halfSize - 0.01, halfSize - R]];
                      } else {
                          path = [["M", halfSize, halfSize - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
                      }
                      return {
                          path: path,
                          stroke: outerColor
                      };
                  };

                  var outer = r.circle(halfSize, halfSize, outerSize).attr(outerFill);
                  var second = r.circle(halfSize, halfSize, outerSize * 0.926).attr(innerFill);
                  var percent = r.path().attr(param).attr({
                      arc: [0, total, arcSize]
                  }).animate({
                      arc: [num, total, arcSize]
                  }, 1500);

                  var third = r.circle(halfSize, halfSize, outerSize * 0.634).attr(outerFill);
                  var inner = r.circle(halfSize, halfSize, outerSize * 0.567).attr(innerFill);

                  var mainText = r.text(halfSize, halfSize * 0.9, percentage + "%").attr({
                      "font-size": bigTxtSize,
                      "font-family": font,
                      "font-weight": "bold"
                  });
                  
                  var subText = r.text(halfSize * 1.1, halfSize * 1.1, numVsTotal).attr({
                      "font-size": smallTxtSize,
                      "font-family": font,
                      "stroke": outerColor,
                      "fill": outerColor,
                      "text-anchor": 'end'
                  });

                  /*
                  var descriptionText = r.text(halfSize, size * 0.95, description).attr({
                      "font-size": smallTxtSize,
                      "font-family": font,
                      "stroke": outerColor,
                      "fill": outerColor
                  });
                  */
                  $('#' + target).append('<p style="text-align:center;color:' + outerColor + ';font-size:2em;margin-top:-1.5em;">' + description + '</p>');
                }
            };

            _.each(this.collection.models, function(milestone){
                data = milestone.toJSON();
                _.extend(data, viewHelpers);
                that.$el.append( _.template( $('#analytic_overview_template').html(), data ) );
            }, this);

        },
        events: {
        }
    });

    /* Define our milestones view */
    var MilestonesView = Backbone.View.extend({
        el: $('#milestones'),
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

            // Render the milestone percentages
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
    MilestonesDonutsView: MilestonesDonutsView,
    MilestonesView: MilestonesView
  };
});
