import '../login_signup.css';
import {Link, useNavigate} from 'react-router-dom'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"
import {useState} from "react";


import {name_picture} from '../../main-pages/Home'
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
                <title>Login</title>
                <link href="../login_signup.css" rel="stylesheet"/>
                <div className="back-box"/>
                <div className="card login-box">
                    <div className="card-body">
                        <Form className="" onSubmit={checkForUser}>
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
                            <Button type="submit" className="btn btn-primary">
                                Login
                            </Button>
                            {error && (
                                <div className='text-danger'>
                                    Username or password is incorrect.
                                </div>
                            )}
                            <span className="sign-box">
                            Not registered? <Link to="/">Sign up here</Link>
                        </span>
                        </Form>
                    </div>
                </div>
            </>
        );
    }

    export default Login;