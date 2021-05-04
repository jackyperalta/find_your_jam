// E.C: 04-19-2021 - Included a authentication check function that will determine 
// if user is logged in and if so won't be able to revist login/register pages
// E.C: 05-1-2021 - Included a authentication check that will determine if user
// is logged in, it will have a message on the bookmark page that they are or
// a message letting them know to log in or to register
module.exports = {
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/bookmarks');      
    },
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.render('bookmark');
    }
};