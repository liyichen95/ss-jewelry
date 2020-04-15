const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
module.exports = (app) => {

    app.post('/api/account/update', (req, res, next) => {
        // get the token
        const { body } = req;
        const { cart } = body;
        let { email } = body;

        //email = email.toLowerCase();

        console.log('update', body);

        User.findOneAndUpdate({
            email: email,
            // cart:[],
            // isDeleted: false
        }, {
            $set: { cart: cart}
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
                message: "Updated",
                email: email,
                // cart: cart
            });
        });
    })


};