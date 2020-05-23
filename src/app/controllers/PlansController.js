import * as Yup from 'yup';
import Plans from '../models/Plans';

class PlansContoller {
  async index(req, res) {
    const plans = await Plans.findAll();
    return res.status(200).json(plans);
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      duration: Yup.number().required(),
      title: Yup.string().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'information is fault !!' });
    }

    const plan = await Plans.create(req.body);

    return res.status(200).json(plan);
  }

  async delete(req, res) {
    const { id } = req.params;

    const plan = await Plans.findByPk(id);
    if (plan) {
      plan.destroy({ where: { id } });
      return res.status(200).json({ message: 'Plan removed' });
    }
    return res.status(400).json({ message: 'Plan does not exist' });
  }
}

export default new PlansContoller();
