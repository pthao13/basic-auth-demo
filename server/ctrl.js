require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')
const bcrypt = require('bcrypt');

// you wouldn't want to rejectUnauthorized in a production app, but it's great for practice
const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
        
});


const sequelizeInit = async() => {
    try {
        await sequelize.authenticate();
        console.log("connection has been established successfully.");
    } catch(error) {
        console.log({Message: "Unable to connect to the database"}, error);
    }
}
sequelizeInit();


module.exports = {
    createUser: async (req, res) => {
        const { email, password} = req.body
        const [existingUser] = await sequelize.query(`
        SELECT * From users_demo(email, password)
        where email = ${email}`);

        if(!existingUser.length) 
    {       const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt)


            const newUser = await sequelize.query(`
            INSERT INTO users_demo(email, password)
            VALUES (${email}, ${hash})
            returning *;`)
                
                if(newUser) {
                    console.log(newUser);
                    res.status(200).send("User Created")
                    return
                } else {
                    res.sendStatus(400);
                } 
            }
 
/*         sequelize.query(`
        INSERT INTO users_demo(email, password)
        VALUES (${email}, ${hash})
        `)
        .then((data) => {
            if(data) {
                console.log(data);
                res.status(200).send()
            } else {
                res.sendStatus(400);
            } 
        }); */
    },
    loginUser: async (req,res) => {
        const { email, password} = req.body;

        const [existingUser] = await sequelize.query(`
        SELECT * From users_demo(email, password)
        where email = ${email}`);

        const isAuthenticated = bcrypt.compareSync(password, existingUser[0].password)
        
        if(isAuthenticated) {
            req.session.user = {
                userId: existingUser[0].id,
                email: existingUser[0].email
            };
            res.status(200).send(req.session.user)
            return
        } res.send.status(401)
    },
    getSession: (req, res) => {
        if(req.session.user.userId) {
            res.status(200).send(req.session.user)
            return
        }
            res.send.status(401)
        
    }
};