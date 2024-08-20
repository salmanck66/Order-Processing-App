import dotenv from 'dotenv';
import springedge from 'springedge';

dotenv.config();

const sendOTP = (otp) => {
    const message = `Hello ${otp}, This is a test message from Spring Edge`;

    const params = {
        sender: "SEDEMO",
        apikey: process.env.SPRING_EDGE_KEY,
        to: [process.env.ADMIN_PHONE_NUMBER],
        message: message,
        format: "json",
    };

    springedge.messages.send(params, 5000, (err, response) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(response);
    });
};

export default sendOTP;