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

        # Edit the mongod.conf, allowing REST access
        $ vim /usr/local/etc/mongod.conf 

        # Enable REST
        rest = true

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
	