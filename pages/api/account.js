import User from '../../src/models/User'
import jwt from 'jsonwebtoken'
import connectDB from '../../src/utils/connectDB';
import isLength from 'validator/lib/isLength'
import bcrypt from 'bcrypt'
import isEmail from 'validator/lib/isEmail'

export default async (req, res) => {
    await connectDB()
    switch (req.method) {
        case "GET":
            await handleGetRequest(req, res);
            break;
        case "PUT":
            await handlePutRequest(req, res);
            break;
        default:
            res.status(403).json({ msg: `Method ${req.method} NOT ALLOWED` })
            break;
    }
}

async function handleGetRequest(req, res) {
    await connectDB();

    if (!req.headers.authorization) {
        return res.staus(401).send("No authorization token");
    }

    try {
        const { userID } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: userID })

        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ msg: "User not found" });
        }
    }
    catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
}

async function handlePutRequest(req, res) {

    const { username, photoURL } = req.body;
    const { email, password } = req.body;
    const { curr_password, new_password, confirm_new_password } = req.body
    //console.log(req.body)

    if (!req.headers.authorization) {
        return res.status(401).json({ msg: 'No authorization token' })
    }

    try {
        const { userID } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: userID }).select('+password');;

        if (user) {

            if (email && password) {

                const passwordsMatch = await bcrypt.compare(password, user.password);

                if (passwordsMatch) {

                    if(!isEmail(email)) {
                        return res.status(422).json({msg: "Invalid email"});
                    }

                    const emailExists = await User.findOne({ email: email });
                    if (emailExists) {
                        return res.status(422).json({ msg: "A user is already registered with that email" });
                    }

                    await User.findOneAndUpdate(
                        { _id: userID },
                        { $set: { email: email } }
                    )
                    return res.status(200).json({ msg: "Email successfully updated" })
                }
                else {
                    return res.status(422).json({ msg: "Incorrect password" });
                }

            }
            else if (curr_password && new_password && confirm_new_password) {

                const passwordsMatch = await bcrypt.compare(curr_password, user.password);

                if (passwordsMatch) {

                    if(new_password != confirm_new_password) {
                        return res.status(422).json({msg: 'Passwords do not match'})
                    }

                    const hash = await bcrypt.hash(new_password, 12);
                    await User.findOneAndUpdate(
                        { _id: userID },
                        { $set: { password: hash } }
                    )

                    return res.status(200).json({ msg: "Password successfully updated" });
                }
                else {
                    return res.status(422).json({ msg: "Incorrect password" });
                }
            }
            else {
                if (Boolean(photoURL)) {
                    await User.findOneAndUpdate(
                        { _id: userID },
                        { $set: { photoURL: photoURL } }
                    )
                    console.log("profile picture updated")
                }

                if (username) {

                    if (!isLength(username, { min: 3, max: 20 })) {
                        return res.status(422).json({ msg: "Username must be between 3 and 20 characters long" });
                    }

                    const checkUsername = await User.findOne({ username })
                    if (checkUsername) {
                        return res.status(422).json({ msg: "Username is taken" });
                    }

                    await User.findOneAndUpdate(
                        { _id: userID },
                        { $set: { username: username } }
                    )
                    return res.status(200).json({ msg: "Username successfully updated" })
                }
            }
        }
        else {
            res.status(422).json({ msg: "Error updating profile" })
        }
        res.status(200).json({ msg: "Profile successfully updated" })

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error" })
    }
}