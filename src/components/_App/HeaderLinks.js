export function SignedOutLinks({ Link }) {
    return (
        <div className="navbar-end">
            <div className="navbar-item">
                <div className="buttons">
                    <Link href="/signup" >
                        <a className="button is-light is-outlined"><strong>Sign Up</strong></a>
                    </Link>
                    <Link href="/login">
                        <a className="button is-light is-outlined">Login</a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export function SignedInLinks({ user, Link, handleLogout }) {
    return (
        <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable" id="user-info">
                <p className="navbar-link" id="user-name">
                    {user.username}
                </p>

                <div className="navbar-dropdown" id="user-menu">
                    <Link href='/user/[uid]' as={`/user/${user._id}`}>
                        <a className="navbar-item">Profile</a>
                    </Link>

                    <Link href="/followed_users">
                        <a className="navbar-item">Following</a>
                    </Link>
                    {/*<hr className="navbar-divider"></hr>*/}
                    <a className="navbar-item" onClick={handleLogout}>Logout</a>
                </div>
            </div>
        </div>
    )
}