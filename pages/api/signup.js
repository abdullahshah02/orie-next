import connectDB from '../../src/utils/connectDB'
import User from '../../src/models/User'
import Gallery from '../../src/models/Gallery'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
import sanitize from 'mongo-sanitize'


export default async (req, res) => {
    await connectDB();
    
    const username = sanitize(req.body.username)
    const email = sanitize(req.body.email)
    const password = sanitize(req.body.password)

    try {

        if (!isLength(username, { min: 3, max: 20 })) {
            return res.status(422).json({msg: "Username must be between 3 and 20 characters long"});
        }
        else if(!isLength(password, { min: 6})) {
            return res.status(422).json({msg: "The password must be at least 6 characters long"});
        }
        else if(!isEmail(email)) {
            return res.status(422).json({msg: "Invalid email"});
        }

        //Check if user already exists
        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            return res.status(422).json({msg: "A user with that email already exists"});
        }

        const checkUsername = await User.findOne({username})
        if(checkUsername) {
            return res.status(422).json({msg: "Username is taken"});
        }

        //Hash password and add to DB
        const hash = await bcrypt.hash(password, 12);
        const newUser = await new User({
            username,
            email,
            password: hash
        }).save()
        
        await new Gallery({user: newUser._id}).save();

        //Create token for user
        const token = jwt.sign({ userID: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        //Send back token
        return res.status(201).json(token)
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({msg: "Internal Server Error"});
    }
}