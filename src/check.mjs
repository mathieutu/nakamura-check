import axios from 'axios';
import { JSDOM } from 'jsdom';
import {createTransport} from 'nodemailer'

const url = 'https://www.intersport.fr/velo_gravel_adulte_allroad_250-nakamura-p-YF60H6~8QQ';
const elementId = 'size-XL';

async function checkAvailability() {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const element = document.getElementById(elementId);

    if (element && !element.disabled) {
      console.log('Product is available!');
      await sendEmail();
    } else {
      console.log('Product is not available.');
    }
  } catch (error) {
    console.error('Error checking availability:', error);
  }
}

async function sendEmail() {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: '🎉 Nakamura All Road Disponible!',
      html: `<a href="${url}"><strong>Le vélo est dispo en XL ! </strong></a>`
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

await checkAvailability();
