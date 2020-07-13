import Modal from './Modal';

export default function ImageGrid({ posts, user, isSignedInUser, deletePost }) {

	const [currPage, setCurrPage] = React.useState(1);
	const [modal, setModal] = React.useState(false);
	const [currModalPost, setCurrModalPost] = React.useState(null);
	const [currModalPostIndex, setCurrModalPostIndex] = React.useState(null);

	React.useEffect(() => {
		window.addEventListener('scroll', handleScroll);

		return function cleanup() {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);


	function handleScroll() {
		const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
		const body = document.body;
		const html = document.documentElement;
		const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
		const windowBottom = windowHeight + window.pageYOffset;
		// console.log("Window Bottom: ", windowBottom)
		// console.log("Doc Height: ", docHeight)
		if (windowBottom >= docHeight - 1) {
			setCurrPage((prevState) => {
				if (prevState < Math.ceil(posts.length / 8))
					return prevState + 1;
				else
					return prevState;
			});
		}
	}

	function openModal(event) {
		const { id } = event.target;
		const index = Number(id);
		setCurrModalPostIndex(index);
		setCurrModalPost(posts[index]);
		setModal(true);
	}

	function closeModal() {
		setModal(false);
	}

	function nextPost() {
		const next_index = currModalPostIndex + 1;
		if (next_index < posts.length) {
			setCurrModalPostIndex(next_index);
			setCurrModalPost(posts[next_index]);
		}
	}

	function prevPost() {
		const prev_index = currModalPostIndex - 1;
		if (prev_index >= 0) {
			setCurrModalPostIndex(prev_index);
			setCurrModalPost(posts[prev_index]);
		}
	}

	function updatePosts() {
		deletePost(currModalPost);
	}

	return (
		<div className="search">

			{modal
				? <Modal
					user={user}
					post={currModalPost}
					closeModal={closeModal}
					nextPost={nextPost}
					prevPost={prevPost}
					isSignedInUser={isSignedInUser}
					updatePosts={updatePosts}
				/>
				: null}

			<div id="img-container" >
				<div className="columns is-multiline is-mobile is-hidden-mobile" id="desktop-images">
					<div className="column" id="col-1">
						{posts.map((post, index) => {
							if (index % 4 === 0 && index < 8 * currPage)
								return <img id={index} src={post.url} alt={post.title} onClick={openModal} key={index}></img>;
							else
								return null;
						})}
					</div>
					<div className="column" id="col-2">
						{posts.map((post, index) => {
							if (index % 4 - 1 === 0 && index < 8 * currPage)
								return <img id={index} src={post.url} alt={post.title} onClick={openModal} key={index}></img>;
							else
								return null;
						})}
					</div>
					<div className="column" id="col-3">
						{posts.map((post, index) => {
							if (index % 4 - 2 === 0 && index < 8 * currPage)
								return <img id={index} src={post.url} alt={post.title} onClick={openModal} key={index}></img>;
							else
								return null;
						})}
					</div>
					<div className="column" id="col-4">
						{posts.map((post, index) => {
							if (index % 4 - 3 === 0 && index < 8 * currPage)
								return <img id={index} src={post.url} alt={post.title} onClick={openModal} key={index}></img>;
							else
								return null;
						})}
					</div>
				</div>

				<div className="columns is-multiline is-mobile is-hidden-tablet" id="mobile-images">
					<div className="column" id="col-1">
						{posts.map((post, index) => {
							if (index < 8 * currPage)
								return <img id={index} src={post.url} alt={post.title} onClick={openModal} key={index}></img>;
							else
								return null;
						})}
					</div>
				</div>
			</div>
		</div>
	);
}