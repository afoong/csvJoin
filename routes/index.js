
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express', content: 'home' })
};

exports.join = function(req, res){
  res.render('index', { title: 'Express', content: 'join' })
};

exports.processCsvs = function(req, res){
  res.render('index', { title: 'Express', content: 'join' })
};