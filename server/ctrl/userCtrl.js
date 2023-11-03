const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const session = {};
const sequelize = new Sequelize(
  "postgresql://postgres:yLu@wyhJ5@XMfpV@db.brbdulffzdmhtlfbinhd.supabase.co:5432/postgres"
); // Example for postgres

const sequlizeInit = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.log("Unable to connect to the database:", error);
  }
};
sequlizeInit();

module.exports = {
  createUser: async (req, res) => {
    const { email, password } = req.body;

    const saltRounds = 10;

    const [existingUser] = await sequelize.query(`
      SELECT * from users
      where email = '${email}';
    `);

    if (!existingUser.length) {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);

      const newUser = await sequelize.query(`
        INSERT INTO users(email, password)
        VALUES ('${email}', '${hash}')
        returning *;
      `);

      if (newUser) {
        res.status(200).send("User Created");
        return;
      }
    }

    res.sendStatus(400);
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;

    const [existingUser] = await sequelize.query(`
      SELECT * from users
      where email = '${email}';
    `);

    const isAuthenticated = bcrypt.compareSync(
      password,
      existingUser[0].password
    );

    if (isAuthenticated) {
      session.user = {
        userId: existingUser[0].id,
        email: existingUser[0].email,
      };
      console.log(
        "****************************User Session Created***************"
      );
      console.log(session);
      res.status(200).send(session.user);
      return;
    }

    res.sendStatus(401);
  },

  getSession: (req, res) => {
    if (session.hasOwnProperty("user")) {
      res.status(200).send(session.user);
      return;
    }
    res.sendStatus(401);
  },
};
