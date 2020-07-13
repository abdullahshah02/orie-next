import mongoose from 'mongoose';
const { String, Number, ObjectId, Date } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	photoURL: {
		type: String
	},
	followedUsers: [{
		type: ObjectId,
		ref: 'User'
	}],
	followerCount: {
		type: Number,
		default: 0
	},
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
},  {
	timestamps: true
});

export default mongoose.models.User ||
	mongoose.model('User', UserSchema);