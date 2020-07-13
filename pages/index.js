import axios from 'axios';
import baseURL from '../src/utils/baseURL';
import Search from '../src/components/Search/Search';
import ImageGrid from '../src/components/Image/ImageGrid';

const INITIAL_STATE = {
	subreddit: 'r/art',
	uploadDate: 'week',
	numPosts: 50,
	category: 'hot',
	safeSearch: 'on'
};

function Home({ user, setPosts, posts }) {

	const [searchObject, setSearchObject] = React.useState(INITIAL_STATE);
	const [disabled, setDisabled] = React.useState(false);
	const [error, setError] = React.useState(null);
	const [loading, setLoading] = React.useState(null);

	async function handleSubmit(event) {
		event.preventDefault();

		try {
			setLoading('is-loading');
			setDisabled(true);
			setError(null);
			setPosts(null);
			const url = `${baseURL}/api/reddit`;
			const payload = { ...searchObject };
			const response = await axios.post(url, payload);
			if (response.data.length > 1)
				setPosts(response.data);
		}
		catch (error) {
			console.log(error);
			if (error.response.data.msg) {
				console.log(error.response.data.msg);
				setError(error.response.data.msg);
			}
		}
		finally {
			setLoading(null);
			setDisabled(false);
		}
	}

	function handleChange(event) {
		const { id, value } = event.target;

		if (id === 'numPosts') {
			setSearchObject(prevState => ({ ...prevState, numPosts: Number(value) }));
		}
		else {
			setSearchObject(prevState => ({ ...prevState, [id]: value.toLowerCase() }));
		}
	}

	return (
		<>
			<Search
				loading={loading}
				disabled={disabled}
				handleChange={handleChange}
				handleSubmit={handleSubmit}
			/>

			{error ? <div className="has-text-centered"> <br></br> <p className="title is-4 has-text-danger">{error}</p></div> : null}
			{posts ? <ImageGrid posts={posts} user={user} /> : null}
		</>
	);
}

export default Home;