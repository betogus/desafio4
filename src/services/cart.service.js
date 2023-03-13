import {
    users
} from "../models/User.js";
import twilio from 'twilio';
import {
    createTransport
} from "nodemailer";
import dotenv from 'dotenv'

dotenv.config()

//Configuracion para envio de email

const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.TEST_MAIL,
        pass: process.env.TEST_PASS
    }
});

export function confirmarCompra(userId, productosEnElCarrito, callback) {
    users.findById(userId)
        .then(user => {
            let contenidoEmail = `
                <h3>Productos a enviar: <h3>
                <ul>
            `;
            productosEnElCarrito.forEach(item => {
                contenidoEmail += `<li>nombre: ${item.name}, precio: ${item.precioKg}</li>`;
            });
            contenidoEmail += `</ul>`;

            let contenidoMensaje = "";
            productosEnElCarrito.forEach(item => {
                contenidoMensaje += `nombre: ${item.name}, precio: ${item.precioKg}`;
            });

            //nodemailer
            const mailOptions = {
                from: process.env.TEST_MAIL,
                to: user.email,
                subject: `Nuevo pedido de ${user.username}`,
                html: contenidoEmail
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    callback(error, null);
                } else {
                    console.log('Correo electrónico enviado: ' + info.response);

                    //twilio
                    const accountSid = process.env.TWILIO_ACCOUNT_SID;
                    const authToken = process.env.TWILIO_AUTH_TOKEN;
                    const client = twilio(accountSid, authToken);
                    client.messages.create({
                            from: 'whatsapp:+14155238886',
                            body: `Nuevo pedido de ${user.username}. ${contenidoMensaje}`,
                            to: `whatsapp:+${user.phone}`
                        })
                        .then(message => {
                            console.log(message.sid);
                            callback(null, message);
                        })
                        .catch(error => {
                            console.log(error);
                            callback(error, null);
                        });
                }
            });
        })
        .catch(error => {
            console.log(error);
            callback(error, null);
        });
}