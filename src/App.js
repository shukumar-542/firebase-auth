
import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup } from "firebase/auth";
import { useState } from 'react';
import { signOut } from "firebase/auth";
import {createUserWithEmailAndPassword } from "firebase/auth";

 
initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSingIn : false,
    name : '',
    email : '',
    password : '',
    photo : '',
    error : '',
    success : false
  
  });

  

 
  

  const provider = new GoogleAuthProvider();
  const handleSignIn =()=>{
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const singInUser = {
          isSingIn : true,
          name : user.displayName,
          email : user.email,
          photo : user.photoURL
        }
        setUser(singInUser);

       
        // console.log(user.photoURL);
        // ...
      })
      .catch(err =>{console.log(err);})
  }

  const handleSingOut= () =>{
    const auth = getAuth();
    signOut(auth).then(() => {
    // Sign-out successful.
     const isSignOutUser = {
       isSingIn : false,
       name :'',
       email : '',
     }
     setUser(isSignOutUser)
    })
    .catch(err =>{console.log(err);});
  }

  const handleOnBlur =(event) =>{
   let isFormValid = true;
   
   if( event.target.name === 'email'){
    isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
    // console.log(isEmailValid);
   }
   if(event.target.name === 'password'){
    const isValidPassword = event.target.value.length > 6 ; 
     const passwordHasNumber =/^.*[0-9]+.*$/.test(event.target.value);
     
     isFormValid = isValidPassword && passwordHasNumber;
   }
   if(isFormValid){
     const newUser = {...user}
     newUser[event.target.name] = event.target.value;
     setUser(newUser)
   }
  }

  const handleSubmit =(e)=>{
    console.log(user.email, user.password);
    if(user.email && user.password){
      const auth = getAuth();
  createUserWithEmailAndPassword(auth, user.email, user.password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
    const newUserInfo = {...user}
    newUserInfo.error = ''
    newUserInfo.success = true
    setUser(newUserInfo);
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.code;
    newUserInfo.success = false
    setUser(newUserInfo);
    // const errorMessage = error.message;
    // const errorCode = error.code;
    // console.log(errorMessage, errorCode);
    // ..
  });

    }
    e.preventDefault();
   
  }

  return (
    <div className="App">
      {user.isSingIn ? <button onClick={handleSingOut}>Sign out</button>:
      <button onClick={handleSignIn}>Sign in</button>
      }
      {
        user.isSingIn && 
        <div>
          <p> Welcome ,{user.name}</p>
          <p>Email : {user.email}</p>
          <img src={user.photo} alt=''></img>
        </div>
      }
      <h1>Authentication</h1>
    
   
     
   <form onSubmit={handleSubmit}>
      {/* <input type="text" name="name" onBlur={handleOnBlur} placeholder='Enter your Name' required  /><br/> */}
      <input type="text" onBlur={handleOnBlur} placeholder='Enter Your Email' name="email" required />
      <br/>
      <input type="password" onBlur={handleOnBlur} placeholder='Enter Your Password'  name="password" required />
      <br/>
      <input type="Submit" />
      {/* <input type="button" value="Submit" /> */}

     
   </form>
   <p style={{color : 'red'}}>{user.error}</p>
   {
     user.success && <p style={{color : 'green'}}>Your Account Is Created</p>
   }
   

   
      
      
    </div>
  );
}

export default App;
