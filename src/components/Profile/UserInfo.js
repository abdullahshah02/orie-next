import axios from 'axios'
import cookie from 'js-cookie'
import baseURL from '../../utils/baseURL'
import {useRouter} from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList } from '@fortawesome/free-solid-svg-icons'


export default function UserInfo({ data, isSignedInUser, openModal, currentUser, updateProfileData }) {

    const router = useRouter();
    const [isFollowedUser, setIsFollowedUser] = React.useState(false);
    const [loading, setLoading] = React.useState(null)
    const [disabled, setDisabled] = React.useState(false)


    React.useEffect(() => {

        if (currentUser) {
            const isFollowed = currentUser.followedUsers.indexOf(data.user._id)
            if (isFollowed >= 0) {
                setIsFollowedUser(true);
            }
        }

    }, [])

    async function followUser() {

        if(!currentUser) {
            router.push('/login')
            return 
        }

        try {
            setLoading('is-loading')
            setDisabled(true)
            const url = `${baseURL}/api/user`
            const token = cookie.get('orie_token');
            const headers = { headers: { authorization: token } }
            const payload = { userToFollow: data.user._id }
            const response = await axios.put(url, payload, headers)
            setIsFollowedUser(true)
            updateProfileData()
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(null)
            setDisabled(false)
        }

    }

    async function unFollowUser() {

        try {
            setLoading('is-loading')
            setDisabled(true)
            const url = `${baseURL}/api/user`
            const token = cookie.get('orie_token');
            const payload = {
                params: { userToUnFollow: data.user._id },
                headers: { authorization: token }
            }
            const response = await axios.delete(url, payload)
            setIsFollowedUser(false)
            updateProfileData()
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(null)
            setDisabled(false)
        }

    }

    return (
        <div className="profile">
            <div className='columns'>
                <div className='container'>
                    <div className="columns is-centered" id="profile-container">
                        <div className="column is-6-desktop is-12-tablet is-12-mobile" >
                            <div className="card" id="user-info-card">
                                <div className="card-image">
                                    <figure className="has-text-centered is-1by1">
                                        {
                                            data.user.photoURL
                                                ? <img src={data.user.photoURL} alt="placeholder" id="profile-picture"></img>
                                                : <img id="profile-picture" src="https://cdn.discordapp.com/attachments/686543270943522825/728642308014342185/user1.png" alt="placeholder"></img>
                                        }
                                    </figure>
                                </div>
                                <div className="card-content">
                                    <div className="media">
                                        <div className="media-content has-text-centered">
                                            <p className="title is-3 has-text-white">
                                                {data.user.username}
                                            </p>

                                            {
                                                data.user.followerCount === 1
                                                    ? <p className="subtitle is-6 has-text-white">{data.posts.length} Images | {data.user.followerCount} Follower</p>
                                                    : <p className="subtitle is-6 has-text-white">{data.posts.length} Images | {data.user.followerCount} Followers</p>
                                            }

                                            {
                                                isSignedInUser
                                                    ?
                                                    <span>
                                                        <button className='button is-orange' id='edit-preferences' onClick={openModal}>
                                                            <b>Edit Profile</b>
                                                        </button>

                                                    </span>

                                                    : isFollowedUser
                                                        ?
                                                        <button className={`button is-danger ${loading}`} id='unfollow-user' onClick={unFollowUser} disabled={disabled}>
                                                            <b>Unfollow</b>
                                                        </button>
                                                        :
                                                        <button className={`button is-link ${loading}`} id='follow-user' onClick={followUser} disabled={disabled}>
                                                            <b>Follow</b>
                                                        </button>


                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='profile-options is-fullwidth' id='folders-label'>
                        <div className='tabs is-fullwidth is-medium'>
                            <ul>
                                <li className="has-text-centered">
                                    <div className="field">
                                        <span className='icon has-text-white'>
                                            <FontAwesomeIcon icon={faList} />
                                        </span>
                                        <span className="has-text-white" id="gallery-label">Gallery</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}