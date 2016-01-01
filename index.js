var express = require('express');
var app = express();
var low = require('lowdb');
var storage = require('lowdb/file-sync');
var db = low('db.json', {storage});
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var uuid = require('uuid');

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

app.enable('trust proxy');
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.get('/', function(req, res) {
  res.render('index', {
    links: db('links').value(),
    count: db('links').size()
  });
});

app.get('/tag/:tag', function(req, res) {
  tag = req.params.tag;
  links = db('links').value();
  vtags = [];
  links.forEach(function(link) {
    var t = link.tags;
    if (t.contains(tag)) {
      vtags.push(link);
    }
  });
  res.render('tag', {
    tag: tag,
    links: vtags
  });
});

app.post('/', function(req, res) {
  var title = req.body.title;
  var link = req.body.link;
  var tags = req.body.tags;
  db('links').push(
    { title: title,
      link: link,
      tags: tags.replace(/ /g,'').split(",")
    });
  res.redirect('/');
});

console.log(" *:5000");
app.listen(5000);
