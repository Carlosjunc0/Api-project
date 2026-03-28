const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'You are not authorized to access this resource' });
    }
    next();
};

module.exports = { isAuthenticated}