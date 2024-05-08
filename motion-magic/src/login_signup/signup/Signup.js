import '../login_signup.css'
import {Link, useNavigate} from 'react-router-dom'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"
import {useState} from "react";
import InputField from './InputField.js'

function Signup() {
    const [errors, setErrors] = useState({
        username: {message: '', invalid: 2},
        password1: {message: '', invalid: 2},
        password2: {message: '', invalid: 2},
        displayname: {message: '', invalid: 2},
        file: {message: '', invalid: 2},
    });
    // 0 = valid, 1 = invalid - display message, 2= empty, do nothing.
    const [pic, setPic] = useState('')
    //const reader = new FileReader();
    const [realPic, setRealPic] = useState(null);
    const defaultProfilePicture = "https://images-na.ssl-images-amazon.com/images/I/51e6kpkyuIL._AC_SX466_.jpg";
    const navigate = useNavigate();
    function checkPassword(event) {
        let password = event.target.value;
        // if(password===''){
        //     setErrors({...errors,password1:{message:'', invalid:1}});
        //     return;
        // }
        if (password.length < 6) {

            setErrors({
                ...errors, password1: {
                    message: 'Password length must contain a minimum of 6 characters',
                    invalid: 1
                }
            });

            return;
        }

        // to check space
        if (password.indexOf(" ") !== -1) {
            //setError("Password can't contain spaces.");
            setErrors({
                ...errors, password1: {
                    message: "Password can't contain spaces.",
                    invalid: 1
                }
            });
            return;
        }

        // for digits from 0 to 9
        let count = 0;
        for (let i = 0; i <= 9; i++) {
            if (password.indexOf(i) !== -1) {
                count = 1;
            }
        }
        if (count === 0) {
            //setError("Password must contain at least one digit.");
            setErrors({
                ...errors, password1: {
                    message: "Password must contain at least one digit.",
                    invalid: 1
                }
            });
            return;
        }

        // for special characters
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            //setError("Password must contain at least one special characters.");
            setErrors({
                ...errors, password1: {
                    message: "Password must contain at least one special characters.",
                    invalid: 1
                }
            });
            return;
        }

        // for capital letters
        count = 0;
        for (let i = 65; i <= 90; i++) {
            if (password.indexOf(String.fromCharCode(i)) !== -1) {
                count = 1;
            }
        }
        if (count === 0) {
            //setError("Password must contain uppercase characters.");
            setErrors({
                ...errors, password1: {
                    message: "Password must contain uppercase characters.",
                    invalid: 1
                }
            });
            return;
        }

        // for small letters
        count = 0;
        for (let i = 97; i <= 122; i++) {
            if (password.indexOf(String.fromCharCode(i)) !== -1) {
                count = 1;
            }
        }
        if (count === 0) {
            //setError("Password must contain lowercase characters.");
            setErrors({
                ...errors, password1: {
                    message: "Password must contain lowercase characters.",
                    invalid: 1
                }
            });
            return;
        }
        setErrors({...errors, password1: {message: '', invalid: 0}});
        // if all conditions fail we don't change anything

    }
    function changeFromEmpty(event) {
        let name = event.target.name;
        if(event.target.value!=='') {
            setErrors({...errors, [name]: {message: '', invalid: 0}});
        } else {
            setErrors({...errors, [name]: {message: '', invalid: 2}});

        }
    }

    function showPic(event) {
        let file = event.target.files[0];
        setRealPic(file);
        if (file) {
            setPic(URL.createObjectURL(event.target.files[0]))
        } else {
            setPic('')
        }
    }

    function checkAllValids() {
        for (const property in errors) {
            if (errors[property].invalid === 1)
                return false;
        }
        return true;
    }

    function checkEmpty(username, password1, password2, displayname) {
        let empty = false;
        if (username === '') {
            setErrors((errors) => ({...errors, username: {message: "Must input username.", invalid: 1}}))
            empty = true;
        }
        if (password1 === '') {
            // setErrors({...errors, password1: {message: "Must input password.", invalid: 1}})
            setErrors((errors) => ({
                ...errors,
                password1: {message: "Must input password.", invalid: 1}
            }))

            empty = true;

        }
        if (password2 === '') {
            // setErrors({...errors, password2: {message: "Must input password verification.", invalid: 1}})
            setErrors((errors) => ({
                ...errors,
                password2: {message: "Must input password verification.", invalid: 1}
            }))

            empty = true;

        }
        if (displayname === '') {
            // setErrors({...errors, displayname: {message: "Must input display name.", invalid: 1}})
            setErrors((errors) => ({
                ...errors,
                displayname: {message: "Must input display name.", invalid: 1}
            }))

            empty = true;

        }
        // console.log(empty);
        return empty;

    }
    function getBase64() {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                resolve(reader.result);
            };

            reader.onerror = reject;

            reader.readAsDataURL(new Blob([realPic]));
        });
    }
    function isValid(username, password1, password2, displayname) {
        if (checkEmpty(username, password1, password2, displayname)) {
            return false;
        }
        if (!checkAllValids()) {
            return false;
        }
        if (password1 !== password2) {
            setErrors({...errors, password2: {message: "Doesn't match first password input.", invalid: 1}});
            return false;
        }
        if(displayname.length>10) {
            setErrors({...errors, displayname: {message: "Display name length must be at most 10.", invalid:1}});
            return false;

        }
        return true;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const username = event.target.username.value;
        const password1 = event.target.password1.value;
        const password2 = event.target.password2.value;
        const displayname = event.target.displayname.value;
        if(!isValid(username,password1,password2,displayname))
            return;
        // saving data
        let pic_url = pic;
        if (pic_url === '')
            pic_url = defaultProfilePicture;
        else {
            pic_url = await getBase64();
            const prefixToRemove = "data:application/octet-stream;base64,";
            pic_url = pic_url.substring(prefixToRemove.length)
        }

        /**
         * TODO: Uncomment this when we have server
         */
        // let newUser = {
        //     username: username, password: password1, displayName: displayname, profilePic: pic_url
        // }
        // // post user to server
        // const res = await fetch('http://localhost:5000/api/Users', {
        //     'method': 'post',
        //     'headers' :{
        //         'Content-Type': 'application/json',
        //     },
        //     'body':JSON.stringify(newUser)
        //
        // })
        // // if(res.status===200) {
        // //     console.log('OK - post user');
        // // }
        // if(res.status!==200) {
        //     setErrors({...errors, username: {message: "Username already exists or picture too large.", invalid:1}});
        //     return;
        // }
        navigate('/login',{replace:true});

    }

    //{label,name,id,errors,type,placeholder, checker}

    return (
        <>
            <title>Sign up</title>
            <link href="../login_signup.css" rel="stylesheet"/>
            <div className="back-box"/>
            <div className="card login-box">
                <div className="card-body">
                    <Form className="" onSubmit={handleSubmit}>
                        <InputField label='Username' type='text' id='InputUsername2' placeholder='Enter username'
                                    name='username' checker={changeFromEmpty} errors={errors}/>
                        <InputField label='Password' type='password' id='InputPassword1' placeholder='Enter password'
                                    name='password1'  checker = {checkPassword} errors = {errors} addValid={true}/>
                        <InputField label='Verify password' type='password' id='InputPassword2' placeholder='Enter password again'
                                    name='password2' checker={changeFromEmpty} errors={errors} />
                        <InputField label='Display name' type='text' aria='DisplayNameHelp' placeholder='Enter display name'
                                    name='displayname' checker={changeFromEmpty} errors={errors}
                                    ariatext='This is the name you will appear by.' />
                        {/*no component here, because of the logic*/}
                        <Form.Group className="mb-3">
                            <Form.Label className="form-label">
                                Picture
                            </Form.Label>
                            <Form.Control className="form-control" type="file" id="formFile"
                                          onChange={showPic} name="image" accept="image/*"
                            />
                            {pic === '' &&
                                <div id="formFile" className="form-text text-muted">
                                    If no profile picture is provided a default picture will be used.
                                </div>}
                        </Form.Group>
                        <div className="img-cont">
                            <img
                                src={pic}
                                id="Profile-Picture"
                                alt="Profile Picture"
                            />
                        </div>
                        <br/>
                        {/*need to make it link to chat*/}
                        {/*<Button type="submit" className="btn btn-primary">*/}
                        {/*    Register*/}
                        {/*</Button>*/}
                        <Button type="submit" variant="primary">
                            Register
                        </Button>
                        <span className="sign-box">
          Already registered? <Link to="/login">Click here</Link> to
          login
        </span>
                    </Form>
                </div>
            </div>
        </>

    );
}

export default Signup;