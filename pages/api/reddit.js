import r from '../../src/utils/redditConfig';

export default async (req, res) => {

	let { subreddit, category, numPosts, uploadDate, safeSearch } = req.body;

	//error checking
	if (subreddit.length < 1) subreddit = 'r/art';
	if (numPosts === 'number of posts') numPosts = 50;
	if (category.toLowerCase() === 'sort by') category = 'hot';
	if (uploadDate.toLowerCase() === 'upload date') uploadDate = 'week';
	if (safeSearch.toLowerCase() === 'safesearch') safeSearch = 'on';

	console.log({ subreddit, category, numPosts, uploadDate, safeSearch });

	try {
		const posts = await getPosts(r, category, subreddit, uploadDate, numPosts, safeSearch);

		if (posts.message) {
			return res.status(422).json({ msg: posts.message });
		}
		if (posts.length < 1) {
			return res.status(404).json({ msg: 'No posts found' });
		}
		res.status(200).json(posts);
	}
	catch (error) {
		res.status(500).json({ msg: 'Internal Server Error' });
	}
};

async function getPosts(r, category, subreddit, uploadDate, limit, safeSearch) {

	let posts;
	const results = [];

	try {
		if (category.toLowerCase() === 'hot') {
			console.log('getting hot posts...');
			posts = await r.getSubreddit(subreddit).getHot({ limit: limit, time: uploadDate });
		}
		else if (category.toLowerCase() === 'top') {
			console.log('getting top posts...');
			posts = await r.getSubreddit(subreddit).getTop({ limit: limit, time: uploadDate });
		}
		else if (category.toLowerCase() === 'new') {
			console.log('getting new posts...');
			posts = await r.getSubreddit(subreddit).getNew({ limit: limit, time: uploadDate });
		}
		else if (category.toLowerCase() === 'controversial') {
			console.log('getting controversial posts...');
			posts = await r.getSubreddit(subreddit).getControversial({ limit: limit, time: uploadDate });
		}


		for (const post of posts) {

			let title = post.title;
			const { thumbnail, url, over_18 } = post;
			const subreddit = post.subreddit_name_prefixed;
			const source = 'https://www.reddit.com' + post.permalink;
			const image_extension = url.substring(url.length - 4, url.length);

			if (title.length > 35) {
				title = title.substr(0, 35) + '...';
			}

			if (url.indexOf('reddit') === -1 && url.indexOf('/r/') === -1) {
				if (image_extension === '.jpg' || image_extension === '.png' || image_extension === '.gif') {
					if (safeSearch.toLowerCase() === 'off') {
						results.push({
							title,
							url,
							over_18,
							source,
							subreddit,
							thumbnail
						});

					}
					else if (safeSearch.toLowerCase() === 'on' && !post.over_18) {
						results.push({
							title,
							url,
							over_18,
							source,
							subreddit,
							thumbnail
						});
					}
				}
			}
		}

		return results;
	}
	catch (error) {
		return error;
	}
}