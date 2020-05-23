module.exports = {
  up: (QueryInterface) => {
    return QueryInterface.bulkInsert('plans', [
      {
        title: 'Diamond',
        duration: 6,
        price: 89.9,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Start',
        duration: 1,
        price: 129.9,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Gold',
        duration: 3,
        price: 109.9,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: () => {},
};
