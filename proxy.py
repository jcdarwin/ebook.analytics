#!/usr/bin/python

# http://bottlepy.org/docs/dev/index.html
# http://myadventuresincoding.wordpress.com/2011/01/02/creating-a-rest-api-in-python-using-bottle-and-mongodb/
import bottle
import pymongo

from pymongo import Connection
from bottle import route, run, request, response, abort
from bottle import install, uninstall

# http://api.mongodb.org/python/2.4.1/api/bson/json_util.html?highlight=json#bson.json_util
from bson import json_util, Code
from bson.json_util import dumps

#import urllib2
#print "Content-type:application/json\r\n\r\n"
#response = urllib2.urlopen('http://localhost:28017/local/analytics/')
#html = response.read()
#print html


class JSONAPIPlugin(object):
    name = 'jsonapi'
    api = 1

    def __init__(self, dumps=dumps):
        uninstall('json')
        self.dumps = dumps

    def apply(self, callback, context):
        dumps = self.dumps
        if not dumps:
            return callback

        def wrapper(*a, **ka):
            r = callback(*a, **ka)

            json_docs = []

            if isinstance(r, list):
                for doc in r:
                    json_doc = dumps(doc, default=json_util.default)
                    json_docs.append(json_doc)
            else:
                json_docs = r

            # Attempt to serialize, raises exception on failure
            json_response = dumps(json_docs)

            # Set content type only if serialization successful
            response.content_type = 'application/json'

            # Wrap in callback function for JSONP
            callback_function = request.GET.get('jsonp')
            if callback_function:
                json_response = ''.join([callback_function, '(', json_response, ')'])

            print json_response
            return json_response
        return wrapper


@route('/books/', method='GET')
def get_books():
    entity = db['books'].find({})
    if not entity:
        abort(404, 'No books found')
    return entity


@route('/book/<book>', method='GET')
def get_book(book):
    entity = db['books'].find_one({'book': int(book)})
    if not entity:
        abort(404, 'No book with book id %s' % book)
    return entity


@route('/book/<book>/analytics/', method='GET')
def get_book_analytics(book):
    entity = db['analytics'].find({'book': int(book)})
    if not entity:
        abort(404, 'No analytics for book id %s' % book)
    return entity


@route('/book/<book>/analytics/milestones/', method='GET')
def get_book_analytics_summary(book):
    # We want to return the count of each milestone for this book
    # and express this as a % of the total users.
    # Therefore, we need to:
    # 1. determine the number of distinct users
    # 2. determine the count per milestone

    # http://api.mongodb.org/python/2.0/examples/map_reduce.html
    # http://stackoverflow.com/questions/5681851/mongodb-combine-data-from-multiple-collections-in-to-one-how
    #map = Code('function() { emit(this._id, this.description); }')
    #reduce = Code('function(key, values) { }')

    # Determine the number of distinct users
    # http://stackoverflow.com/questions/11782566/mongodb-select-countdistinct-x-on-an-indexed-column-count-unique-results-for
    pipeline = [{'$group': {'_id': "$user"}}, {'$group': {'_id': 1, 'count': {'$sum': 1}}}]
    total_users = db.command('aggregate', 'analytics', pipeline=pipeline)
    users = total_users['result'][0]['count']

    # Determine the count per milestone
    entity = db['analytics'].group(['milestone', 'description'], {'book': int(book)}, {'count': 0, 'users': users, 'complete': 0}, 'function(obj, prev){prev.count++;prev.complete=prev.count/prev.users;}')
    if not entity:
        abort(404, 'No analytics for book id %s' % book)

    return entity


@route('/')
def hello():
    r = [{'hello': 'world'}]
    r.append({1: 2})
    return r

if __name__ == '__main__':
    install(JSONAPIPlugin())
    connection = Connection('localhost', 27017)
    db = connection['local']
    run(host='localhost', port=8001)

#print dumps(db['books'].find({}))
#print dumps(db['books'].find_one({'book': 1}))
