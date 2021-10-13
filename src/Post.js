import {useEffect, useState} from 'react';
import { db } from './firebase.js';
import firebase from 'firebase';

export default function Post(props){
  
  const [comentarios, setComentarios] = useState([])

  useEffect(() => {
    db.collection('posts').doc(props.id).collection('comentarios').orderBy('timestamp', 'desc').onSnapshot((snapshot)=>{
      setComentarios(snapshot.docs.map((document)=>{
        return ({id: document.id, info: document.data(), })
      }))
    })
  }, [])

  function comentar(id, e){
    e.preventDefault();
    let comentarioAtual = document.getElementById('comentario-'+id).value;
    db.collection('posts').doc(id).collection('comentarios').add({
      nome: props.user,
      comentario: comentarioAtual,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    alert("Comentário feito com sucesso ")
    document.getElementById('comentario-'+id).value = "";
  }

  return(
    <div className="postSingle">
      <img src={props.info.image} />
      <p><b>{props.info.userName}</b>: {props.info.titulo}</p>

      <div className="comments">

        <h3>Comentários:</h3>

        {
          comentarios.map(function(val){
            return (
              <div className="coment-single">
                <p><b>{val.info.nome}</b>: {val.info.comentario}</p>
              </div>
            )
          })
        }

      </div>
              
      <br />
      
      {
        (props.user)?
        <form onSubmit={(e)=>comentar(props.id,e)}>
          <textarea id={"comentario-"+ props.id} placeholder="Digite o seu comentário..."></textarea>
          <input type="submit" value="Comentar" />
       </form>
       :
       <div></div>
      }
    </div>
  )
}