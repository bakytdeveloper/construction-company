import sendEmail from '../config/emailConfig.js';

// Маппинг типов проектов
const PROJECT_TYPE_MAPPING = {
    'house': '🏡 Строительство дома',
    'apartment': '🏢 Покупка квартиры',
    'commercial': '🏭 Коммерческая недвижимость',
    'other': '📝 Другое'
};

// Форматирование даты
const formatDate = (date) => {
    return new Date(date).toLocaleString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Базовые стили для всех писем
const baseStyles = `
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1a8a42 0%, #03c3ae 100%);
            /*color: #ffdd06;*/
            padding: 3px;
            border-radius: 16px;
        }
        .email-content {
            background: white;
            padding: 30px;
            border-radius: 14px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e8f5e9;
            padding-bottom: 20px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            background: linear-gradient(135deg, #1a8a42 0%, #03c3ae 100%);
            color: #ffdd06;
             -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
            border-radius: 10px 10px 0 0;
            padding: 10px;
        }
        .badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            margin: 10px 0;
        }
        .badge-success {
            background: #4caf50;
            color: white;
        }
        .badge-warning {
            background: #ff9800;
            color: white;
        }
        .badge-danger {
            background: #f44336;
            color: white;
        }
        .info-card {
            background: #f1f8e9;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #1a472a;
        }
        .info-row {
            display: flex;
            margin-bottom: 15px;
            border-bottom: 1px dashed #c8e6c9;
            padding-bottom: 10px;
        }
        .info-label {
            font-weight: 600;
            min-width: 140px;
            color: #2e7d32;
        }
        .info-value {
            color: #1b5e20;
            flex: 1;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .message-box {
            background: #fff3e0;
            border: 1px solid #ffe0b2;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            color: #e65100;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e8f5e9;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #1a472a 0%, #2a6b3e 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
        }
        .contact-info {
            background: #e8f5e9;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
        }
        .contact-item {
            margin: 8px 0;
        }
        .emoji {
            font-size: 20px;
            margin-right: 8px;
        }
        .highlight {
            color: #1a472a;
            font-weight: bold;
        }
        .action-box {
            background: #fff8e1;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ffc107;
        }
    </style>
`;

// Письмо для клиента (подтверждение получения заявки)
const createClientEmailTemplate = (data) => {
    const projectType = PROJECT_TYPE_MAPPING[data.projectType] || data.projectType || 'Не указано';
    const now = new Date();

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${baseStyles}
</head>
<body>
    <div class="email-wrapper">
        <div class="email-content">
            <div class="header">
                <div class="logo">🏗️ Almaty Build Construction</div>
                <div class="badge badge-success">✅ Заявка получена</div>
            </div>
            
            <p>Здравствуйте, <strong>${data.name}</strong>!</p>
            
            <p>Спасибо за обращение в нашу строительную компанию! Мы получили вашу заявку и готовы помочь вам с реализацией вашего проекта в Алматы.</p>
            
            <div class="info-card">
                <h3 style="margin-top: 0; color: #1a472a;">📋 Детали вашей заявки</h3>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">👤</span> Имя:</span>
                    <span class="info-value"><strong>${data.name}</strong></span>
                </div>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">📱</span> Телефон:</span>
                    <span class="info-value"><strong>${data.phone}</strong></span>
                </div>
                
                ${data.email ? `
                <div class="info-row">
                    <span class="info-label"><span class="emoji">✉️</span> Email:</span>
                    <span class="info-value">${data.email}</span>
                </div>
                ` : ''}
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">🏠</span> Тип проекта:</span>
                    <span class="info-value"><strong>${projectType}</strong></span>
                </div>
                
                ${data.message ? `
                <div class="info-row">
                    <span class="info-label"><span class="emoji">💬</span> Сообщение:</span>
                    <span class="info-value">${data.message}</span>
                </div>
                ` : ''}
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">📅</span> Дата получения:</span>
                    <span class="info-value">${formatDate(now)}</span>
                </div>
            </div>
            
            <p>Наш специалист свяжется с вами в ближайшее время для уточнения деталей. Обычно это занимает не более <span class="highlight">30 минут</span>.</p>
            
            <div class="contact-info">
                <div class="contact-item"><span class="emoji">📞</span> <strong>+7 (777) 123-45-67</strong> - отдел продаж</div>
                <div class="contact-item"><span class="emoji">⏰</span> Режим работы: Пн-Пт 09:00-19:00 / Сб 10:00-16:00</div>
                <div class="contact-item"><span class="emoji">📍</span> г. Алматы, ул. Абая 123, БЦ "Алмалы"</div>
            </div>
            
            <div class="footer">
                <p>С уважением, команда Almaty Build Construction</p>
                <p>© ${new Date().getFullYear()} Все права защищены</p>
                <p style="font-size: 11px; color: #9ca3af;">Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

// Письмо для администратора (уведомление о новой заявке)
const createAdminEmailTemplate = (data) => {
    const projectType = PROJECT_TYPE_MAPPING[data.projectType] || data.projectType || 'Не указано';
    const now = new Date();

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${baseStyles}
</head>
<body>
    <div class="email-wrapper">
        <div class="email-content">
            <div class="header">
                <div class="logo">🏗️ Новая заявка на сайте</div>
                <div class="badge badge-danger">🔔 Требуется действие</div>
            </div>
            
            <p><strong>Уважаемый администратор,</strong></p>
            
            <p>Поступила новая заявка от клиента на сайте строительной компании. Требуется ваше внимание!</p>
            
            <div style="text-align: center; margin: 10px 0;">
                <span class="badge badge-warning">🚀 Свяжитесь с клиентом в ближайшее время</span>
            </div>
            
            <div class="info-card">
                <h3 style="margin-top: 0; color: #1a472a;">👤 Данные клиента</h3>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">👤</span> Имя:</span>
                    <span class="info-value"><strong>${data.name}</strong></span>
                </div>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">📱</span> Телефон:</span>
                    <span class="info-value">
                        <strong><a href="tel:${data.phone}" style="color: #1a472a; text-decoration: none;">${data.phone}</a></strong>
                        <span style="background: #ff9800; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-left: 10px;">Позвонить сейчас</span>
                    </span>
                </div>
                
                ${data.email ? `
                <div class="info-row">
                    <span class="info-label"><span class="emoji">✉️</span> Email:</span>
                    <span class="info-value"><a href="mailto:${data.email}" style="color: #1a472a; text-decoration: none;">${data.email}</a></span>
                </div>
                ` : ''}
                
                <h3 style="margin-top: 20px; color: #1a472a;">📋 Детали заявки</h3>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">🏠</span> Тип проекта:</span>
                    <span class="info-value"><strong>${projectType}</strong></span>
                </div>
                
                ${data.message ? `
                <div class="message-box">
                    <strong style="display: block; margin-bottom: 10px; color: #e65100;">💬 Сообщение клиента:</strong>
                    <p style="margin: 0; white-space: pre-line;">${data.message}</p>
                </div>
                ` : ''}
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">📅</span> Получено:</span>
                    <span class="info-value">${formatDate(now)}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">🔢</span> ID заявки:</span>
                    <span class="info-value">#${Date.now().toString().slice(-8)}</span>
                </div>
            </div>
            
            <div class="action-box">
                <p style="margin: 0;"><strong>📋 Необходимые действия:</strong></p>
                <p style="margin: 10px 0 0 0;">
                    1️⃣ Свяжитесь с клиентом в течение 30 минут<br>
                    2️⃣ Уточните детали проекта<br>
                    3️⃣ Согласуйте встречу или выезд специалиста<br>
                    4️⃣ Подготовьте коммерческое предложение
                </p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="tel:${data.phone}" class="button">📞 Позвонить клиенту</a>
            </div>
            
            <div class="footer">
                <p>Административная панель Almaty Build Construction</p>
                <p style="font-size: 11px; color: #9ca3af;">📍 г. Алматы, Казахстан</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

// Основная функция отправки уведомлений
export const sendContactNotification = async (contactData) => {
    const { name, email, phone, message, projectType } = contactData;

    console.log('📧 Отправка email уведомлений...');

    let emailSent = false;

    // 1. Отправка письма администратору (обязательно)
    try {
        await sendEmail({
            to: process.env.ADMIN_NOTIFY_EMAIL,
            subject: `🏗️ Новая заявка от ${name} - Almaty Build`,
            html: createAdminEmailTemplate({
                name,
                email,
                phone,
                message,
                projectType
            })
        });
        console.log(`✅ Уведомление отправлено админу на ${process.env.ADMIN_NOTIFY_EMAIL}`);
        emailSent = true;
    } catch (error) {
        console.error('❌ Ошибка отправки email админу:', error);
    }

    // 2. Отправка подтверждения клиенту (если указан email)
    if (email && email.trim()) {
        try {
            await sendEmail({
                to: email,
                subject: '✅ Ваша заявка принята | Almaty Build Construction',
                html: createClientEmailTemplate({
                    name,
                    email,
                    phone,
                    message,
                    projectType
                })
            });
            console.log(`✅ Подтверждение отправлено клиенту на ${email}`);
        } catch (error) {
            console.error('❌ Ошибка отправки email клиенту:', error);
        }
    } else {
        console.log('⚠️ Email не указан, пропускаем отправку клиенту');
    }

    return emailSent;
};

export default { sendContactNotification };