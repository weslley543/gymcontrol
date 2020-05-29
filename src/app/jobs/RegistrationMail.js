import { format, parseIso } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { registration } = data;
    await mail.sendMail({
      to: `${registration.student.name} <${registration.student.name}>`,
      subject: 'Matrícula feita com sucesso',
      template: 'registration',
      context: {
        student: registration.student.name,
        price: registration.price,
        date: format(
          parseIso(registration.end_date),
          "'dia' dd 'de' MMMM 'às' H:mm'h",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new RegistrationMail();
