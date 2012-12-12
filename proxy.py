#!/usr/bin/python

import urllib2

print "Content-type:application/json\r\n\r\n"

response = urllib2.urlopen('http://localhost:28017/local/analytics/')
html = response.read()
print html
