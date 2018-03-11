const jwt   = require('jsonwebtoken')

module.exports = {
    check : (req,res,next) => {
        let providedToken = req.headers.token;
        
        if (providedToken) {
            try {
                let tokenCheck = jwt.verify(providedToken, process.env.SECRET)
                next();
            } catch(err) {
                res.status(500).json({
                    message : `Token is wrong, please check again ! ${err}`
                })
            }
        } else {
            res.status(500).json({
                message : `Restricted, please provide a token !`
            })
        }
    }
}