import axios from 'axios';
import baseURL from '../src/utils/baseURL';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function forgotPassword() {

	const [email, setEmail] = React.useState('');
	const [disabled, setDisabled] = React.useState(false);
	const [error, setError] = React.useState(null);
	const [success, setSuccess] = React.useState(null);
	const [loading, setLoading] = React.useState(null);

	function handleChange(event) {
		setEmail(event.target.value);
	}

	async function handleSubmit(event) {
		event.preventDefault();

		try {
			setLoading('is-loading');
			setDisabled(true);
			setSuccess(null);
			setError(null);
			const url = `${baseURL}/api/forgot_password`;
			const payload = { email };
			const response = await axios.post(url, payload);
			setSuccess(response.data.msg);
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
		<div className="forgot-password">
			<div className="container">
				<div className="columns is-centered">
					<div className='column is-4-desktop is-6-tablet'>
						<form onSubmit={handleSubmit} className="box has-background-black">

							<div className="field has-text-centered">
								<h1 className="title has-text-white is-4">FORGOT PASSWORD</h1>
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

							<br />

							<p className="control has-text-centered">
								<button className={`button is-link ${loading}`} id="fp-button" type="submit" disabled={disabled}>Reset Password</button>
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