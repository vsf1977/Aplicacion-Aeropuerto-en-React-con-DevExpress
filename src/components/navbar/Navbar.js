import Info from '../info/Info'
import { useState } from 'react';
import { capitalize } from '../../services/tools'

export default function Navbar() {

  const rutas =["avion","fabricante","ciudad","vuelo"]

  const [ruta, setruta] = useState("");  

  const routing = (e) => {
    const menu = document.getElementById("menu").childNodes; 
    const ruta = e.target.id;
    setruta(ruta);    
    menu.forEach(item => {
      item.classList.remove("actual")
      item.classList.add("normal")
      if (item.firstChild.id === ruta)        
      {
        item.classList.add('actual')          
        item.classList.remove("normal")
      }      
    });
  }

  return (
    <>
      <div className="nav_bar">
        <ul id="menu">
          {rutas.map((item, index) => (<li><a className='normal' key={index} id={item} onClick={(event) => routing(event)}>{capitalize(item)}</a></li>))}
        </ul>
        <i className="fa-solid fa-plus"></i>
      </div>
      <div>
        <Info ruta={ruta}/>
      </div>
    </>
  );
}