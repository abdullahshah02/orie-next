import Link from 'next/link';

export default function UserCard({ user }) {
	return (
		<div className="column is-4-desktop is-6-tablet">
			<div className="card has-background-black">
				<div className="card-content">
					<div className="media">
						<div className="media-left">
							<figure className="image is-128x128" id="card-profile-pic">
								{
									user.photoURL
										? <img src={user.photoURL} alt="placeholder"></img>
										: <img src="https://cdn.discordapp.com/attachments/686543270943522825/728641911107223642/user.png" alt="placeholder"></img>
								}

							</figure>
						</div>
						<div className="media-content">
							<p className="title is-size-4-desktop is-size-6-mobile is-size-4-tablet has-text-white">{user.username}</p>

							{
								user.followerCount === 1
									? <p className="subtitle is-6">{user.followerCount} Follower </p>
									: <p className="subtitle is-6">{user.followerCount} Followers </p>

							}

						</div>
					</div>
				</div>

				<footer className="card-footer">
					<p className="card-footer-item">
						<Link href='/user/[uid]' as={`/user/${user._id}`}>
							<a className="button is-link" id="view-profile-button">
								View Profile
							</a>
						</Link>
					</p>
				</footer>
			</div>
		</div>
	);
}