import mongoose from 'mongoose';
const connection = {};

export default async function connectDB() {

	if (connection.isConnected) {
		//Use current connection
		console.log('Using existing connection');
		return;
	}
	//Use new DB connection
	console.log('Connecting to DB...');

	const db = await mongoose.connect(process.env.MONGO_SRV, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	console.log('DB Connected');
	connection.isConnected = db.connections[0].readyState;
}