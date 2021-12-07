import './App.css';
import {useState, useEffect} from "react";
import Axios from 'axios';
import LoginPage from './components/LoginPage';

function App() {
  
  const adminLogin = { email: "root@gmail.com", password: "rootPassword" } // store the admin login 

  /* useState allows us to initialize variables as well as update their values without using classes*/
  const[admin, setAdmin] = useState({name: "", email: ""});
  const[adminEmail, setAdminEmail] = useState('');
  const[adminPassword, setAdminPassword] = useState('');
  const[errMessage, setErrMessage] = useState('');
  const[website, setWebsite] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[passwordList, setPasswordList] = useState([]);

  /** login checks if the inputted email and password are correct and logs in if yes, otherwise error */
  const login = details => {
    //check if login is correct
    if(details.email === adminLogin.email && details.password === adminLogin.password){ 
      setAdmin({
        name: details.name,
        email: details.email
      });
      setAdminEmail(details.email); // if yes, set adminEmail to the inputted email
      setAdminPassword(details.password); // if yes, set adminPassword to the inputted password
    } else {
      setErrMessage("Wrong username or password"); // otherwise, wrong combo
    }
  }
  
  /**  useEffect ensures the each block of the rows from the db are shown with every rendering */
  useEffect(() => {
    Axios.get("http://localhost:3001/app/homepage").then((response) => {
      setPasswordList(response.data) // shows the list of password objects which is an array
    });
  }, []); 

  
  /** submitPassword calls the server to do an INSERT db query, given website, email, and password*/
  const submitPassword = () => {
    Axios.post("http://localhost:3001/app/add", {website: website, email: email, password: password});
 
    setPasswordList([...passwordList, {website: website, email: email, password: password}, // here, the new values are added to the existing list
    ]);
  };

  /** deletePassword calls the server to do a DELETE db query given the id */
  const deletePassword = (id) => {
    if(adminEmail === adminLogin.email && adminPassword === adminLogin.password) { // user can only delete if they are logged in
    Axios.delete(`http://localhost:3001/app/delete/${id}`)
      setPasswordList(
        passwordList.filter((val) => {
          return val.id !== id; // the passwordList is set to be all values except the one with the delete id
        })
      )
  }
  };

  /** decryptPassword calls the server by sending it the password and iv that is needed to be encrypted */
  const decryptPassword = (encryption) => {
    if(adminEmail === adminLogin.email && adminPassword === adminLogin.password) { // user can only decrypt if they are logged in
    Axios.post("http://localhost:3001/app/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((val) => { 
          return val.id === encryption.id // if the password id matches the any of the existing ids, then that id's password will be decrypted
            ? {
                id: val.id, // id remains same
                website: val.website, // website remains same
                email: val.email, // email remains same
                password: response.data, // password becomes the decrypted password
                iv: val.iv, // iv remains the same
              }
            : val;
        })
      );
    });
  }
  };

  return (
    <div className="App">
      <h1>CyberSafe</h1>
   
      {(admin.email !== "") ? (
        <div className="welcome_page"> 
          Welcome to your password manager, {admin.name} 
        </div>
      ) : (
        <LoginPage login = {login} Error={errMessage}/>
      )}
      <h4>Enter the website, email, and password you would like to add:
      </h4>
      <div className = "AddPassword">
      <input type="text" name="website" placeholder="Website" onChange={(event) => {
        setWebsite(event.target.value)}}/>
      <input type="text" name="email" placeholder="email@email.com" onChange={(event) => {
        setEmail(event.target.value)}}/>
      <input type="password" name="password" placeholder="password" onChange={(event) => {
        setPassword(event.target.value)}}/>
      </div>

      <div className="addbutton" onClick={submitPassword}>Add Password</div>

      {passwordList.map((val) => {
        //this function displays all the db attributes (website, email, password); however only the password's hashed value is shown
        return <div className="passwords">
          
          <h3>{val.website}</h3>  
          <h4>{val.email} </h4>
          <h4>{val.password}</h4>

          <div className="deletebutton" onClick={
            //when the "delete password" button is clicked, the deletePassword function is called and removes the pw from the site and the db
            ()=> {deletePassword(val.id)}}>Delete Password</div>

          <div className="showpassword" onClick ={
            //when the "show password" button is clicked, the decryptPassword function is called and reveals the password on the front end
            () => {decryptPassword({password: val.password, iv: val.iv, id: val.id})}}>Show Password</div>         
          </div>
      })}


    </div>
  );
}

export default App;