import { useEffect, useState } from 'react';
import DataService from '../../services/dataServices';
import 'devextreme/dist/css/dx.light.css';
import { DataGrid , Column , Lookup, Editing } from 'devextreme-react/data-grid';
import { capitalize } from '../../services/tools'

export default function Info({ ruta }) {
  
  const dataService = new DataService()

  let operacion = "";

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


  const onEditingStart = () =>{   
    operacion = "editar"
    console.log(operacion)
  }

  const onInitNewRow = () =>{   
    operacion = "ingresar"
    console.log(operacion)
    if (ruta=="ciudad"){ 
      setTimeout(() => {
        const input = document.getElementsByClassName('dx-texteditor-input-container').item(0).firstChild  
        input.setAttribute("autocomplete","on")
        input.setAttribute("list","cities")
        const datalist = document.createElement("datalist");
        datalist.setAttribute("id","cities")
        input.after(datalist)
        dataService.getAirports()
          .then(res => {
            let cities = []
            res.forEach(item => {
              cities.push(capitalize(item.city_name) + " / " + capitalize(item.name))
            })
            cities.sort()
            cities.forEach(city => {
              const option = document.createElement('option');
              option.value = city;
              datalist.appendChild(option);
            })
            input.blur()
        })
      }, 0);
    }
  }

  const onRowRemoved = (e) =>{
    dataService.delete(ruta,e.data.id).then(async response => {
      console.log(e.data.id)
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

  const operation = (e) =>{
    if (!isDataOk(e.data))
    {
      alert("Faltan campos");
      getData(ruta)
    }
    else{
      let mensaje = operacion == "ingresar" ? "Ingresado" : "Actualizado"
      dataService.operation(ruta,e.data,operacion).then(async response => {
        let res = await response.json();
        console.log(res)
        if(res != 1)
        {
          alert(`Ocurrio un error al ${operacion} el registro`);
          getData(ruta)
        }
        else
          alert(`Registro ${mensaje}`);   
      })
    }
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
            onRowInserted={(e) => operation(e)}
            onRowUpdated={(e) => operation(e)}
            onRowRemoved={(e) => onRowRemoved(e)}
            onInitNewRow={(e) => onInitNewRow(e)}
            onEditingStart={(e) => onEditingStart(e)}
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
                  <Column dataField="nombre" caption="Nombre" autocomplete="on"/>
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