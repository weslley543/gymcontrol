module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gymcontrol',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
