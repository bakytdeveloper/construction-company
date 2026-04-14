import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

export const sendContactNotification = async (contactData) => {
    const { name, email, phone, message, projectType } = contactData;

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: process.env.ADMIN_NOTIFY_EMAIL,
        subject: `📋 Новое сообщение от ${name} - Строительная компания`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Новое сообщение с сайта</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <p><strong>👤 Имя:</strong> ${name}</p>
          <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>📞 Телефон:</strong> <a href="tel:${phone}">${phone}</a></p>
          <p><strong>🏠 Тип проекта:</strong> ${getProjectTypeText(projectType)}</p>
          <p><strong>💬 Сообщение:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${message}
          </div>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Сообщение отправлено через форму обратной связи на сайте строительной компании.
        </p>
      </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent to admin');

        // Auto-reply to user
        const userMailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Спасибо за обращение в строительную компанию',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Здравствуйте, ${name}!</h2>
          <p>Спасибо за ваше обращение в нашу строительную компанию.</p>
          <p>Мы получили ваше сообщение и свяжемся с вами в ближайшее время.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Ваше сообщение:</strong></p>
            <p>${message}</p>
          </div>
          <p>С уважением,<br>Команда строительной компании<br>г. Алматы, Казахстан</p>
        </div>
      `
        };

        await transporter.sendMail(userMailOptions);
        console.log('Auto-reply sent to user');

        return true;
    } catch (error) {
        console.error('Email error:', error);
        return false;
    }
};

const getProjectTypeText = (type) => {
    const types = {
        house: '🏡 Строительство дома',
        apartment: '🏢 Покупка квартиры',
        commercial: '🏭 Коммерческая недвижимость',
        other: '📝 Другое'
    };
    return types[type] || type;
};