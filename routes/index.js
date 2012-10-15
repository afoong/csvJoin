
/*
 * routes
 */
exports.index = function(req, res){
  res.render('index', { title: 'Home of the join CSV app', content: 'home' })
};
