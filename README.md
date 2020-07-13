# Orié

## Link: https://orie.glitch.me

### Description:
Orié is an online reddit gallery where users can search images from their favourite subreddits and save the ones they like best. They can also view other users' galleries and choose to follow them if they like their gallery.

### Feature List:
1.	Sign Up
2.	Login/Logout
3.	Get Images from any subreddit and display them.
4.	Save/Delete images from gallery
5.	Load more images as the user scrolls down.
6.	Browse images in modal.
7.	Have images saved into separate folders based on the subreddit name.
8.	Edit user info including email, username, password and profile photo.
9.	View other users’ galleries.
10.	Follow/Unfollow other users.
 
### Stack: MERN
 
### Technologies used: 
1. MongoDB 
2. Express
3. React
4. NodeJS
5. NextJS

# Environment variables(next.config.js):
>
>module.exports = {
>	env: {
>		REDDIT_userAgent: <insert here>,
>		REDDIT_clientId: <insert here> ,
>		REDDIT_clientSecret: <insert here>,
>		REDDIT_refreshToken: <insert here>,
>		MONGO_SRV: <insert here>,
>		JWT_SECRET: <insert here>,
>		ORIE_EMAIL: <insert here>,
>		ORIE_PASSWORD: <insert here>,
>		PROD_URL: <insert here>,
>	},
>};
