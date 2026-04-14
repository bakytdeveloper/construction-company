import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FormSection = styled.section`
  padding: 80px 0;
  background: var(--background-light);
`;

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: var(--primary-color);
  font-size: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-dark);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--secondary-color);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  min-height: 120px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--secondary-color);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: var(--secondary-color);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 14px;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #d35400;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: var(--error);
  font-size: 14px;
  margin-top: 5px;
`;

const schema = yup.object({
    name: yup.string().required('Введите ваше имя').min(2, 'Имя должно содержать минимум 2 символа'),
    phone: yup.string().required('Введите номер телефона').matches(/^\+?7\d{10}$|^\+?77\d{9}$/, 'Введите корректный номер Казахстана'),
    email: yup.string().required('Введите email').email('Введите корректный email'),
    message: yup.string().required('Напишите сообщение').min(10, 'Сообщение должно содержать минимум 10 символов'),
    service: yup.string()
});

const ContactForm = () => {
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            service: 'consultation'
        }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact/submit`, data);

            if (response.data.success) {
                toast.success(response.data.message);
                reset();
            } else {
                toast.error(response.data.message || 'Ошибка при отправке');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('Ошибка соединения. Пожалуйста, попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormSection id="contact">
            <div className="container">
                <FormContainer
                    as={motion.div}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <FormTitle>Оставьте заявку</FormTitle>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                            <Label>Ваше имя *</Label>
                            <Input {...register('name')} placeholder="Иван Иванов" />
                            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <Label>Телефон *</Label>
                            <Input {...register('phone')} placeholder="+77771234567" />
                            {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <Label>Email *</Label>
                            <Input {...register('email')} type="email" placeholder="ivan@example.com" />
                            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <Label>Услуга</Label>
                            <Select {...register('service')}>
                                <option value="consultation">Консультация</option>
                                <option value="house-construction">Строительство дома</option>
                                <option value="apartment-purchase">Покупка квартиры</option>
                                <option value="renovation">Отделочные работы</option>
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label>Сообщение *</Label>
                            <TextArea {...register('message')} placeholder="Расскажите о вашем проекте..." />
                            {errors.message && <ErrorMessage>{errors.message.message}</ErrorMessage>}
                        </FormGroup>

                        <SubmitButton
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? 'Отправка...' : 'Отправить заявку'}
                        </SubmitButton>
                    </form>
                </FormContainer>
            </div>
        </FormSection>
    );
};

export default ContactForm;