import snoowrap from 'snoowrap'

const reddit = new snoowrap({
    userAgent: process.env.REDDIT_userAgent,
    clientId: process.env.REDDIT_clientId,
    clientSecret: process.env.REDDIT_clientSecret,
    refreshToken: process.env.REDDIT_refreshToken
});

export default reddit;