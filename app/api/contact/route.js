// app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos (nombre, email, mensaje)' },
        { status: 400 }
      );
    }

    // Configurar transporte de nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587', 10),
      secure: process.env.EMAIL_SERVER_SECURE === 'true', // true para 465, false para otros puertos
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Construir contenido del email
    const destination = process.env.CONTACT_DESTINATION_EMAIL;
    if (!destination) {
      console.error('Falta CONTACT_DESTINATION_EMAIL en .env');
      return NextResponse.json(
        { error: 'Error interno: destino de correo no configurado' },
        { status: 500 }
      );
    }
    const mailOptions = {
      from: `"Contacto Inmobiliaria Marcon" <${process.env.EMAIL_SERVER_USER}>`,
      to: destination,
      subject: `Nuevo mensaje desde Contacto: ${name}`,
      text: `
Nuevo mensaje de contacto:
Nombre: ${name}
Email: ${email}
Teléfono: ${phone || 'No proporcionado'}
Mensaje:
${message}
      `,
      html: `
        <p>Nuevo mensaje de contacto:</p>
        <ul>
          <li><strong>Nombre:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</li>
        </ul>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error en API /api/contact:', err);
    return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 });
  }
}
