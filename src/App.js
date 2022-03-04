
import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup } from "firebase/auth";
import { useState } from 'react';
import { signOut } from "firebase/auth";

 
initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSingIn : false,
    name : '',
    email : '',
    photo : '',
  
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

       
        console.log(user.photoURL);
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
      

    </div>
  );
}

export default App;
