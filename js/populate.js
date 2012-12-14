// app.js

console.log('Started');

var dbUrl = 'local';
var collections = ['milestones', 'books', 'analytics'];
var db = require('mongojs').connect(dbUrl, collections);

// Delete all records
db.books.remove();
db.analytics.remove();
db.milestones.remove();

add_books();

// https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
function add_books() {
    var books = [
        {book: 1, title: 'Through the Looking Glass', author: 'Lewis Carol'},
        {book: 2, title: 'Day of the Triffids', author: 'John Wyndham'}
    ];

    books.forEach( function(item){
        db.books.save(item, function(e, saved) {
          if( e || !saved ) console.log('Book ' + item.book + ' not saved');
          else console.log('Book ' + item.book + ' saved');
        });
    });

    find_books();
}

function find_books(){
    var db_books;
    db.books.find({}, function(err, books){
        if( err || !books) {
            console.log("No books found");
        } else {
            books.forEach( function(book) {
//                console.log(book);
            } );

            db_books = books;
            add_milestones(db_books);
        }
    });
}

function add_milestones(db_books) {
    var milestones = [
        {book: 1, book_id: db_books[0]._id, milestone: 1, action: 'scroll', description: 'Completed first section of first page'},
        {book: 1, book_id: db_books[0]._id, milestone: 2, action: 'scroll', description: 'Completed second section of first page'},
        {book: 1, book_id: db_books[0]._id, milestone: 3, action: 'scroll', description: 'Completed third section of first page'},
        {book: 1, book_id: db_books[0]._id, milestone: 4, action: 'scroll', description: 'Completed first page'},
        {book: 1, book_id: db_books[0]._id, milestone: 5, action: 'page',   description: 'Completed first chapter'},
        {book: 1, book_id: db_books[0]._id, milestone: 6, action: 'page',   description: 'Completed second chapter'},
        {book: 1, book_id: db_books[0]._id, milestone: 7, action: 'page',   description: 'Completed third chapter'},
        {book: 1, book_id: db_books[0]._id, milestone: 8, action: 'page',   description: 'Completed book'},
        {book: 2, book_id: db_books[1]._id, milestone: 1, action: 'scroll', description: 'Completed first section of first page'},
        {book: 2, book_id: db_books[1]._id, milestone: 2, action: 'scroll', description: 'Completed second section of first page'},
        {book: 2, book_id: db_books[1]._id, milestone: 3, action: 'scroll', description: 'Completed third section of first page'},
        {book: 2, book_id: db_books[1]._id, milestone: 4, action: 'scroll', description: 'Completed first page'},
        {book: 2, book_id: db_books[1]._id, milestone: 5, action: 'page',   description: 'Completed first chapter'},
        {book: 2, book_id: db_books[1]._id, milestone: 6, action: 'page',   description: 'Completed second chapter'},
        {book: 2, book_id: db_books[1]._id, milestone: 7, action: 'page',   description: 'Completed third chapter'},
        {book: 2, book_id: db_books[1]._id, milestone: 8, action: 'page',   description: 'Completed book'}
    ];

    milestones.forEach( function(item){
        db.milestones.save(item, function(e, saved) {
          if( e || !saved ) console.log('Milestone ' + item.milestone + ' not saved');
          else console.log('Milestone ' + item.milestone + ' saved');
        });
    });

    find_milestones();
}

function find_milestones() {
    var db_milestones;
    db.milestones.find({}, function(err, milestones){
        if( err || !milestones) {
            console.log("No milestones found");
        } else {
            milestones.forEach( function(milestone) {
//                console.log(milestone);
            } );

            db_milestones = milestones;
            add_analytics(db_milestones);
        }
    });
}

function add_analytics(db_milestones) {
    var analytics = [
        // Detect depth of scroll in the page
        {user: 1, book: 1, milestone: 1, milestone_id: db_milestones[0]._id, description: db_milestones[0].description, value: 1, date: new Date()},
        {user: 1, book: 1, milestone: 2, milestone_id: db_milestones[1]._id, description: db_milestones[1].description, value: 1, date: new Date()},
        {user: 1, book: 1, milestone: 3, milestone_id: db_milestones[2]._id, description: db_milestones[2].description, value: 1, date: new Date()},

        // Detect depth of scroll in the page
        {user: 1, book: 2, milestone: 1, milestone_id: db_milestones[0]._id, description: db_milestones[0].description, value: 1, date: new Date()},
        {user: 1, book: 2, milestone: 2, milestone_id: db_milestones[1]._id, description: db_milestones[1].description, value: 1, date: new Date()},
        {user: 1, book: 2, milestone: 3, milestone_id: db_milestones[2]._id, description: db_milestones[2].description, value: 1, date: new Date()},

        // Detect page turns
        {user: 1, book: 2, milestone: 4, milestone_id: db_milestones[3]._id, description: db_milestones[3].description, value: 1, date: new Date()},
        {user: 1, book: 2, milestone: 5, milestone_id: db_milestones[4]._id, description: db_milestones[4].description, value: 1, date: new Date()},
        {user: 1, book: 2, milestone: 6, milestone_id: db_milestones[5]._id, description: db_milestones[5].description, value: 1, date: new Date()},

        // Detect depth of scroll in the page
        {user: 2, book: 1, milestone: 1, milestone_id: db_milestones[8]._id, description: db_milestones[8].description, value: 1, date: new Date()},
        {user: 2, book: 1, milestone: 2, milestone_id: db_milestones[9]._id, description: db_milestones[9].description, value: 1, date: new Date()},
        {user: 2, book: 1, milestone: 3, milestone_id: db_milestones[10]._id, description: db_milestones[10].description, value: 1, date: new Date()},

        // Detect page turns
        {user: 2, book: 1, milestone: 4, milestone_id: db_milestones[11]._id, description: db_milestones[11].description, value: 1, date: new Date()},
        {user: 2, book: 1, milestone: 5, milestone_id: db_milestones[12]._id, description: db_milestones[12].description, value: 1, date: new Date()},
        {user: 2, book: 1, milestone: 6, milestone_id: db_milestones[13]._id, description: db_milestones[13].description, value: 1, date: new Date()},
        {user: 2, book: 1, milestone: 7, milestone_id: db_milestones[14]._id, description: db_milestones[14].description, value: 1, date: new Date()},
        {user: 2, book: 1, milestone: 8, milestone_id: db_milestones[15]._id, description: db_milestones[15].description, value: 1, date: new Date()},

        // Detect depth of scroll in the page
        {user: 2, book: 2, milestone: 1, milestone_id: db_milestones[8]._id, description: db_milestones[8].description, value: 1, date: new Date()},
        {user: 2, book: 2, milestone: 2, milestone_id: db_milestones[9]._id, description: db_milestones[9].description, value: 1, date: new Date()},
        {user: 2, book: 2, milestone: 3, milestone_id: db_milestones[10]._id, description: db_milestones[10].description, value: 1, date: new Date()},

        // Detect page turns
        {user: 2, book: 2, milestone: 4, milestone_id: db_milestones[11]._id, description: db_milestones[11].description, value: 1, date: new Date()},
        {user: 2, book: 2, milestone: 5, milestone_id: db_milestones[12]._id, description: db_milestones[12].description, value: 1, date: new Date()},
        {user: 2, book: 2, milestone: 6, milestone_id: db_milestones[13]._id, description: db_milestones[13].description, value: 1, date: new Date()}

    ];

    analytics.forEach( function(item){
        db.analytics.save(item, function(e, saved) {
          if( e || !saved ) console.log('Analytic ' + item.value + ' not saved');
          else console.log('Analytic ' + item.value + ' saved');
        });
    });
}