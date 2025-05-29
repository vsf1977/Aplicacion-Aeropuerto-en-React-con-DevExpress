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

  getLookups() {
    return Promise.all([
        fetch(`${url}avion/getall`),
        fetch(`${url}ciudad/getall`),
        fetch(`${url}fabricante/getall`)])
        .then(([avion, ciudad, fabricante]) => 
          Promise.all([avion.json(), ciudad.json(), fabricante.json()])
        )
        .then(([avionList, ciudadList, fabricanteList]) => {
          let data = []
          data.push(avionList)
          data.push(ciudadList)
          data.push(fabricanteList)
          return (data)
        });
  }

  delete(route,id) {
    return fetch(url + route + '/delete?id=' + id, {
      method: 'DELETE',
    })
  }

  update(route,item) {
    return fetch(url + route + '/update', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(item)
    })
  }

  create(route,item) {
    return fetch(url + route + '/Insert', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(item)
    })
  }

}