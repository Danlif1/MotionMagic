import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import './home.css';
import {useNavigate} from "react-router-dom";
import TopBar from "./TopBar";
import React from "react"; // Import the CSS file


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
    function gotohistory(){
        navigate('/history',{replace:true});
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
            <TopBar strToDisplay={strToDisplay} displayName={name_picture.displayname} gotohistory={gotohistory}
                    gotosolve={gotosolve} signOut={signOut} username={name_picture.userName}/>
        <Container fluid>
                <Container className="text-center" style={{marginTop: '20px'}}>
                    <h1>Hello, {name_picture.displayname}</h1>
                </Container>
        </Container>
        </>

    );
}

export default Home;