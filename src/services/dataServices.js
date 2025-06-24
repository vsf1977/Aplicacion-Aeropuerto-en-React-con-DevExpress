import { Component } from 'react';
const url = require('../env')

export default class DataService extends Component {

  getAll(ruta) {
    return new Promise((resolve, reject) => {
      fetch(url + ruta + '/Getall')
        .then(response => {
          if (response.ok) {
            return response.json();
          }
            throw new Error('Error fetching data');
        })
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  getAirports() {
    return new Promise((resolve, reject) => {
      fetch(url + 'Avion/GetAeropuertos')
        .then(response => {
          if (response.ok) {
            return response.json();
          }
            throw new Error('Error fetching data');
        })
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  async getLookups() {
    const [avion, ciudad, fabricante] = await Promise.all([
      fetch(`${url}avion/getall`),
      fetch(`${url}ciudad/getall`),
      fetch(`${url}fabricante/getall`)
    ]);
    const [avionList, ciudadList, fabricanteList] = await Promise.all([avion.json(), ciudad.json(), fabricante.json()]);
    let data = [];
    data.push(avionList);
    data.push(ciudadList);
    data.push(fabricanteList);
    return (data);
  }

  delete(route,id) {
    return fetch(url + route + '/delete?id=' + id, {
      method: 'DELETE',
    })
  }

  operation(route,item,operacion) {
    let method = operacion == "ingresar" ? "POST" : "PUT"
    let path = operacion == "ingresar" ? "/Insert" : "/Update"
    return fetch(url + route + path, {
      method: method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(item)
    })
  }

}