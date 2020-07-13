import App from 'next/app';
import React from 'react';
import axios from 'axios';
import Router from 'next/router';
import { parseCookies, destroyCookie } from 'nookies';
import { redirectUser } from '../src/utils/auth';
import baseURL from '../src/utils/baseURL';
import HeadTag from '../src/components/_App/HeadTag';
import Header from '../src/components/_App/Header';
import '../src/styles/styles.sass';
import '../src/styles/styles.css';

class MyApp extends App {

	constructor(props) {
		super(props);
		this.state = {
			posts: []
		};
	}

	setPosts = posts => {
		this.setState({
			posts: posts
		});
	}

	componentDidMount() {
		window.addEventListener('storage', this.syncLogout);
	}

	syncLogout = event => {
		if (event.key === 'logout') {
			Router.push('/');
		}
	}

	static async getInitialProps({ Component, ctx }) {

		let pageProps = {};
		const cookies = parseCookies(ctx);

		const token = cookies.orie_token;

		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}

		if (!token) {
			const isProtectedRoute = ctx.pathname === '/followed_users';
			if (isProtectedRoute) {
				redirectUser(ctx, '/login');
			}
		}
		else {
			try {

				const isProtectedRoute = ctx.pathname === '/login' || ctx.pathname === '/signup' || ctx.pathname === '/forgot_password';
				if (isProtectedRoute) {
					redirectUser(ctx, '/');
				}

				const payload = { headers: { authorization: token } };
				const url = `${baseURL}/api/account`;
				const response = await axios.get(url, payload);
				const user = response.data;

				if (!pageProps)
					pageProps = {};

				pageProps.user = user;
			}
			catch (error) {
				console.log(error);
				destroyCookie(ctx, 'orie_token');
				redirectUser(ctx, '/');
			}
		}

		return { pageProps: pageProps };
	}

	render() {
		const { Component, pageProps } = this.props;
		return (
			<>
				<HeadTag />
				<Header {...pageProps} />
				<Component {...pageProps} posts={this.state.posts} setPosts={this.setPosts} />
			</>
		);
	}
}

export default MyApp;