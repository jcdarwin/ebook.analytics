# ebook.analytics #

## Installing MongoDB ##
1. Install mongodb

    [http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/]()
		
        # Reset the Homebrew git repo, as otherwise we run into a problem with uncommited files. 
        $ cd /usr/local
        $ git fetch origin
        $ git reset --hard origin/master

        # Install mongodb
        $ brew update
        $ brew install mongodb	

        # Set mongodb to run at startup	
        $ ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents

        # Launch mongo
        $ launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist

        # Ensure that mongo is actually going
        $ mongo

        # We should see the following:
        Welcome to the MongoDB shell.
        For interactive help, type "help".
        For more comprehensive documentation, see
                http://docs.mongodb.org/
        Questions? Try the support group
                http://groups.google.com/group/mongodb-user

        # Exit (or CTRL+d)
        exit;

        # Edit the mongod.conf, allowing REST and JSONP access
        $ vim /usr/local/etc/mongod.conf 

        # Enable REST
        rest = true

        # Enable JSONP
        jsonp = true

        # Viewing the launchctrl file, to get the Label (i.e. homebrew.mxcl.mongodb)
        $ less ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist

        # Stopping and starting 
        launchctl stop homebrew.mxcl.mongodb
        launchctl start homebrew.mxcl.mongodb

        # Viewing in the browser: http://localhost:28017
        # Listing databases: http://localhost:28017/listDatabases?text=1

2. Install RockMongo

    [http://m-schmidt.eu/2011/11/06/develop-mongodb-web-apps-with-mamp-under-mac-os-x/]()
		
        # install the mongo php extension
        # Create an include-folder in your MAMP php installation
        $ mkdir /Applications/MAMP/bin/php/php5.3.6/include
        
        # Get php source from: http://www.php.net/get/php-5.3.6.tar.bz2/from/a/mirror
        # and extract. Change name of extracted folder from php-5.3.6 to php
        
				# Change into the directory wherhe the php source is and configure
        $ cd /Applications/MAMP/bin/php/php5.3.6/include/php
        $ ./configure
        
        # MAMP comes with a weird pear config file that causes issues, let’s remove it:
        $ rm /Applications/MAMP/bin/php/php5.3.6/conf/pear.conf
        
        # Now install the mongo driver with pecl:
        $ cd /Applications/MAMP/bin/php/php5.3.6/bin
        $ ./pecl install mongo
        
        # Activate the extension in your php.ini:
        $ vim /Applications/MAMP/bin/php/php5.3.6/conf/php.ini
        extension=mongo.so

  Note that RockMongo uses the following by default:
    user: admin
    password: admin
    
3. Access RockMongo
	
    Start MAMP

    Navigate to [http://localhost/rockmongo]()

## Using MongoDBs REST interface ##

We can use [MongoDB's simple REST interface](http://www.mongodb.org/display/DOCS/Http+Interface#HttpInterface-SimpleRESTInterface) to do queries such as:

        http://localhost:28017/local/books/
        http://localhost:28017/local/analytics/?filter_book=1

## Connecting to Mongo using JSONP ##

### index.html ###

        <!DOCTYPE html>
        <html>
            <head>
                <title>Analytics: Books</title>
                <!-- This is a special version of jQuery with RequireJS built-in -->
                <script data-main="js/main" src="js/lib/require-jquery.js"></script>
        
                <style type="text/css">
                    .book {
                        float: left;
                        width: 150px;
                        height: 200px;
                        border: 1px solid #000;
                        margin-right: 20px;
                        padding: 10px;
                    }
                </style>
            </head>
            <body>
        
                <div id="content"></div>
        
                <script type="text/template" id="library_header_template">
                    <h1>Library</h1>
                </script>
        
                <script type="text/template" id="library_book_template">
                  <div class="library_book_container">
                      <div class="book">
                        <% if (typeof(title) !== 'undefined') { %>
                            <p class="caption"><a href="#book/<%= book %>"><%= title %></a></p>
                        <% } %>
                      </div>
                    </div>
                </script>
        
                <script type="text/template" id="book_header_template">
                    <% if (typeof(title) !== 'undefined') { %>
                        <h2><%= title %></h2>
                    <% } %>
                </script>
        
                <script type="text/template" id="book_template">
                  <div class="book_container">
                      <div class="book">
                        <% if (typeof(title) != 'undefined') { %>
                            <p class="caption"><a href="#book/<%= book %>/analytics"><%= title %></a></p>
                        <% } %>
                      </div>
                    </div>
                </script>
        
                <script type="text/template" id="analytic_header_template">
                    <h1>Analytics</h1>
                </script>
        
                <script type="text/template" id="analytic_subheader_template">
                    <h3>Milestones</h3>
                </script>
        
                <script type="text/template" id="analytic_template">
                  <div class="analytic_container">
                      <div class="analytic_thumbnail">
                        <% if (typeof(milestone) !== 'undefined') { %>
                            <p class="caption"><%= milestone %></p>
                        <% } %>
                      </div>
                    </div>
                </script>
        
            </body>
        </html>

### main.js ###

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

### app.js ###

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

### library.js ###

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
                url: 'http://localhost:28017/local/books/',
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
                    return response.rows;
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

Note the JSONP call, allowing us to call directly to MongoDBN without have to use a sever-side proxy:

            var LibraryBooks = Backbone.Collection.extend({
                model: LibraryBook,
                url: 'http://localhost:28017/local/books/',
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
                    return response.rows;
                }
                });
