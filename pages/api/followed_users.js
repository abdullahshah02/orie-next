import User from '../../src/models/User'
import connectDB from '../../src/utils/connectDB'
import jwt from 'jsonwebtoken'

export default async (req, res) => {
    await connectDB();

    if (!req.headers.authorization) {
        return res.status(401).json({ msg: 'No authorization token' })
    }

    try {
        const { userID } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: userID }).populate({
            path: "followedUsers",
            model: "User"
        })

        if (user) {
            if (user.followedUsers.length > 0) {
                return res.status(200).json(user.followedUsers);
            }
            return res.status(404).json({ msg: "No users followed" });
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Internal Server Error" });
    }
}