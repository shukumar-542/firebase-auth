
import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup } from "firebase/auth";
import { useState } from 'react';
import { signOut } from "firebase/auth";
import {createUserWithEmailAndPassword } from "firebase/auth";
import {signInWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";

 
initializeApp(firebaseConfig);

function App() {

  const [newUser, setNewUser] =useState(false);
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
    // console.log(user.email, user.password);
    if(newUser && user.email && user.password){
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
    updateUserNane(user.name);

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
    if(!newUser && user.email && user.password){
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
    
      const user = userCredential.user;
      

      const newUserInfo = {...user}
      newUserInfo.error = ''
      newUserInfo.success = true
      setUser(newUserInfo);
    console.log(user);

      // console.log(userCredential.user);
    
    
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.code;
    newUserInfo.success = false
    setUser(newUserInfo);
  });
    
    }
    e.preventDefault();
   
  }

  const updateUserNane = (name) =>{
    const auth = getAuth();
    updateProfile(auth.currentUser, {
    displayName: name
    }).then(() => {
  // Profile updated!
  console.log('user name update succesfully');
  // ...
    }).catch((error) => {
      console.log(error);
  // An error occurred
  // ...
});
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
    
   
     <input type="checkbox" onChange={() =>{setNewUser( !newUser)}} name="newUser" id="" />
     <label htmlFor="newUser">New User Signup</label>
   <form onSubmit={handleSubmit}>
     {newUser && <input type="text" name="name" onBlur={handleOnBlur} placeholder='Enter your Name' required  />}<br/>
      <input type="text" onBlur={handleOnBlur} placeholder='Enter Your Email' name="email" required />
      <br/>
      <input type="password" onBlur={handleOnBlur} placeholder='Enter Your Password'  name="password" required />
      <br/>
      <input type="Submit" value={newUser ? 'singUp' : 'signin'} />
      {/* <input type="button" value="Submit" /> */}

     
   </form>
   <p style={{color : 'red'}}>{user.error}</p>
   {
     user.success && <p style={{color : 'green'}}>Your Account Is {newUser ? 'created' : 'logged successfully'}</p>
   }
   

   
      
      
    </div>
  );
}

export default App;
