import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import axios from 'axios'
import baseURL from '../src/utils/baseURL'
import { handleLogin } from '../src/utils/auth'

export default function SignUp() {

    const [creds, setCreds] = React.useState({
        email: '',
        password: '',
        username: ''
    })
    const [disabled, setDisabled] = React.useState(false)
    const [error, setError] = React.useState(null)

    function handleChange(event) {
        const { id, value } = event.target;
        setCreds(prevState => ({ ...prevState, [id]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            document.querySelector('#signup-button').classList.toggle('is-loading')
            setDisabled(true);
            setError(null);
            const url = `${baseURL}/api/signup`
            const payload = { ...creds }
            const response = await axios.post(url, payload)
            //console.log("TOKEN: ", response.data)
            handleLogin(response.data)
        }
        catch (error) {
            if (error.response.data.msg) {
                console.log(error.response.data.msg)
                setError(error.response.data.msg)
            }
            console.log(error)
        }
        finally {
            document.querySelector('#signup-button').classList.toggle('is-loading')
            setDisabled(false);
        }       
    }

    return (
        <div className="signup">
            <div className="container">
                <div className="columns is-centered">
                    <div className='column is-5-desktop is-6-tablet'>
                        <form onSubmit={handleSubmit} className="box has-background-black">

                            <div className="field has-text-centered">
                                <h1 className="title has-text-white is-3">SIGN UP</h1>
                            </div>

                            <br />

                            <div className="field">
                                <p className="control has-icons-left">
                                    <input className="input  has-background-black-ter has-text-white" type="text" placeholder="Username" id="username" maxLength="20" onChange={handleChange}></input>
                                    <span className="icon is-small is-left">
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                </p>
                            </div>

                            <div className="field">
                                <p className="control has-icons-left has-icons-right">
                                    <input className="input has-background-black-ter has-text-white" type="email" placeholder="Email" id="email" maxLength="128" onChange={handleChange}></input>
                                    <span className="icon is-small is-left">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </span>

                                </p>
                            </div>


                            <div className="field">
                                <p className="control has-icons-left">
                                    <input className="input  has-background-black-ter has-text-white" type="password" placeholder="Password" id="password" maxLength="128" onChange={handleChange}></input>
                                    <span className="icon is-small is-left">
                                        <FontAwesomeIcon icon={faLock} />
                                    </span>
                                </p>
                            </div>

                            <div className="field ">
                                <p className="control has-text-white has-text-centered">
                                    Already have an account? <Link href="/login" ><a>Log In!</a></Link>
                                </p>
                            </div>

                            <div className="field has-text-centered">
                                <button className="button is-link" type="submit" id="signup-button" disabled={disabled}>Sign Up</button>
                            </div>

                            <div className="field has-text-centered has-text-danger">
                                {error ? <div> <br></br> <p>{error}</p></div> : null}
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}