import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, endOfHour } from 'date-fns';
import Registration from '../models/Registration';
import Plans from '../models/Plans';
import Students from '../models/Students';

class RegistrationController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const registrations = await Registration.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Plans,
          as: 'plan',
          attributes: ['title', 'duration', 'price'],
        },
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.status(200).json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      student_id: Yup.number().required(),
      start_date: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Data send is not valid' });
    }
    const { plan_id, student_id } = req.body;
    const plan = await Plans.findOne({ where: { id: req.body.plan_id } });

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const existRegister = await Registration.findOne({
      where: { student_id, canceled_at: null },
    });

    if (existRegister) {
      return res
        .status(400)
        .json({ error: 'User already registered in one plan ' });
    }
    const hourStart = startOfHour(parseISO(req.body.start_date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past date not permited' });
    }

    const end_date = endOfHour(new Date(hourStart));

    end_date.setMonth(end_date.getMonth() + plan.duration);
    const registration = await Registration.create({
      plan_id,
      student_id,
      price: plan.duration * plan.price,
      start_date: hourStart,
      end_date,
    });

    return res.status(200).json(registration);
  }

  async delete(req, res) {
    const { id } = req.params;

    const registration = await Registration.findByPk(id);

    if (!registration) {
      return res.status(400).json({ error: 'Plan does not found !!' });
    }

    registration.canceled_at = new Date();
    await registration.save();

    res.status(200).json(registration);
  }

  async update(req, res) {}
}

export default new RegistrationController();
