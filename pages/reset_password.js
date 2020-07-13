import axios from 'axios';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import baseURL from '../src/utils/baseURL';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export default function ResetPassword() {
	const router = useRouter();

	const [valid, setValid] = React.useState(false);
	const [loading, setLoading] = React.useState(null);
	const [disabled, setDisabled] = React.useState(true);
	const [error, setError] = React.useState(null);
	const [success, setSuccess] = React.useState(null);
	const [creds, setCreds] = React.useState({
		new_password: '',
		confirm_new_password: ''
	});

	React.useEffect(() => {
		let timeout;
		if (success) {
			timeout = setTimeout(() => { router.push('/login'); }, 2000);
		}
		return () => {
			clearTimeout(timeout);
		};
	}, [success]);

	React.useEffect(() => {
		async function checkToken() {

			try {
				const { token } = router.query;
				if (!token) {
					router.push('/');
					return;
				}
				const url = `${baseURL}/api/reset_password`;
				const payload = { token };
				await axios.put(url, payload);
				setValid(true);
				cookie.remove('orie_token');
				window.localStorage.setItem('logout', Date.now());
			}
			catch (error) {
				if (error.response.data.msg === 'Invalid Token') {
					router.push('/');
					console.log('invalid_token');
				}
				setValid(false);
			}
		}

		checkToken();
	}, []);

	function handleChange(event) {
		const { id, value } = event.target;
		setCreds((prevState) => ({ ...prevState, [id]: value }));

		if (creds.new_password === creds.confirm_new_password) {
			setDisabled(false);
		}
	}

	async function handleSubmit(event) {

		event.preventDefault();

		if (creds.new_password != creds.confirm_new_password) {
			setError('Passwords do not match');
			return;
		}

		try {
			setError(null);
			setSuccess(null);
			setLoading('is-loading');
			setDisabled(true);
			const { token } = router.query;
			const url = `${baseURL}/api/reset_password`;
			const payload = { ...creds, token: token };
			await axios.post(url, payload);
			setSuccess('Password has been successfully updated');
			// router.push('/login')
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

	return (
		valid &&
		<div className="forgot-password">
			<div className="container">
				<div className="columns is-centered">
					<div className='column is-6-desktop is-6-tablet'>
						<form onSubmit={handleSubmit} className="box has-background-black">

							<div className="field has-text-centered">
								<h1 className="title has-text-white is-4">RESET PASSWORD</h1>
							</div>

							<br />

							<div className="field">
								<p className="control has-icons-left has-icons-right">
									<input className="input has-background-black-ter has-text-white" type="password" placeholder="New Password" id="new_password" maxLength="128" onChange={handleChange}></input>
									<span className="icon is-small is-left">
										<FontAwesomeIcon icon={faLock} />
									</span>
								</p>
							</div>

							<div className="field">
								<p className="control has-icons-left has-icons-right">
									<input className="input has-background-black-ter has-text-white" type="password" placeholder="Confirm New Password" id="confirm_new_password" maxLength="128" onChange={handleChange}></input>
									<span className="icon is-small is-left">
										<FontAwesomeIcon icon={faLock} />
									</span>
								</p>
							</div>

							<br />

							<p className="control has-text-centered">
								<button className={`button is-link ${loading}`} id="fp-button" type="submit" disabled={disabled}>Update Password</button>
							</p>

							<div className="field has-text-centered has-text-danger">
								{error ? <div> <br></br> <p>{error}</p></div> : null}
							</div>

							<div className="field has-text-centered has-text-success">
								{success ? <div> <br></br> <p>{success}</p></div> : null}
							</div>

						</form>
					</div>
				</div>
			</div>
		</div>
	);
}