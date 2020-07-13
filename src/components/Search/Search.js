import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFilter, faBraille, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function Search({ loading, disabled, handleChange, handleSubmit }) {

	return (
		<div className="search">
			<div className="field has-text-centered">
				<h1 className="title is-3 has-text-white" id="site-subtitle">Personal Reddit Gallery</h1>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="field has-addons has-addons-centered">
					<p className="control is-expanded is-search" id="search-bar">
						<input className="input has-background-black has-text-white" id="subreddit" maxLength="30" onChange={handleChange} type="text" placeholder="Enter subreddit name (e.g. r/art)"></input>
					</p>

					<p className="control is-button" id="search-button-wrapper">
						<button type="submit" className={`button is-orange ${loading}`} id="search-button" onClick={handleSubmit} disabled={disabled}>Search</button>
					</p>
				</div>
			</form>

			<br></br>

			<div className="field">
				<div className="control is-option has-icons-left">
					<span className="select is-orange" id="select-upload-date">
						<select className="has-background-black has-text-white" id="uploadDate" onChange={handleChange}>
							<option>Upload Date</option>
							<option>Day</option>
							<option>Week</option>
							<option>Month</option>
							<option>Year</option>
						</select>

						<div className="icon is-small is-left">
							<FontAwesomeIcon icon={faClock} />
						</div>
					</span>

					<span className="select is-orange" id="select-nsfw">
						<select className="has-background-black has-text-white" id="safeSearch" onChange={handleChange}>
							<option>SafeSearch</option>
							<option>Off</option>
							<option>On</option>
						</select>

						<div className="icon is-small is-left">
							<FontAwesomeIcon icon={faExclamationTriangle} />
						</div>
					</span>

					<span className="select is-orange" id="select-sort-by">
						<select className="has-background-black has-text-white" id="category" onChange={handleChange}>
							<option>Sort By</option>
							<option>Hot</option>
							<option>Top</option>
							<option>New</option>
							<option>Controversial</option>
						</select>

						<div className="icon is-small is-left">
							<FontAwesomeIcon icon={faFilter} />
						</div>
					</span>

					<span className="select is-orange" id="select-num-posts">
						<select className="has-background-black has-text-white" id="numPosts" onChange={handleChange}>
							<option>Number of Posts</option>
							<option>100</option>
							<option>200</option>
							<option>300</option>
							<option>400</option>
							<option>500</option>
							<option>600</option>
							<option>700</option>
						</select>

						<div className="icon is-small is-left">
							<FontAwesomeIcon icon={faBraille} />
						</div>
					</span>

				</div>
			</div>
		</div >
	);
}

