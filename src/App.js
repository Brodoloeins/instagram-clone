import './App.css';
import './firebase.js'
import {useEffect, useState} from 'react';
import Header from './Header'
import { auth, db } from './firebase.js';
import Post from './Post'

function App() {

  const [ user, setUser] = useState()

  const [posts, setPosts] = useState([])

  useEffect(()=>{
    auth.onAuthStateChanged((val)=>{
      if(val != null){
        setUser(val.displayName)
      }
    })

    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot)=>{
      setPosts(snapshot.docs.map((document)=>{
        return {id: document.id, info: document.data()}
      }))
    })
  }, [])

  return (
    <div className="App">
      <Header user={user} setUser={setUser}></Header>

      {
        posts.map((val)=>{
          return (

            <Post user={user} info={val.info} id={val.id} />

          )
        })
      }
    </div>
  );
}

export default App;