import {Button, Container, Nav, Navbar} from "react-bootstrap";
import {name_picture} from "./Home";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalculator, faClockRotateLeft, faGlobe, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import './home.css'


const TopBar = ({strToDisplay,displayName,gotosolve,gotohistory,signOut,username,gotoglobalsolutions}) => {
    return (
        <div className="navbar-custom">
            <Container fluid >
                <Navbar variant="light" expand="lg" className="justify-content-between navbar-custom">
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
                    <Navbar.Brand className={"d-flex align-items-center"}>

                        <img
                            src={strToDisplay}// Replace with your profile picture URL
                            width="35"
                            height="35"
                            className="d-inline-block align-top rounded-circle mr-2"
                            alt="Profile Picture"
                        />
                        {/*<span style={{marginLeft: '10px'}}>*/}
                        {/*{displayName}*/}
                        {/*    </span>*/}
                        <div style={{display: 'flex', flexDirection: 'column', marginLeft: '10px'}}>
                            <span>{displayName}</span>
                            <small style={{color: 'gray' ,marginTop: '-10px'}}>@{username}</small>
                        </div>
                    </Navbar.Brand>
                    {/* Left Navigation Bar */}

                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        <Button variant="light" href="#" className="mr-2 custom-button"
                                    onClick={gotosolve}><FontAwesomeIcon icon={faCalculator}/> Solve</Button>
                            <Button variant="light" href="#" className="mr-2 custom-button"
                                    onClick={gotohistory}> <FontAwesomeIcon icon={faClockRotateLeft} /> History</Button>
                            <Button variant="light" href="#" className="mr-2 custom-button" onClick={gotoglobalsolutions}> <FontAwesomeIcon icon={faGlobe} /> Global Solutions</Button>
                        </Nav>
                        {/* Right Side */}
                    </Navbar.Collapse>
                    <Nav>
                        <Button variant="light" href="#" className="custom-button signout-button"
                                id="signout" onClick={signOut}> <FontAwesomeIcon icon={faRightFromBracket} /> Sign-out</Button>
                    </Nav>

                </Navbar>

                {/* Hello message */}

            </Container>
        </div>
    )
}
export default TopBar;