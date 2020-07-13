import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../../src/models/User';
import connectDB from '../../src/utils/connectDB';

export default async (req, res) => {

	await connectDB();

	const { email } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(422).json({ msg: 'No user registered with given email' });
		}

		const token = crypto.randomBytes(20).toString('hex');
		const resetPasswordExpires = Date.now() + 3600000; //1 hour

		await User.findOneAndUpdate(
			{ email },
			{
				$set: {
					resetPasswordToken: token,
					resetPasswordExpires: resetPasswordExpires
				}
			}
		);

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.ORIE_EMAIL,
				pass: process.env.ORIE_PASSWORD 
			}
		});

		await transporter.sendMail({
			to: user.email,
			from: process.env.ORIE_EMAIL,
			subject: 'Orie Password Reset',
			text:
				'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'http://' + req.headers.host + '/reset_password?token=' + token + '\n\n' +
				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		});

		res.status(200).json({ msg: 'An email to reset the password has been sent' });

	}
	catch (error) {
		console.log(error);
		res.status(500).json({ msg: 'Internal Server Error' });
	}
};