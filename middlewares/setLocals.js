module.exports = () => {
  return (req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.error = undefined;
    res.locals.errors = {};
    next();
  };
};
