import { useRouter } from 'next/router'
import axios from 'axios'
import baseURL from '../../src/utils/baseURL'
import UserInfo from '../../src/components/Profile/UserInfo'
import Folders from '../../src/components/Profile/Folders'
import EditProfileModal from '../../src/components/Profile/Modal'
import _ from 'underscore'

export default function User({ user }) {

    const router = useRouter()
    const { uid } = router.query
    const [data, setData] = React.useState(null)
    const [profileUpToDate, setProfileUpToDate] = React.useState(false)
    const [folders, setFolders] = React.useState(null)
    const [isSignedInUser, setFlag] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [modal, setModal] = React.useState(0)

    React.useEffect(() => {

        async function updateProfileData() {
            if (!profileUpToDate) {
                const url = `${baseURL}/api/gallery?uid=${uid.toString()}`
                const response = await axios.get(url);
                const posts = response.data.posts.reverse();
                const folders = _.groupBy(posts, post => post.subreddit)
                setFolders(folders);
                setData(response.data);
                setProfileUpToDate(true)
            }
        }

        updateProfileData();
       
    }, [profileUpToDate])

    function openModal() {
        setModal(1)
    }

    function closeModal() {
        setModal(0)
    }

    function updateProfileData() {
        console.log("profile data not up to date")
        setProfileUpToDate(false)
    }

    React.useEffect(() => {

        async function fetchUserData() {
            try {
                setLoading(true)
                setData(null)
                setError(null)
                const url = `${baseURL}/api/gallery?uid=${uid.toString()}`
                const response = await axios.get(url);
                const posts = response.data.posts.reverse();
                const folders = _.groupBy(posts, post => post.subreddit)
                setFolders(folders);
                setData(response.data);
                setProfileUpToDate(true)
            }
            catch (error) {
                
                console.log(error)
                if (error.response.data.msg) {
                    console.log(error.response.data.msg)
                    setError(error.response.data.msg)
                }
            }
            finally {
                setLoading(false)
            }
        }

        fetchUserData();
        if (user) {
            if (user._id == uid) {
                setFlag(true)
            }
        }

    }, [router.query])

    return (
        <>
            {loading ? <div className="profile"><div className="orange-loader"></div></div> : null}
            {error ? <div className="has-text-centered"> <br></br> <p className="title is-4 has-text-danger">{error}</p></div> : null}
            {data ?
                <>
                    <UserInfo data={data} isSignedInUser={isSignedInUser} currentUser={user} openModal={openModal} updateProfileData={updateProfileData} />
                    {folders ? <Folders folders={folders} user={user} isSignedInUser={isSignedInUser} /> : null}

                </>
                : null
            }
            {isSignedInUser ?
                modal > 0 ? <EditProfileModal closeModal={closeModal} data={data} updateProfileData={updateProfileData} /> : null
                : null
            }
        </>
    )
}