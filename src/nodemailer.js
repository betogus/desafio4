import { createTransport } from "nodemailer";

//Configuracion para envio de email
const TEST_MAIL = "betogus2009@gmail.com"

export const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: TEST_MAIL,
        pass: 'adlzvqydmcmjoyjt' //Contraseña del link
    }
});

