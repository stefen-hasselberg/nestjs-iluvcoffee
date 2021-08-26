module.exports = {
  type: 'mssql',
  host: process.env.DB_HOST,
  synchronize: true,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  extra: {
    options: {
      trustServerCertificate: true,
    },
  },
};
