import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, endOfHour } from 'date-fns';
import Registration from '../models/Registration';
import Plans from '../models/Plans';
import Students from '../models/Students';
import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

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

    const plan = await Plans.findOne({ where: { id: req.body.plan_id } });

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const existRegister = await Registration.findOne({
      where: { student_id: req.body.student_id, canceled_at: null },
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

    const endDate = endOfHour(new Date(hourStart));

    endDate.setMonth(endDate.getMonth() + plan.duration);
    const newRegistration = await Registration.create({
      plan_id: req.body.plan_id,
      student_id: req.body.student_id,
      price: plan.duration * plan.price,
      start_date: hourStart,
      end_date: endDate,
    });

    const registration = await Registration.findOne({
      where: { id: newRegistration.id },
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });
    await Queue.add(RegistrationMail.key, { registration });
    return res.status(200).json(newRegistration);
  }

  async delete(req, res) {
    const { id } = req.params;

    const registration = await Registration.findByPk(id);

    if (!registration) {
      return res.status(400).json({ error: 'Plan does not found !!' });
    }

    registration.canceled_at = new Date();
    await registration.save();

    return res.status(200).json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      student_id: Yup.number().required(),
      start_date: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Information is fault' });
    }

    const registration = await Registration.findOne({
      where: { student_id: req.body.student_id },
    });

    if (!registration) {
      return res.status(400).json({ msg: 'User not registrated' });
    }

    const plan = await Plans.findOne({ where: { id: req.body.plan_id } });
    if (!plan) {
      return res.status(400).json({ msg: 'Plan does not exist' });
    }
    registration.plan_id = plan.id;
    registration.price = plan.price * plan.duration;
    await registration.save();
    return res.status(200).json(registration);
  }
}

export default new RegistrationController();
