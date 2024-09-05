import '../login_signup.css';
import {Link, useNavigate} from 'react-router-dom'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"
import {useState} from "react";


import {name_picture} from '../../main-pages/Home'
import TypeWriter from "typewriter-effect";
//import {socket} from "../../App";

export var token;

function Login({setLoggedIn}) {
    const [error, setError] = useState(false)
    const navigate = useNavigate();

    async function checkForUser(event) {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        console.log(username, password);
        /**
         * TODO: uncomment some parts when server is available
         */
        const data = {
            username: username,
            password: password
        }

        // check if user exists - if it exists, get the token.
        const res = await fetch('http://localhost:5000/api/tokens', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                // 'accept': 'application/json',
            },
            'body': JSON.stringify(data)
        });
        const text = await res.text();
        if (res.status === 200) { //OK - user exists
            token = text;
            // get user info.
            const res2 = await fetch('http://localhost:5000/api/Users/' + username, {
                'method': 'get',
                'headers': {
                    'Content-Type': 'application/json',
                    'authorization': "bearer " + token,
                }
            });
            const json2 = await res2.json();
            name_picture.displayname = json2.DisplayName;
            name_picture.profilePicture = json2.ProfilePicture
            // "https://images-na.ssl-images-amazon.com/images/I/51e6kpkyuIL._AC_SX466_.jpg";
            name_picture.userName = json2.Username;
            //go to chat, and set error to false (no error).
            setError(false);
            setLoggedIn(true);
            //socket.emit("logged_in", {socket: socket.id, username: json2.username});
            navigate('/home', {replace: true});

            return;
        }
            //}
            // if(username in users) {
            //     if( users[username].password === password){
            //         name_picture.displayname = users[username].displayname;
            //         name_picture.profilePicture = users[username].pfp;
            //         setError(false);
            //         setLoggedIn(true);
            //         navigate('/chat',{replace:true});
            //         return;
            //     }
            // }

            setError(true);

        }
    return (
        <>
            <div className="navbar-custom"> {/* Gray navigation bar */}
            <div className="container-fluid">
                <div className="row row1" style={{ height: '100vh' }}>
                    {/* Left side - Login form (40% width) */}
                    <div className="col-4 d-flex justify-content-end align-items-center left-section1">
                        <div className="card card1 w-100">
                            <div className="card-body">
                                <h1 className="text-center">Login</h1>
                                <Form onSubmit={checkForUser}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="InputUsername1">Username</Form.Label>
                                        <Form.Group className="input-group">
                                            <div className="input-group-text">@</div>
                                            <Form.Control
                                                type="text"
                                                className="form-control"
                                                id="InputUsername1"
                                                placeholder="Enter Username"
                                                name='username'
                                            />
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="InputPassword1">Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            className="form-control"
                                            id="InputPassword1"
                                            placeholder="Enter password"
                                            name='password'
                                        />
                                    </Form.Group>
                                    <Button type="submit" variant="primary">
                                        Login
                                    </Button>
                                    {error && (
                                        <div className='text-danger'>
                                            Username or password is incorrect.
                                        </div>
                                    )}
                                    <span className="sign-box" style={{marginLeft:'5px'}}>
                                        Not registered? <Link to="/">Sign up here</Link>
                                    </span>
                                </Form>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Logo (60% width) */}
                    <div className="col-8 d-flex justify-content-start align-items-center right-section1">
                        <h2 className="text-container1">
                            <TypeWriter options={{
                                strings: [
                                    "Motion Magic is the best tool to use for solving Motion Problems - Danie Assa",
                                    "Discover amazing features",
                                    "Join our community today!",
                                    "Explore new opportunities",
                                ], autoStart: true, loop: true
                            }}/></h2>
                        <img src="/logo.png" alt="Logo" className="img-fluid1 logo1"/>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}

export default Login;