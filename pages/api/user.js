import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../src/models/User';
import connectDB from '../../src/utils/connectDB';
const { ObjectId } = mongoose.Types;

export default async (req, res) => {
    await connectDB();
    switch (req.method) {
        case 'PUT':
            await handlePutRequest(req, res);
            break;
        case 'DELETE':
            await handleDeleteRequest(req, res);
            break;
        default:
            res.status(403).json({ msg: `Method ${req.method} NOT ALLOWED` });
            break;
    }
};

async function handlePutRequest(req, res) {

    const { userToFollow } = req.body;

    if (!req.headers.authorization) {
        return res.status(401).json({ msg: 'No authorization token' });
    }
    try {
        const { userID } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: userID });

        if (user) {
            await User.findOneAndUpdate(
                {
                    _id: userID
                },
                {
                    $push: {
                        followedUsers: ObjectId(userToFollow)
                    }
                }
            );

            await User.findOneAndUpdate(
                {
                    _id: ObjectId(userToFollow)
                },
                {
                    $inc: {
                        followerCount: 1
                    }
                }
            );

            res.status(200).json({ msg: 'User followed' });
        }

    }
    catch (error) {

        console.log(error);

        if (error.name == 'JsonWebTokenError')
            return res.status(422).json({ msg: 'jwt malformed' });

        res.status(500).json({ msg: 'Internal Server Error' });
    }
}

async function handleDeleteRequest(req, res) {

    const { userToUnFollow } = req.query;

    if (!req.headers.authorization) {
        return res.status(401).json({ msg: 'No authorization token' });
    }
    try {
        const { userID } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: userID });

        if (user) {
            await User.findOneAndUpdate(
                {
                    _id: userID
                },
                {
                    $pull: {
                        followedUsers: ObjectId(userToUnFollow)
                    }
                }
            );

            await User.findOneAndUpdate(
                {
                    _id: ObjectId(userToUnFollow)
                },
                {
                    $inc: {
                        followerCount: -1
                    }
                }
            );

            res.status(200).json({ msg: 'User unfollowed' });
        }

    }
    catch (error) {

        console.log(error);
        
        if (error.name == 'JsonWebTokenError')
            return res.status(422).json({ msg: 'jwt malformed' });

        res.status(500).json({ msg: 'Internal Server Error' });
    }
}