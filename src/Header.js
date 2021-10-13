import {useEffect, useState} from 'react';
import firebase from 'firebase';
import {auth, storage, db} from './firebase.js'

export default function Header(props){
  
  //Global consts
  const [progress, setProgress] = useState(0)

  const [file, setFile] = useState(null)

  //Use Effect
  useEffect(() => {
  }, [])

  //Create Account
  function criarConta(e){
    e.preventDefault();
    let email = document.getElementById('email').value
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value

    //Create Account on the Firebase
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      authUser.user.updateProfile({
        displayName: username
      })
      alert("Conta Criada Com Sucesso "+ username)
      let modal = document.querySelector('.modalCriarConta');

      modal.style.display = 'none';
    }).catch((error) => {
      alert(error.message)
    })
  } 

  //Login
  function logar(e){
    e.preventDefault()
    let email = document.getElementById('email-login').value
    let password = document.getElementById('password-login').value

    auth.signInWithEmailAndPassword(email, password)
    .then((auth) => {
      props.setUser(auth.user.displayName)
      alert('Logado com sucesso')
      window.location.href = "/";
    }).catch((err) => {
      alert(err.message)
    })
  }

  //Opening and Close Modals

  function abrirModalCriarConta(e){
    e.preventDefault();
    let modal = document.querySelector('.modalCriarConta');

    modal.style.display = 'block';
  }

  function fecharModalCriar(e){
    e.preventDefault();
    let modal = document.querySelector('.modalCriarConta');

    modal.style.display = 'none';
  }

  //Upload

  function abrirModalUpload(e){
    e.preventDefault();
    let modal = document.querySelector('.modalUpload');

    modal.style.display = 'block';
  }

  function fecharModalUpload(e){
    e.preventDefault();
    let modal = document.querySelector('.modalUpload');

    modal.style.display = 'none';
  }

  //Create Posts
  function uploadPost(e){
    e.preventDefault();

    let tituloPost = document.getElementById('titulo-upload').value

    //Put a reference on my DB document
    const uploadTask = storage.ref(`images/${file.name}`).put(file);

    //if change any state
    uploadTask.on("state_changed", (snapshot) => {
      //Changing the progress bar
      const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes) * 100;
      setProgress(progress)
    }, (err) => {
      //Errors Function
    }, () => {
      //Saving the post on my DB and putting the file reference
      storage.ref(`images`).child(file.name).getDownloadURL()
      .then((url) => {
        db.collection('posts').add({
          titulo: tituloPost,
          image: url,
          userName: props.user,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        //Show on the Screen an alert
        alert('Post Realizado com sucesso!')
        
        //Resetting the cache and the form
        setProgress(0)
        setFile(null)
        document.getElementById('formUpload').reset()
        fecharModalUpload(e);
      })
    })
  }

  function deslogar(e){
    e.preventDefault();
    auth.signOut().then((val)=>{
      props.setUser(null)
      alert("Deslogado Com Sucesso")
      window.location.href = "/";
    });
  }

  //HTML Code
  return(
      <div className="Header">

        <div className="modalCriarConta">
          <div className="formCriarConta">
            <div onClick={(e)=>fecharModalCriar(e)} className="closeModalCriar">
              X
            </div>
            <h2>Criar Conta</h2>
            <form onSubmit={(e)=>criarConta(e)}>
              <input id="email" type="text" placeholder="Seu email..." />
              <input id="username" type="text" placeholder="Seu Username..." />
              <input id="password" type="password" placeholder="Sua Senha..." />
              <input type="submit" value="Criar Conta" />
            </form>
          </div>
        </div>

        <div className="modalUpload">
          <div className="formUpload">
            <div onClick={(e)=>fecharModalUpload(e)} className="closeModalUpload">
              X
            </div>
            <h2>Fazer Upload</h2>
            <form id="formUpload" onSubmit={(e)=>uploadPost(e)}>
              <progress id="uploadProgress" value={progress}></progress>
              <input id="titulo-upload" type="text" placeholder="Nome da sua foto..." />
              <input onChange={(e) => setFile(e.target.files[0])} type="file" name="file" />
              <input type="submit" value="Criar Post" />
            </form>
          </div>
        </div>

        <div className="center">
        <div className="Header__logo">
          <a href=""><img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" /></a>
        </div>
          {
            (props.user)?
            <div className="header__logadoInfo">
              <span>Olá <b>{props.user}</b></span>
              <a onClick={(e) => abrirModalUpload(e)} href="#">Postar!</a>
              <a onClick={(e) => deslogar(e)}>Deslogar!</a>
            </div>
            :
            
          <div className="Header__loginForm">
            <form onSubmit={(e)=>logar(e)}>
              <input id="email-login" type="text" placeholder="Email..." />
              <input id="password-login" type="password" placeholder="Password..." />
              <input type="submit" name="acao" value="Logar!" />
            </form>
            <div className="btn__criarConta">
              <a onClick={(e)=>abrirModalCriarConta(e)} href="#">Criar Conta</a>
            </div>
          </div>
          }
        </div>
      </div>
  );
}