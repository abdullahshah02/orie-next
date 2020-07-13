import Link from 'next/link';
import { SignedOutLinks, SignedInLinks } from './HeaderLinks';
import { handleLogout } from '../../utils/auth';
import Nprogress from 'nprogress';
import Router from 'next/router';

Router.onRouteChangeStart = () => Nprogress.start();
Router.onRouteChangeComplete = () => Nprogress.done();
Router.onRouteChangeError = () => Nprogress.done();

export default function Header({ user }) {

	function toggleMenu(event) {
		document.querySelector('.navbar-burger').classList.toggle('is-active');
		document.querySelector('.navbar-menu').classList.toggle('is-active');
	}

	return (
		<div className="header">
			<nav className="navbar" role="navigation" aria-label="main navigation">
				<div className="navbar-brand">
					<Link href="/">
						<img src="https://cdn.discordapp.com/attachments/705792043108007936/708379772857876500/orie-logo.png" alt="Orie" width="80px"></img>
					</Link>

					<p role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" onClick={toggleMenu}>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</p>
				</div>

				<div className="navbar-menu">
					<div className="navbar-start">
						<Link href="/"><a className="navbar-item">Home</a></Link>
						<Link href="/users"><a className="navbar-item">Users</a></Link>
					</div>

					{user ? <SignedInLinks user={user} Link={Link} handleLogout={handleLogout} /> : <SignedOutLinks Link={Link} />}

				</div>
			</nav>
		</div>
	);
}