import axios from 'axios';
import cookie from 'js-cookie';
import baseURL from '../src/utils/baseURL';
import UserCard from '../src/components/User/UserCard';

export default function FollowedUsers({ user }) {

	const [userList, setUserList] = React.useState(null);
	const [error, setError] = React.useState(null);
	// const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {

		async function getFollowedUsers() {
			try {
				// setLoading(true);
				setError(null);

				const token = cookie.get('orie_token');
				const url = `${baseURL}/api/followed_users`;
				const payload = { headers: { authorization: token } };
				const response = await axios.get(url, payload);
				setUserList(response.data);
			}
			catch (error) {
				if (error.response.data.msg) {
					console.log(error.response.data.msg);
					setError(error.response.data.msg);
				}
				console.log(error);
			}
			finally {
				// setLoading(false);
			}
		}

		getFollowedUsers();

	}, []);


	return (
		<div className="followed-users">
			<div className="field" >
				<h1 className="title is-3 has-text-centered has-text-white" id="site-subtitle">Followed Users</h1>
			</div>
			{
				error
					? <div className="field has-text-centered"> <br></br> <p className="title is-3 has-text-danger">{error}</p></div>
					: null
			}
			<div className="field" id="user-container">
				<div className="columns is-multiline">

					{
						userList
							? userList.map((user, index) => {
								return (
									<UserCard user={user} key={index} />
								);
							})
							: null
					}


				</div>
			</div>
		</div>
	);
}