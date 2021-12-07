import React from "react";
import {useState} from 'react';
import "./Login.css";

function LoginPage({ login, Error}) {

    // the details, which are sent to the front end for checking, are the name, email, and password
    const [details, setDetails] = useState({name: "", email: "", password: ""}); // name is just for the welcome page
    const submit = event => {
        event.preventDefault();
        login(details);
    }

    return (
        <form onSubmit={submit}>
            <div className="inner">
                <h2>Login</h2>
                {(Error !== "") ? (<div className="error">{Error}</div>) : ""}
                <div className="group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name" onChange={event => setDetails({...details, name: event.target.value})} value={details.name}/>
                </div>
                <div className="group">
                    <label htmlFor="email">Email:</label>
                    <input type="text" name="email" id="email" onChange={event => setDetails({...details, email: event.target.value})} value={details.email}/>
                </div>
                <div className="group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" onChange={event => setDetails({...details, password: event.target.value})} value={details.password}/>
                </div>
                <input type="submit" value="Login"/>
            </div>
        </form>
    )
}

export default LoginPage;