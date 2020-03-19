import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);



function App() {


// we pass object into an state
const [user, setUser] = useState({
  isSignedIn: false,
  name: '',
  email:'',
  photo:'',
  password:''
})



  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res =>{
      const {displayName, email, photoURL} = res.user;
      const signedInUser ={
      isSignedIn: true,
      name: displayName,
      email: email,
      photo: photoURL,
      
    }
      setUser(signedInUser);
      console.log(displayName, email, photoURL);
    }) 
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
      
  }


  //sign out button
  const handleSignOut = () =>{
    firebase.auth().signOut()
    .then(res =>{
      const signedOutUser ={
        isSignedIn: false,
        name: '',
        email: '',
        photo: "",
        password:'',
        error:'',
        isValid: false,
        existingUser: false
       
      } 
    setUser(signedOutUser);
  })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
     
  }
   
    //mail validation
    const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);

    const hasNumber = input => /\d/.test(input);

    const switchForm = e => {
      const createUser = {...user};
            createUser.existingUser = e.target.checked;
            setUser(createUser);
    
    }

    const handleChange = e =>{
      const newUserInfo = {
        ...user
      };
        //perform validation
      let isValid = true;  
      if(e.target.name === 'email'){
        isValid = (is_valid_email(e.target.value));
      }
      if(e.target.name === 'password'){
        isValid = e.target.value.length > 8 && hasNumber(e.target.value);
      }
  


      newUserInfo[e.target.name] = e.target.value;
      newUserInfo.isValid = isValid;
      setUser(newUserInfo);
    }


    const createAccount = (event) => {
        if(user.isValid){
          firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
          .then(res => {
            console.log(res);
            const createUser = {...user};
            createUser.isSignedIn = true;
            createUser.error = '';
            setUser(createUser);
          })
          .catch(err => {
            console.log(err);
            const createUser = {...user};
            createUser.isSignedIn = false;
            createUser.error = err.message;
            setUser(createUser);
          })
        } 
        event.preventDefault();
        event.target.reset();
    }
  
  const signInUser = event =>{
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createUser = {...user};
        createUser.isSignedIn = true;
        createUser.error = '';
        setUser(createUser);
      })
      .catch(err => {
        console.log(err);
        const createUser = {...user};
        createUser.isSignedIn = false;
        createUser.error = err.message;
        setUser(createUser);
      })
    }
   event.preventDefault();
   event.target.reset();
  }


  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
       <button onClick={handleSignIn}>Sign in</button>
      }

      {
        user.isSignedIn && 
       <div>
         <p>Welcome, {user.name}</p>
      <p>Your email: {user.email}</p>
      <img src={user.photo} alt=""/>
       </div> 
      }
       <h1>Our own authentication</h1>

       <input type="checkbox" name="switchForm" onChange={switchForm} id='switchForm'/>
       <label htmlFor="switchForm">Returning User</label>
       
       <form style={{display:user.existingUser ? 'block' : 'none'}} 
       onSubmit={signInUser}>
       
       <br/>
       <input type="text" onBlur={handleChange} name="email" id="" placeholder='your email' required/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" id="" placeholder='your password' required/>
        <br/>
        <input type="submit" value="signIn"/>
        </form>


       <form style={{display:user.existingUser ? 'none' : 'block'}}  
       onSubmit={createAccount}>
       <input type="text" onBlur={handleChange} name="name" id="" placeholder='your name' required/>
       <br/>
       <input type="text" onBlur={handleChange} name="email" id="" placeholder='your email' required/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" id="" placeholder='your password' required/>
        <br/>
        <input type="submit" value="create account"/>
        </form>
        {
          user.error && <p style={{color:'red'}}> {user.error} </p>
        }
    </div>
  );
}

export default App;
