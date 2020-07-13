import User from '../../src/models/User';
import connectDB from '../../src/utils/connectDB';
import sanitize from 'mongo-sanitize';

export default async (req, res) => {

	await connectDB();

	try {
		const userName = sanitize(req.query.userName);
		const userList = await User.find({ username: { $regex: `.*${userName}.*` } });
		if (userList) {
			if (userList.length > 0) {
				return res.status(200).json(userList);
			}
			return res.status(404).json({ msg: 'No users found' });
		}
	}
	catch (error) {
		console.log(error);
		res.status(500).send({ msg: 'Internal Server Error' });
	}
};
