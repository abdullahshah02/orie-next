import axios from 'axios'
import baseURL from '../src/utils/baseURL'
import UserCard from '../src/components/User/UserCard'

export default function Users() {

    const [userName, setUsername] = React.useState('')
    const [userList, setUserList] = React.useState(null)
    const [error, setError] = React.useState(null)
    const [loading, setLoading] = React.useState(null)
    const [disabled, setDisabled] = React.useState(false)

    async function handleSubmit() {
        event.preventDefault();

        try {
            setLoading('is-loading')
            setDisabled(true)
            setError(null)

            const url = `${baseURL}/api/users?userName=${userName}`
            const response = await axios.get(url);
            setUserList(response.data)
        }
        catch (error) {
            if (error.response.data.msg) {
                console.log(error.response.data.msg)
                setError(error.response.data.msg)
            }
            console.log(error)
        }
        finally {
            setLoading(null)
            setDisabled(false)
        }
    }

    function handleChange(event) {
        setUsername(event.target.value);
    }

    return (
        <div className="user-search">

            <div className="field">
                <h1 className="title is-3 has-text-centered has-text-white" id="site-subtitle">Search Users on Orié</h1>
                <form onSubmit={handleSubmit}>
                    <div className="field has-addons has-addons-centered">
                        <p className="control is-expanded is-search" id="search-bar">
                            <input className="input has-background-black has-text-white" id="usernameQuery" maxLength="30" onChange={handleChange} type="text" placeholder="Enter your friend's profile name"></input>
                        </p>

                        <p className="control is-button" id="search-button-wrapper">
                            <button disabled={disabled} className={`button is-orange ${loading}`} id="search-button" type="submit">Search</button>
                        </p>
                    </div>
                </form>
            </div>

            <div className="field" id="user-container">
                <div className="columns is-multiline">
                    {
                        userList
                            ?
                            userList.map((user, index) => {
                                return (
                                    <UserCard user={user} key={index} />
                                )
                            })
                            : null
                    }
                </div>

                {
                    error
                        ? <div className="field has-text-centered"> <br></br> <p className="title is-4 has-text-danger">{error}</p></div>
                        : null
                }
            </div>
        </div>
    )
}