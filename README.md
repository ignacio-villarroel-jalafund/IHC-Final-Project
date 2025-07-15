# Sistema de Monitoreo IoT en Tiempo Real

## Descripción General del Proyecto

El proyecto tiene como objetivo principal desarrollar un **Sistema de Monitoreo IoT en Tiempo Real** capaz de capturar, transmitir y visualizar datos de sensores de forma continua. Este sistema se diseñó para ser escalable y adaptable, permitiendo el monitoreo de diversas variables ambientales como temperatura, humedad, medición de distancia y sensores infrarrojos.


## Arquitectura del Sistema

La arquitectura del sistema se basa en tres componentes principales:

1.  **Dispositivo de Hardware (Arduino)**: Responsable de la recolección de datos mediante 4 sensores.
2.  **Servidor de Mensajería (Broker MQTT)**: Actúa como un intermediario ligero y eficiente para la comunicación entre el dispositivo de hardware y la capa de procesamiento.
3.  **Procesamiento y Visualización (Python y React)**: Un backend de Python procesa los datos recibidos del broker MQTT y los prepara para su visualización en una interfaz web con React y TypeScript, que presenta la información en tiempo real.

## Componentes del Sistema

### a) Hardware (Arduino)

  * **Arduino con Sensores**: Se encargan de leer los datos de los sensores (como DHT11 para temperatura y humedad, y un sensor ultrasónico para distancia) y enviarlos en formato JSON a través del puerto serie.
  * **ESP8266 con PubSubClient**: Se utiliza para conectar al broker MQTT y suscribirse a topics específicos, permitiendo la interacción con componentes físicos según los mensajes recibidos.

### b) Broker MQTT

  * **Mosquitto**: Actúa como un hub de mensajes, recibiendo datos de los publicadores (los dispositivos Arduino) y distribuyéndolos a los suscriptores (el backend de Python) a través de topics.

### c) Backend (Python con FastAPI)

  * **Recepción y Procesamiento de Datos**: Utiliza la biblioteca `paho-mqtt` para suscribirse a los topics del broker MQTT y recibir los datos de los sensores. Un servicio gestiona la conexión y la recepción de mensajes.
  * **API REST**: Expone los datos procesados a través de una API RESTful creada con **FastAPI**.
  * **Comunicación Serial**: Un servicio se encarga de leer los datos del puerto serie de los Arduinos, procesar los JSON recibidos y publicarlos en los topics MQTT correspondientes.

### d) Frontend (React y TypeScript)

  * **Visualización de Datos**: Construida con **React** y **TypeScript**, la interfaz de usuario consume los datos de la API REST del backend para mostrar la información en tiempo real.
  * **Gráficos Interactivos**: Utiliza la librería `Chart.js` para renderizar los datos en gráficos dinámicos y medidores, facilitando la interpretación de la información.
  * **Componentes**: La interfaz se divide en componentes reutilizables como el dashboard principal, gráficos de humedad y temperatura, un indicador de proximidad y un panel de estado de dispositivos.


## Instalación

### Prerrequisitos

  * **Broker MQTT**: Tener instalado y configurado un broker MQTT (se utilizó Mosquitto).
  * **Python**: Tener Python 3.x instalado.
  * **Node.js**: Tener Node.js y un gestor de paquetes (npm, pnpm, etc.) instalados.

### Pasos

1.  **Clonar el repositorio**:

    ```bash
    git clone https://github.com/ignacio-villarroel-jalafund/IHC-Final-Project.git
    cd IHC-Final-Project
    ```

2.  **Configurar y ejecutar el Backend**:

    ```bash
    cd backend
    pip install -r requirements.txt
    uvicorn src.main:app --reload
    ```

3.  **Configurar y ejecutar el Frontend**:

    ```bash
    cd frontend
    pnpm install
    pnpm dev
    ```

4.  **Abrir el Dashboard**:
    Abre tu navegador y ve a la dirección local que se indique al ejecutar el frontend para ver el dashboard en tiempo real.

## Características

  * **Monitoreo en Tiempo Real**: Visualización de datos de los sensores con baja latencia.
  * **Interfaz Intuitiva**: Dashboard claro y fácil de entender con gráficos y medidores.
  * **Arquitectura Modular**: El uso de MQTT desacopla los componentes, facilitando la adición de nuevos sensores y funcionalidades.
  * **Alertas Visuales**: Indicadores de estado que cambian de color según los umbrales de advertencia.


## Tech Utilizadas

  * **Hardware**: Arduino, ESP8266.
  * **Protocolo**: MQTT.
  * **Backend**: Python, FastAPI, Paho-MQTT, PySerial.
  * **Frontend**: React, TypeScript, Vite, Chart.js.


## Autores

  * Josue Prado
  * Ignacio Villaroel
  * Luis Espinoza
