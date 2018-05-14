const express = require('express');
const app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const uuidv1 = require('uuid/v1');
const moment = require('moment');
const url = require('url');

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

// DB
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ links: []}).write()
// express settings
app.enable('trust proxy');
app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.get('/', function(req, res) {
  res.render('index', {
    links: db.get('links').value(),
    count: db.get('links').size()
  });
});

app.get('/tag/:tag', function(req, res) {
  tag = req.params.tag;
  links = db.get('links').value();
  vtags = [];
  links.forEach(function(link) {
    var t = link.tags;
    if (t.contains(tag))
      vtags.push(link);
  });
  res.render('tag', {
    tag: tag,
    links: vtags
  });
});

app.post('/', function(req, res) {
  var link = req.body.link;
  db.get('links').push(
    { title: req.body.title,
      link: link,
      tags: req.body.tags.replace(/ /g,'').split(","),
      domain: new url.URL(link).hostname,
      id: uuidv1(),
      time: moment().format("YYYY-MM-DD HH:MM:SS")
    }).write();
  res.redirect('/');
});

console.log(" *:5000");
app.listen(5000);
