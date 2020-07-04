import User from '../../src/models/User'
import connectDB from '../../src/utils/connectDB'
import bcrypt from 'bcrypt'
import isLength from 'validator/lib/isLength'
import nodemailer from 'nodemailer'

export default async (req, res) => {
    await connectDB();
    switch (req.method) {
        case "PUT":
            await handlePutRequest(req, res);
            break;
        case "POST":
            await handlePostRequest(req, res);
            break;
        default:
            res.status(403).send("Forbidden Method");
            break;
    }
}

async function handlePutRequest(req, res) {

    try {
        const user = await User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } });
        console.log(user)
        if (!user) {
            return res.status(403).json({ msg: "Invalid Token" })
        }
        res.status(200).json({ msg: 'Valid Token' })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error" })
    }


}

async function handlePostRequest(req, res) {

    const { new_password, confirm_new_password, token } = req.body


    if (new_password != confirm_new_password) {
        return res.status(422).json({ msg: 'Passwords do not match' })
    }

    if (!isLength(new_password, { min: 6 })) {
        return res.status(422).json({ msg: "The password must be at least 6 characters long" });
    }

    try {
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        console.log(user)
        if (!user) {
            return res.status(403).json({ msg: "Invalid Token" })
        }

        const hash = await bcrypt.hash(new_password, 12);
        const updatedUser = await User.findOneAndUpdate(
            { resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } },
            {
                $set: {
                    password: hash,
                    resetPasswordToken: null,
                    resetPasswordExpires: null
                }
            }
        )

        console.log('password updated')

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ORIE_EMAIL,
                pass: process.env.ORIE_PASSWORD // naturally, replace both with your real credentials or an application-specific password
            }
        });

        const mail = await transporter.sendMail({
            to: user.email,
            from: process.env.ORIE_EMAIL,
            subject: 'Your password for Orié has been changed',
            text:
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        });

        res.status(200).json({ msg: "Your password has been changed" })


    }
    catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error" })
    }
}