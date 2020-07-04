import connectDB from '../../src/utils/connectDB'
import Gallery from '../../src/models/Gallery';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
const { ObjectId } = mongoose.Types


export default async (req, res) => {
    await connectDB()
    switch (req.method) {
        case "GET":
            await handleGetRequest(req, res);
            break;
        case "PUT":
            await handlePutRequest(req, res);
            break;
        case "DELETE":
            await handleDeleteRequest(req, res);
            break;
        default:
            res.status(403).json({msg: `Method ${req.method} NOT ALLOWED`})
            break;
    }
}

async function handleGetRequest(req, res) {

    try {
        const { uid } = req.query
        const gallery = await Gallery.findOne({ user: ObjectId(uid) }).populate({
            path: "user",
            model: "User"
        })
        res.status(200).json(gallery)
    }
    catch (error) {
        console.error(error);
        res.status(404).json({msg: 'User does not exist'})
    }
}

async function handlePutRequest(req, res) {

    const { post } = req.body;

    if (!req.headers.authorization) {
        return res.status(401).json({msg: 'No authorization token'})
    }
    try {
        const { userID } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const gallery = await Gallery.findOne({ user: userID });

        const postExists = gallery.posts.findIndex((p, index) => {
            if (post.url === p.url)
                return true
        });

        if (postExists < 0) {
            await Gallery.findOneAndUpdate(
                {
                    _id: gallery._id
                },
                {
                    $push: {
                        posts: { ...post }
                    }
                }
            )

            console.log("updated")
            res.status(200).json({msg: 'Post added'})
        }
        else {
            console.log("already saved")
            res.status(201).json({msg: 'Post already saved'})
        }

    }
    catch (error) {
        if(error.name == 'JsonWebTokenError')
            return res.status(422).json({msg: 'jwt malformed'})

        res.status(500).json({msg: 'Internal Server Error'})
    }
}

async function handleDeleteRequest(req, res) {
    let {post} = req.query
    post = JSON.parse(post)
    if (!req.headers.authorization) {
        return res.status(401).json({msg: 'No authorization token'})
    }

    try {
        const { userID } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        await Gallery.findOneAndUpdate(
            {
                user: userID 
            },
            {
                $pull: {
                    posts: post 
                }
            }
        )
        res.status(200).send("Delete successful")
    }
    catch(error) {
        if(error.name == 'JsonWebTokenError')
            return res.status(422).json({msg: 'jwt malformed'})
        res.status(500).json({msg:"Internal Server Error"})
    }
}