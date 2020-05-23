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

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      price: Yup.number(),
      duration: Yup.number(),
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ msg: 'Id not received' });
    }

    const plan = await Plans.findByPk(req.body.id);

    if (!plan) {
      return res.status(401).json({ msg: 'Plan does not exists !' });
    }

    const { title, price, duration } = await plan.update(req.body);

    return res.status(200).json({ title, price, duration });
  }
}

export default new PlansContoller();
