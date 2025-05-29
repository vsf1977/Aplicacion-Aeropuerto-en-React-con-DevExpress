import { useEffect, useState } from 'react';
import DataService from '../../services/dataServices';
import 'devextreme/dist/css/dx.light.css';
import { DataGrid , Column , Lookup, Editing } from 'devextreme-react/data-grid';

export default function Info({ ruta }) {

  let metodo = ""
  
  const dataService = new DataService()

  const [data, setdata] = useState(null);

  const [fabricanteList, setFabricanteList] = useState(null);

  const [avionList, setAvionList] = useState(null);

  const [ciudadList, setCiudadList] = useState(null);

  const getData = (ruta) =>{
    dataService.getAll(ruta).then(res => {
      if (JSON.stringify(res) !== JSON.stringify(data)) {
        setdata(res);
      }        
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  useEffect(() => {
    if (ruta !== ""){
      dataService.getLookups().then(res => {
        if (JSON.stringify(res[0]) !== JSON.stringify(avionList)) {
          setAvionList(res[0]);
        } 
        if (JSON.stringify(res[1]) !== JSON.stringify(ciudadList)) {
          setCiudadList(res[1]);
        } 
        if (JSON.stringify(res[2]) !== JSON.stringify(fabricanteList)) {
          setFabricanteList(res[2]);
        }        
        getData(ruta)
      })
    }
  });

  const onRowInserted = (e) =>{
    if (!isDataOk(e.data))
    {
      alert("Faltan campos");
      getData(ruta)
    }
    else{
      dataService.create(ruta,e.data).then(async response => {
      let res = await response.json();
      console.log(res)
      if(res != 1)
      {
        alert("Ocurrio un error al ingresar el registro");
        getData(ruta)
      }
      else
        alert("Registro Insertado");   
      })
    }
  }

  const onRowUpdated = (e) =>{
    if (!isDataOk(e.data))
    {
      alert("Faltan campos");
      getData(ruta)
    }
    else{
      dataService.update(ruta,e.data).then(async response => {
      let res = await response.json();
      console.log(res)
      if(res != 1)
      {
        alert("Ocurrio un error al actulizar el registro");
        getData(ruta)
      }
      else
        alert("Registro Actualizado");   
      })
    }
  }

  const onRowRemoved = (e) =>{
    dataService.delete(ruta,e.data.id).then(async response => {
      let res = await response.json();
      if(res != 1)
      {
        alert("Ocurrio un error al borrar el registro");
        getData(ruta)
      }
      else
        alert("Registro borrado");   
    })
  }

  const isDataOk = (data) => {
    switch(ruta)
    {
      case "vuelo" :
        if (data.id_ciudad_salida ===undefined || data.id_ciudad_llegada ===undefined || data.id_avion ===undefined)
          return false
        else
          return true

      case "avion" :
        if (data.matricula ===undefined || data.id_fabricante ===undefined)
          return false
        else
          return true

      case "ciudad" :
        if (data.nombre ===undefined)
          return false
        else
          return true

      case "fabricante" :
        if (data.nombre ===undefined)
          return false
        else
          return true
    
    }
  }  
  
  return (    
    <div className="datagrid">
      {ruta !== ''?
        <div>
          <DataGrid
            dataSource={data}
            showBorders={true}
            onRowInserted={(e) => onRowInserted(e)}
            onRowUpdated={(e) => onRowUpdated(e)}
            onRowRemoved={(e) => onRowRemoved(e)}
            >        
            {ruta === 'avion'?
                <div>
                  <Column dataField="matricula" caption="Matricula"/>
                  <Column dataField="id_fabricante" caption="Fabricante">
                    <Lookup dataSource={fabricanteList} valueExpr="id" displayExpr="nombre"/>
                  </Column>
                </div>:
              ruta === 'ciudad'?
                <div>
                  <Column dataField="nombre" caption="Nombre"/>
                </div>:
              ruta === 'fabricante'?
                <div>
                  <Column dataField="nombre" caption="Nombre"/>
                </div>:
              ruta === 'vuelo'?
                <div>
                  <Column dataField="id_ciudad_salida" caption="Ciudad Salida">
                    <Lookup dataSource={ciudadList} valueExpr="id" displayExpr="nombre"/>
                  </Column>
                  <Column dataField="id_ciudad_llegada" caption="Ciudad Llegada">
                    <Lookup dataSource={ciudadList} valueExpr="id" displayExpr="nombre"/>
                  </Column>
                  <Column dataField="id_avion" caption="Matricula Avion">
                    <Lookup dataSource={avionList} valueExpr="id" displayExpr="matricula"/>
                  </Column>
                </div>:
              <div></div>
            }
            <Editing
                mode="form"
                allowUpdating={true}
                allowDeleting={true}
                allowAdding={true}
                useIcons={true}
            />
          </DataGrid>
        </div>:
        <div></div>
      }
    </div>
  );  
}