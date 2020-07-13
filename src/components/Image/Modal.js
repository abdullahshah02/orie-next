import Link from 'next/link';
import axios from 'axios';
import cookie from 'js-cookie';
import baseURL from '../../utils/baseURL';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faArrowRight, faArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

export default function Modal({ user, post, closeModal, prevPost, nextPost, updatePosts, isSignedInUser }) {

	const router = useRouter();
	const [loading, setLoading] = React.useState(null);
	const [success, setSuccess] = React.useState(false);

	React.useEffect(() => {
		setSuccess(false);
		document.querySelector('#loader').classList.remove('is-hidden');
		document.querySelector('#post-image').classList.add('is-hidden');
	}, [post]);

	function displayImage() {
		document.querySelector('#loader').classList.add('is-hidden');
		document.querySelector('#post-image').classList.remove('is-hidden');
	}

	async function saveImage() {
		//send request to api
		try {
			setLoading('is-loading');
			const url = `${baseURL}/api/gallery`;
			const payload = { post: post };
			const token = cookie.get('orie_token');
			const headers = { headers: { authorization: token } };
			await axios.put(url, payload, headers);
			setSuccess(true);
		}
		catch (error) {
			console.log(error);
			if (error.response.data.msg == 'jwt malformed') {
				router.push('/login');
			}
			else if (error.response.data.msg) {
				console.log(error.response.data.msg);
				alert(error.response.data.msg);
			}
		}
		finally {
			setLoading(null);
		}
	}

	async function deleteImage() {
		try {
			setLoading('is-loading');
			const url = `${baseURL}/api/gallery`;
			const token = cookie.get('orie_token');
			const payload = {
				params: { post },
				headers: { authorization: token }
			};
			await axios.delete(url, payload);
			setSuccess(true);
			updatePosts();
		}
		catch (error) {
			console.log(error);
			if (error.response.data.msg == 'jwt malformed') {
				router.push('/login');
			}
			else if (error.response.data.msg) {
				console.log(error.response.data.msg);
				alert(error.response.data.msg);
			}
		}
		finally {
			setLoading(null);
		}
	}

	return (
		<div className="modal is-active" id='modal'>
			<div className="modal-background"></div>
			<div className="modal-card">
				<header className="modal-card-head has-text-centered">
					<a href={post.source} target="_blank" rel="noreferrer" className="modal-card-title has-text-info has-text-centered" id="post-title"><u>{post.title}</u></a>
					<button className="button is-dark is-relative" id="close-button" onClick={closeModal}>
						<span className="icon is-small">
							<FontAwesomeIcon icon={faTimes} />
						</span>
					</button>
				</header>
				<section className="modal-card-body">
					<img id="post-image" src={post.url} alt="" onLoad={displayImage} className="is-hidden"></img>
					<div className="loader is-relative" id="loader"></div>
				</section>
				<footer className="modal-card-foot">
					{
						user
							?
							success
								? isSignedInUser
									? <button className={`button is-orange ${loading}`} id="save-button" onClick={saveImage}>SAVE</button>
									: <button className={'button is-success'} id="save-button">SAVED</button>
								: isSignedInUser
									? <button className={`button is-danger ${loading}`} id="delete-button" onClick={deleteImage}>DELETE</button>
									: <button className={`button is-orange ${loading}`} id="save-button" onClick={saveImage}>SAVE</button>
							: <Link href='/login' id="save-button"><a className="button is-orange">SAVE</a></Link>
					}
					<button className="button is-link" id="prev-button" onClick={prevPost}>
						<span className="icon is-small">
							<FontAwesomeIcon icon={faArrowLeft} />
						</span>
					</button>
					<button className="button is-link" id="next-button" onClick={nextPost}>
						<span className="icon is-small">
							<FontAwesomeIcon icon={faArrowRight} />
						</span>
					</button>
					<a className="button is-dark" id="full-screen" target="_blank" rel="noreferrer" href={post.url}>
						<span className="icon is-small">
							<FontAwesomeIcon icon={faExternalLinkAlt} />
						</span>
					</a>
				</footer>
			</div>
		</div>
	);

}