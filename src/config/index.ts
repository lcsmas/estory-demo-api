const dbConfig = {
  development: {
    username: 'root',
    password: '',
    database: 'estory-new-dev',
    host: 'localhost',
    dialect: 'mysql',
    admin_id: 1303,
  },
  test: {
    username: 'root',
    password: '',
    database: 'estory-new-dev-test',
    host: 'localhost',
    dialect: 'mysql',
    admin_id: 1303,
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    admin_id: process.env.ADMIN_ID,
  },
};

export default dbConfig;
