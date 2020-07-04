import cookie from 'js-cookie'
import Router from 'next/router'

export function redirectUser(ctx, location) {
    if (ctx.req) {
        ctx.res.writeHead(302, { Location: location });
        ctx.res.end();
    }
    else {
        Router.push(location);
    }
}


export function handleLogout() {
    cookie.remove('orie_token');
    window.localStorage.setItem('logout', Date.now())
    Router.push('/');
}

export function handleLogin(token) {
    cookie.set('orie_token', token , { sameSite: 'Strict' })
    Router.push('/');
}