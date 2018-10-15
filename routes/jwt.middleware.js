const router = require('express').Router();
const jwt = require('jsonwebtoken');

// Verification du token à chaque requete
router.use((req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(403).json({
            success: false,
            message: 'No token provided'
        });
    } else {
        const parts = header.split(' ');
        if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
            return res.status(403).json({
                success: false,
                message: 'Wrong format, should be "Bearer {token}".'
            });
        } else {
            const token = parts[1];
            jwt.verify(token, req.app.get('jwtSecret'), (err, decoded) => {
                if (err) {
                    return  res.status(403).json({
                        success: false,
                        message: 'Failed to authenticate token',
                        error: err
                    });
                } else {
                    if (decoded.exp <= Date.now().valueOf() / 1000) {
                        return res.status(403).json({
                            success: false,
                            message: 'Token expired, please log again'
                        });
                    } else {
                        req.payload = decoded;
                        next();
                    }
                }
            });
        }
    }
});

module.exports = router;
