import React, {useState, useEffect} from 'react';
import Header from './components/Header';
import Formulario from './components/Formulario';
import Error from './components/Error';
import Clima from './components/Clima';

function App() {

  //State principal
  const [ciudad, guardarCiudad] = useState('');
  const [pais, guardarPais] = useState('');
  const [error, guardarError] = useState(false);
  const [resultado, guardarResultado] = useState({}); //como resultado es un objecto lo iniciamos como objeto vacio

  /*Con los hooks ya no se utilizan los metodos del ciclo de vida. 
  UseEfect reemplaza a estos metodos
  En el parametro que espeficicamos entre los corchetes ([ciudad, pais]) significa que 
  parte del state tiene que estar escuchando para ejecutarse (En esta caso si ciudad y pais cambian
  el metodo se ejecuta). O sea si cambia el valor de ciudad, pais se ejecuta el metodo useEffect*/
  
  useEffect( () =>{

    //Prevenir si ciudad esta vacio no llamar a la API
    if(ciudad === '') return;

    const consultarAPI = async () => {
      const appId = 'f0bd0fb5ece4f69d79574475e2758e6d';
  
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
  
      //consultamos la url
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      guardarResultado(resultado);
    }

    consultarAPI();
  }, [ciudad, pais]);
  
  

  const datosConsulta = datos => {
    //Validad que ambos campos esten
    if(datos.ciudad === '' || datos.pais === ''){
      //un error
      guardarError(true);
      return;
    }

    guardarCiudad(datos.ciudad);
    guardarPais(datos.pais);
    guardarError(false);
  }

  let componente;
  if(error){
    componente = <Error mensaje='Ambos campos son obligatorios'/>
  } else if(resultado.cod === "404"){
    componente = <Error mensaje='La ciudad no existe en nuestros registros'/>
  } else{
    componente = <Clima
                    resultado = {resultado}  
                />;
  }

  return (
    <div className="App">
      <Header
        titulo='Clima React App'
      />    

      <div className="contenedor-form">
        <div className="container">
          <div className="row">
            <div className="col s12 m6">
               <Formulario
                  datosConsulta = {datosConsulta} //enviamos la funcion para que sea llamada desde el formulario
               /> 
            </div>

            <div className="col s12 m6">
              {componente}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
