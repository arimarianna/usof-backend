const nodemailer = require('nodemailer');
const messageTemplate = require('./messageTemplate');

class Mailer {
  constructor() {
    const config = {
      host: process.env.MAILER_HOST,
      port: process.env.MAILER_PORT,
      secure: false,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    };

    this.transporter = nodemailer.createTransport(config, {
      from: 'Usof Notifications <>',
    });

    this.transporter.verify((error) => {
      if (error) {
        throw new Error('Cannot connect to SMTP server.');
      }
    });
  }

  _mailer = (message) => {
    this.transporter.sendMail(message, (error) => {
      if (error) {
        console.log('Error while send mail', error);
      }
    });
  };

  sendRegistrationConfirm = (email, key) => {
    const action = {
      link: `${process.env.UI_LINK}/con.register/` + key,
      title: 'Confirm email address',
    };

    this._mailer({
      to: email,
      subject: 'Confirm registration',
      html: messageTemplate(
        'Confirm your email to get started on Usof',
        'Before you go out and use Usof, please confirm an email address.',
        action),
    });
  };

  sendResetPassword = (email, key) => {
    const action = {
      link: `${process.env.UI_LINK}/reset.password/` + key,
      title: 'Confirm email address',
    };

    this._mailer({
      to: email,
      subject: 'Confirm registration',
      html: messageTemplate(
        'Confirm your email to get started on Usof',
        'Before you go out and use Usof, please confirm an email address.',
        action),
    });
  };
}

module.exports = new Mailer;