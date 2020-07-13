import ImageGrid from '../Image/ImageGrid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function Folders({ folders, user, isSignedInUser }) {

	const [currFolder, setCurrFolder] = React.useState(null);

	function openFolder(event) {
		const { name } = event.target;
		setCurrFolder({ name: name, posts: folders[name] });
	}

	function deletePost(post) {
		if (currFolder) {
			const index = currFolder.posts.indexOf(post);
			const posts = currFolder.posts;

			if (index > -1) {
				posts.splice(index, 1);
				setCurrFolder((prevState) => ({ ...prevState, posts: posts }));
			}
		}
	}

	return (
		<div className="profile">
			<div className='columns is-mobile is-multiline is-centered' id='folder-container'>
				{
					!currFolder
						?
						Object.entries(folders).map(function (key) {
							const subreddit = key[0];
							const posts = key[1];
							return (
								<div className='column is-2-desktop is-4-tablet is-12-mobile' key={key}>
									<div className='card'>
										<div className='card-image'>
											<figure className='image'>
												<img alt='' src={posts[0].url} name={subreddit} onClick={openFolder}></img>
											</figure>
										</div>
										<div className='card-content'>
											<div className='content'>
												<h3 className="has-text-white has-text-centered title is-6">{subreddit}</h3>
											</div>
										</div>


										<footer className='card-footer'>
											<button className='card-footer-item is-link' id='open-button-2' name={subreddit} onClick={openFolder}>OPEN</button>
										</footer>
									</div>
								</div>
							);
						})

						:
						<>
							<div className="container is-fluid">
								<div className="field has-text-centered">
									<Link href='/user/[uid]' as={`/user/${user._id}`}>
										<button className="button is-dark" id="folder-back-button" >
											<FontAwesomeIcon icon={faArrowLeft} />
										</button>
									</Link>
									<span className="title is-size-5-desktop is-size-5-tablet is-size-6-mobile has-text-white" id="folder-label">{currFolder.name} ({currFolder.posts.length} images)</span>
								</div>
							</div>

							<ImageGrid
								posts={currFolder.posts}
								user={user}
								isSignedInUser={isSignedInUser}
								deletePost={deletePost}
							/>

							<div className="container is-fluid">
								<div className="field has-text-centered">
									<Link href='/user/[uid]' as={`/user/${user._id}`}>
										<button className="button is-dark" id="folder-back-button" >
											<FontAwesomeIcon icon={faArrowLeft} />
										</button>
									</Link>
									<span className="title is-size-5-desktop is-size-5-tablet is-size-6-mobile has-text-white" id="folder-label">{currFolder.name} ({currFolder.posts.length} images)</span>
								</div>
							</div>
						</>

				}
			</div>
		</div>

	);

}