import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import './home.css';
import {useNavigate} from "react-router-dom"; // Import the CSS file


export var name_picture = {
    _displayname:"",
    _profilePicture:"",
    _userName:"",
    set displayname(value) {
        this._displayname = value;
    },
    get displayname() {
        return this._displayname;
    },
    set profilePicture(value) {
        this._profilePicture = value;
    },
    get profilePicture() {
        return this._profilePicture;
    },
    set userName(value) {
        this._userName = value;
    },
    get userName() {
        return this._userName;
    }
}


function Home({setLoggedIn}){
    const navigate = useNavigate();
    function signOut() {
        navigate('/',{replace:true});
    }
    function gotosolve(){
        navigate('/solve',{replace:true});
    }
    let strToDisplay
    if(name_picture.profilePicture==="https://images-na.ssl-images-amazon.com/images/I/51e6kpkyuIL._AC_SX466_.jpg"){
        console.log("in if with: " + name_picture.profilePicture);
        strToDisplay=name_picture.profilePicture
    } else if (name_picture.userName!=="") {
        console.log("in else with: " + name_picture.profilePicture);
        strToDisplay = `data:image/jpeg;charset=utf-8;base64,${name_picture.profilePicture}`
    }else{
        strToDisplay = "https://images-na.ssl-images-amazon.com/images/I/51e6kpkyuIL._AC_SX466_.jpg";
    }
    // if(name_picture.userName===""){
    //     nameToDisplay = "someUser"
    // }
    return (
        <>
        <div className="navbar-custom">
            <Container fluid>
                <Navbar  variant="light" expand="lg" className="justify-content-between navbar-custom">
                    <Navbar.Brand>
                        <img
                            src="/logo.png" // Replace with your logo URL
                            width="80"
                            height="70"
                            className="d-inline-block align-top mr-2 logo"
                            alt="Logo"
                        />
                    </Navbar.Brand>

                    {/* Profile Picture and Name*/}
                    <Navbar.Brand>
                    <img
                            src={strToDisplay}// Replace with your profile picture URL
                            width="30"
                            height="30"
                            className="d-inline-block align-top rounded-circle mr-2"
                            alt="Profile Picture"
                        />
                        <span style={{marginLeft:'10px'}}>
                        {name_picture.displayname}
                            </span>
                    </Navbar.Brand>
                    {/* Left Navigation Bar */}

                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Button variant="light" href="#" className="mr-2 custom-button" onClick ={gotosolve}>Solve</Button>
                            <Button variant="light" href="#" className="mr-2 custom-button">History</Button>
                            <Button variant="light" href="#" className="mr-2 custom-button">Global Solutions</Button>
                        </Nav>
                        {/* Right Side */}
                    </Navbar.Collapse>
                        <Nav>
                            <Button variant="light" href="#" className="custom-button signout-button"
                                    id="signout" onClick={signOut}>Sign-out</Button>
                        </Nav>

                </Navbar>

                {/* Hello message */}

            </Container>
        </div>
        <Container fluid>
                <Container className="text-center" style={{marginTop: '20px'}}>
                    <h1>Hello, {name_picture.displayname}</h1>
                </Container>
        </Container>
        </>

    );
}

export default Home;