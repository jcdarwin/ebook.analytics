// app.js

console.log('Started');

var dbUrl = 'local';
var collections = ['milestones', 'books', 'analytics'];
var db = require('mongojs').connect(dbUrl, collections);

// Delete all records
db.books.remove();
db.analytics.remove();

// https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
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

var milestones = [
    {book: 1, milestone: 1, action: 'scroll', description: 'Completed first section of first page'},
    {book: 1, milestone: 2, action: 'scroll', description: 'Completed second section of first page'},
    {book: 1, milestone: 3, action: 'scroll', description: 'Completed third section of first page'},
    {book: 1, milestone: 4, action: 'scroll', description: 'Completed first page'},
    {book: 1, milestone: 5, action: 'page',   description: 'Completed first chapter'},
    {book: 1, milestone: 6, action: 'page',   description: 'Completed second chapter'},
    {book: 1, milestone: 7, action: 'page',   description: 'Completed third chapter'},
    {book: 1, milestone: 8, action: 'page',   description: 'Completed book'},
    {book: 2, milestone: 1, action: 'scroll', description: 'Completed first section of first page'},
    {book: 2, milestone: 2, action: 'scroll', description: 'Completed second section of first page'},
    {book: 2, milestone: 3, action: 'scroll', description: 'Completed third section of first page'},
    {book: 2, milestone: 4, action: 'scroll', description: 'Completed first page'},
    {book: 2, milestone: 5, action: 'page',   description: 'Completed first chapter'},
    {book: 2, milestone: 6, action: 'page',   description: 'Completed second chapter'},
    {book: 2, milestone: 7, action: 'page',   description: 'Completed third chapter'},
    {book: 2, milestone: 8, action: 'page',   description: 'Completed book'}
];

milestones.forEach( function(item){
    db.milestones.save(item, function(e, saved) {
      if( e || !saved ) console.log('Milestone ' + item.milestone + ' not saved');
      else console.log('Milestone ' + item.milestone + ' saved');
    });
});

var analytics = [
    // Detect depth of scroll in the page
    {user: 1, book: 1, milestone: 1, value: 1, date: new Date()},
    {user: 1, book: 1, milestone: 2, value: 1, date: new Date()},
    {user: 1, book: 1, milestone: 3, value: 1, date: new Date()},

    // Detect depth of scroll in the page
    {user: 1, book: 2, milestone: 1, value: 1, date: new Date()},
    {user: 1, book: 2, milestone: 2, value: 1, date: new Date()},
    {user: 1, book: 2, milestone: 3, value: 1, date: new Date()},

    // Detect page turns
    {user: 1, book: 2, milestone: 4, value: 1, date: new Date()},
    {user: 1, book: 2, milestone: 5, value: 1, date: new Date()},
    {user: 1, book: 2, milestone: 6, value: 1, date: new Date()},

    // Detect depth of scroll in the page
    {user: 2, book: 1, milestone: 1, value: 1, date: new Date()},
    {user: 2, book: 1, milestone: 2, value: 1, date: new Date()},
    {user: 2, book: 1, milestone: 3, value: 1, date: new Date()},

    // Detect page turns
    {user: 2, book: 1, milestone: 4, value: 1, date: new Date()},
    {user: 2, book: 1, milestone: 5, value: 1, date: new Date()},
    {user: 2, book: 1, milestone: 6, value: 1, date: new Date()},

    // Detect depth of scroll in the page
    {user: 2, book: 2, milestone: 1, value: 1, date: new Date()},
    {user: 2, book: 2, milestone: 2, value: 1, date: new Date()},
    {user: 2, book: 2, milestone: 3, value: 1, date: new Date()},

    // Detect page turns
    {user: 2, book: 2, milestone: 4, value: 1, date: new Date()},
    {user: 2, book: 2, milestone: 5, value: 1, date: new Date()},
    {user: 2, book: 2, milestone: 6, value: 1, date: new Date()}

];

analytics.forEach( function(item){
    db.analytics.save(item, function(e, saved) {
      if( e || !saved ) console.log('Record ' + item.value + ' not saved');
      else console.log('Record ' + item.value + ' saved');
    });
});

