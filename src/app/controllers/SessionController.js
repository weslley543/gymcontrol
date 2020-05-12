import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/authConfig';
import User from '../models/User';

class SessionController {
  async index(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ msg: 'User not found !!' });
    }

    if (!(await user.checkPassword(password))) {
      res.status(401).json({ msg: 'Password does not match' });
    }
    const { id, nome } = user;
    return res.json({
      user: {
        id,
        email,
        nome,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
