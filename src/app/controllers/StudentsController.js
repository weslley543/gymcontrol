import * as Yup from 'yup';
import Students from '../models/Students';

class StudentsController {
  async index(req, res) {
    const students = await Students.findAll();
    return res.status(200).json(students);
  }

  async show(req, res) {
    const { id } = req.params;
    const student = await Students.findByPk(id);
    return res.status(200).json(student);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      name: Yup.string().required(),
      weight: Yup.number(),
      height: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ msg: 'Information fault' });
    }
    const studentExists = await Students.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ msg: 'Aluno já cadastrado' });
    }

    const student = await Students.create(req.body);

    return res.status(200).json(student);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const studentExists = await Students.findByPk(id);
    if (studentExists) {
      await Students.destroy({ where: { id } });
      return res.status(200).json({ msg: 'User deleted' });
    }
    return res.status(401).json({ msg: 'User not find' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      name: Yup.string(),
      height: Yup.number(),
      weight: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ msg: 'Error' });
    }
    const { id } = req.params;
    const student = await Students.findByPk(id);

    if (!student) {
      return res.status(401).json({ msg: 'Student not find' });
    }
    const result = await student.update(req.body);
    return res.status(200).json(result);
  }
}

export default new StudentsController();
