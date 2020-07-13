const baseURL = process.env.NODE_ENV === 'production'
	? process.env.PROD_URL
	: 'http://localhost:3000';

export default baseURL;