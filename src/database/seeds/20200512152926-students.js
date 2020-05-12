module.exports = {
  up: (QueryInterface) => {
    return QueryInterface.bulkInsert(
      'students',
      [
        {
          name: 'Weslley',
          email: 'weslleydrum@hotmail.com',
          height: 1.73,
          weight: 90.3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Jessenia',
          email: 'jesseniasales@gmail.com',
          height: 1.65,
          weight: 64,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
