import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const GallerySchema = new mongoose.Schema({
	user: {
		type: ObjectId,
		ref: 'User'
	},
	posts: []
});


export default mongoose.models.Gallery ||
	mongoose.model('Gallery', GallerySchema);