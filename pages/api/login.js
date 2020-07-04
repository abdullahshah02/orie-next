import connectDB from '../../src/utils/connectDB'
import User from '../../src/models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sanitize from 'mongo-sanitize'

export default async (req, res) => {
    await connectDB();
    const email = sanitize(req.body.email)
    const password = sanitize(req.body.password)
    try {
        //Check if user exists
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            res.status(422).json({msg: "Invalid email or password"});
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
            //Create token for user
            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
            //Send back token
            res.status(201).json(token)
        }
        else {
            res.status(422).json({msg: "Invalid email or password"});
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).json({msg: "Internal Server Error"});
    }
}