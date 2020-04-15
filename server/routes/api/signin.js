const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
module.exports = (app) => {
    /*
     * Sign up
     */
    app.post('/api/account/signup', (req, res, next) => {
        const { body } = req;
        console.log(body);
        const {
            firstName,
            lastName,
            password
        } = body;
        let {
            email
        } = body;
        if (!firstName) {
            return res.send({
                success: false,
                message: 'Error: Missing first name.'
            });
        }
        if (!lastName) {
            return res.send({
                success: false,
                message: 'Error: Missing last name.'
            });
        }
        if (!email) {
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank.'
            });
        }
        if (!password) {
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank.'
            });
        }

        email = email.toLowerCase();
        //email = email.trim();
        // Steps:
        // 1. Verify email doesn't exist
        // 2. Save
        User.find({
            email: email
        }, (err, previousUsers) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            } else if (previousUsers.length > 0) {
                return res.send({
                    success: false,
                    message: 'Error: Account already exist.'
                });
            }
            // Save the new user
            const newUser = new User();
            newUser.firstName = firstName;
            newUser.lastName = lastName
            newUser.email = email;
            newUser.password = newUser.generateHash(password);

            newUser.save((err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server error'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Signed up'
                });
            });
        });
    }); // end of sign up endpoint

    app.post('/api/account/signin', (req, res, next) => {
        const { body } = req;
        const {
            password
        } = body;
        let {
            email
        } = body;
        if (!email) {
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank.'
            });
        }
        if (!password) {
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank.'
            });
        }
        email = email.toLowerCase();
        User.find({
            email: email
        }, (err, users) => {
            if (err) {
                return res.send({
                    success: false,
                    message: "Error: server error"
                });
            }
            if (users.length != 1) {
                return res.send({
                    success: false,
                    message: "Error: Invalid!"
                });
            }
            const user = users[0];
            console.log(user);
            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: "Error: Invalid!"
                });
            }

            //Otherwise correct user
            const userSession = new UserSession();
            userSession.userId = user._id;
            userSession.save((err, doc) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: "Error: server error"
                    });
                }

                return res.send({
                    success: true,
                    message: 'Valid sign in',
                    token: doc._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    cart: user.cart
                });
            });
        });
    });
    app.get('/api/account/verify', (req, res, next) => {
        // get the token
        const { query } = req;
        const { token } = query;
        //?token = test

        // verify the token
        UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, sessions) => {
            if (err) {
                //console.log(err);
                return res.send({
                    success: false,
                    message: "Error: server error"
                });
            }
            if (sessions.length != 1) {
                return res.send({
                    success: false,
                    message: "Error: Invalid"
                });
            } else {
                return res.send({
                    success: true,
                    message: "Good"
                });
            }
        });
    })
    app.get('/api/account/logout', (req, res, next) => {
        // get the token
        const { query } = req;
        const { token } = query;
        //?token = test

        // verify the token
        UserSession.findOneAndUpdate({
            _id: token,
            isDeleted: false
        }, {
            $set: { isDeleted: true }
        }, null, (err, sessions) => {
            if (err) {
                console.log(err);
                return res.send({
                    success: false,
                    message: "Error: server error"
                });
            }
            return res.send({
                success: true,
                message: "Good"
            });
        });
    })

};