import axios from 'axios';
import baseURL from '../../utils/baseURL';
import cookie from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';


const INITIAL_STATE = {
	username: '',
	photoURL: '',
	email: '',
	password: '',
	curr_password: '',
	new_password: '',
	confirm_new_password: ''
};

export default function EditPreferencesModal({ closeModal, data, updateProfileData }) {

	const [success, setSuccess] = React.useState(null);
	const [currPage, setCurrPage] = React.useState(1);
	const [error, setError] = React.useState(null);
	const [loading, setLoading] = React.useState(null);
	const [disabled, setDisabled] = React.useState(false);
	const [creds, setCreds] = React.useState(INITIAL_STATE);


	function handleChange(event) {
		const { id, value } = event.target;
		setCreds(prevState => ({ ...prevState, [id]: value }));
	}

	async function updateProfile(event) {
		event.preventDefault();

		try {
			setError(null);
			setSuccess(null);
			setLoading('is-loading');
			setDisabled(true);

			const { username, photoURL } = creds;
			const url = `${baseURL}/api/account`;
			const token = cookie.get('orie_token');
			const headers = { headers: { authorization: token } };
			const payload = { username, photoURL };
			const response = await axios.put(url, payload, headers);
			setSuccess(response.data.msg);
			updateProfileData();
			setCreds(INITIAL_STATE);
			document.getElementById('username').value = '';
			document.getElementById('photoURL').value = '';
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

	async function updateEmail(event) {
		event.preventDefault();

		try {
			setError(null);
			setSuccess(null);
			setLoading('is-loading');
			setDisabled(true);

			const { email, password } = creds;
			const url = `${baseURL}/api/account`;
			const token = cookie.get('orie_token');
			const headers = { headers: { authorization: token } };
			const payload = { email, password };
			const response = await axios.put(url, payload, headers);
			setSuccess(response.data.msg);
			updateProfileData();
			setCreds(INITIAL_STATE);
		}
		catch (error) {
			console.log(error);
			if (error.response.data.msg) {
				console.log(error.response.data.msg);
				setError(error.response.data.msg);
			}
		}
		finally {
			document.getElementById('password').value = '';
			setLoading(null);
			setDisabled(false);
		}
	}

	async function updatePassword(event) {
		event.preventDefault();

		const { curr_password, new_password, confirm_new_password } = creds;

		if (new_password != confirm_new_password) {
			setError('Passwords do not match');
			return;
		}

		if (new_password.length < 6) {
			setError('The password must be at least 6 characters long');
			return;
		}

		try {
			setError(null);
			setSuccess(null);
			setLoading('is-loading');
			setDisabled(true);

			const url = `${baseURL}/api/account`;
			const token = cookie.get('orie_token');
			const headers = { headers: { authorization: token } };
			const payload = { curr_password, new_password, confirm_new_password };
			const response = await axios.put(url, payload, headers);
			setSuccess(response.data.msg);
			updateProfileData();
			setCreds(INITIAL_STATE);
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
			document.getElementById('curr_password').value = '';
			document.getElementById('new_password').value = '';
			document.getElementById('confirm_new_password').value = '';
		}
	}

	return (
		<div className="profile">
			<div className='modal has-text-left is-active' id='edit-preferences-modal'>
				<div className='modal-background'></div>
				<div className='modal-card'>
					<header className='modal-card-head'>
						<p className='modal-card-title has-text-white' >Edit Profile ({currPage}/3)</p>
						<button className="button is-dark is-relative" id="close-button" onClick={closeModal}>
							<span className="icon is-small">
								<FontAwesomeIcon icon={faTimes} />
							</span>
						</button>
					</header>
					<section className='modal-card-body' id="edit-profile-body">

						{
							currPage == 1
								?
								<form onSubmit={updateProfile}>

									<label className='label has-text-white'>Current Username: <span className="has-text-success has-text-weight-normal">{data.user.username}</span></label>
									<label className='label has-text-white'>New Username</label>
									<div className="field">
										<p className="control is-expanded is-search">
											<input className="input has-background-black has-text-white" id="username" maxLength="30" type="text" placeholder="Username" onChange={handleChange}></input>
										</p>
									</div>

									<br></br>

									<label className='label has-text-white'>Profile Picture</label>

									<div className="field">
										<p className="control is-expanded is-search">
											<input className="input has-background-black has-text-white" id="photoURL" type="text" placeholder="Image URL" onChange={handleChange}></input>
										</p>
									</div>

									<br></br>

									<div className="field has-text-centered">
										<p className="control is-button" id="save-button-wrapper">
											<button className={`button is-orange ${loading}`} id="save-button" type="submit" disabled={disabled}><b>SAVE</b></button>
										</p>
									</div>

								</form>
								: currPage == 2
									?
									<form onSubmit={updateEmail}>

										<label className='label has-text-white'>Current Email: <span className="has-text-success has-text-weight-normal">{data.user.email}</span></label>
										<label className='label has-text-white'>New Email</label>
										<div className="field">
											<p className="control is-expanded is-search">
												<input className="input has-background-black has-text-white" id="email" maxLength="30" type="text" placeholder="Email" onChange={handleChange}></input>
											</p>
										</div>

										<br></br>

										<label className='label has-text-white'>Current Password</label>

										<div className="field">
											<p className="control is-expanded is-search">
												<input className="input has-background-black has-text-white" id="password" type="password" placeholder="Password" onChange={handleChange}></input>
											</p>
										</div>

										<br></br>

										<div className="field has-text-centered">
											<p className="control is-button" id="save-button-wrapper">
												<button className={`button is-orange ${loading}`} id="save-button" type="submit" disabled={disabled}><b>SAVE</b></button>
											</p>
										</div>

									</form>

									:
									<form onSubmit={updatePassword}>

										<label className='label has-text-white'>Current Password</label>
										<div className="field">
											<p className="control is-expanded is-search">
												<input className="input has-background-black has-text-white" id="curr_password" type="password" maxLength="128" onChange={handleChange}></input>
											</p>
										</div>

										<br></br>

										<label className='label has-text-white'>New Password</label>

										<div className="field">
											<p className="control is-expanded is-search">
												<input className="input has-background-black has-text-white" id="new_password" type="password" maxLength="128" onChange={handleChange}></input>
											</p>
										</div>

										<br></br>

										<label className='label has-text-white'>Confirm New Password</label>

										<div className="field">
											<p className="control is-expanded is-search">
												<input className="input has-background-black has-text-white" id="confirm_new_password" type="password" maxLength="128" onChange={handleChange}></input>
											</p>
										</div>

										<br></br>

										<div className="field has-text-centered">
											<p className="control is-button" id="save-button-wrapper">
												<button className={`button is-orange ${loading}`} id="save-button" type="submit" disabled={disabled}><b>SAVE</b></button>
											</p>
										</div>

									</form>

						}

						<div className="field has-text-centered has-text-success">
							{success ? <div> <br></br> <p>{success}</p></div> : null}
						</div>

						<div className="field has-text-centered has-text-danger">
							{error ? <div> <br></br> <p>{error}</p></div> : null}
						</div>

						<footer className="modal-card-foot">
							<button className="button is-link" id="prev-button" onClick={(() => setCurrPage((prevState) => prevState - 1))} disabled={currPage == 1 || disabled}>
								<span className="icon is-small">
									<FontAwesomeIcon icon={faArrowLeft} />
								</span>
							</button>
							<button className="button is-link" id="next-button" onClick={(() => setCurrPage((prevState) => prevState + 1))} disabled={currPage == 3 || disabled}>
								<span className="icon is-small">
									<FontAwesomeIcon icon={faArrowRight} />
								</span>
							</button>
						</footer>


					</section>
				</div>
			</div>
		</div>

	);
}