import Sequelize, { Model } from 'sequelize';

class Registration extends Model {
  static init(sequelize) {
    super.init(
      {
        price: {
          type: Sequelize.FLOAT,
        },
        start_date: {
          type: Sequelize.DATE,
        },
        end_date: { type: Sequelize.DATE },
        canceled_at: {
          type: Sequelize.DATE,
        },
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Students, {
      foreignKey: 'student_id',
      as: 'student',
    });
    this.belongsTo(models.Plans, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export default Registration;
