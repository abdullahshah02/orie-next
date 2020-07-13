import axios from 'axios';
import Link from 'next/link';
import baseURL from '../src/utils/baseURL';
import { handleLogin } from '../src/utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

export default function Login() {

	const [creds, setCreds] = React.useState({
		email: '',
		password: ''
	});
	const [disabled, setDisabled] = React.useState(false);
	const [loading, setLoading] = React.useState(null);
	const [authError, setAuthError] = React.useState(null);

	function handleChange(event) {
		const { id, value } = event.target;
		setCreds(prevState => ({ ...prevState, [id]: value }));
	}

	async function handleSubmit(event) {

		event.preventDefault();

		try {
			setLoading('is-loading');
			setDisabled(true);
			setAuthError(null);
			const url = `${baseURL}/api/login`;
			const payload = { ...creds };
			const response = await axios.post(url, payload);
			handleLogin(response.data);
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
		<div className="login">
			<div className="container">
				<div className="columns is-centered">
					<div className='column is-5-desktop is-6-tablet'>
						<form onSubmit={handleSubmit} className="box has-background-black">

							<div className="field has-text-centered">
								<h1 className="title has-text-white is-3">LOGIN</h1>
							</div>

							<br />

							<div className="field">
								<p className="control has-icons-left has-icons-right">
									<input className="input has-background-black-ter has-text-white" type="email" placeholder="Email" id="email" maxLength="128" onChange={handleChange}></input>
									<span className="icon is-small is-left">
										<FontAwesomeIcon icon={faEnvelope} />
									</span>

								</p>
							</div>

							<div className="field">
								<p className="control has-icons-left">
									<input className="input has-background-black-ter has-text-white" type="password" placeholder="Password" id="password" maxLength="128" onChange={handleChange}></input>
									<span className="icon is-small is-left">
										<FontAwesomeIcon icon={faLock} />
									</span>
								</p>
							</div>

							<div className="field">
								<p className="control has-text-white has-text-right">
									<Link href="/forgot_password"><a>Forgot Password?</a></Link>
								</p>
							</div>

							<div className="field ">
								<p className="control has-text-white has-text-centered">
									Don't have an account? <Link href="/signup" ><a>Sign Up!</a></Link>
								</p>
							</div>

							<p className="control has-text-centered">
								<button type="submit" className={`button is-link ${loading}`} id="login-button" disabled={disabled}>Login</button>
							</p>

							<div className="field has-text-centered has-text-danger">
								{authError ? <div> <br></br> <p>{authError}</p></div> : null}
							</div>

						</form>
					</div>
				</div>
			</div>
		</div>
	);
}