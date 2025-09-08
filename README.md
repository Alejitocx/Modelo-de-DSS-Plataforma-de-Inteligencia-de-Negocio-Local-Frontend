# DSS - Plataforma de Inteligencia de Negocio Local (Frontend)

## 📖 Descripción

Este proyecto corresponde al **subsistema de Interfaz de Usuario (Frontend)** de la plataforma DSS (Decision Support System), encargado de proporcionar una experiencia visual interactiva, clara y accesible para dueños de negocios locales.

La aplicación ofrece un **panel de control dinámico** donde los usuarios pueden visualizar:

- 📊 Evolución de la puntuación promedio de calificaciones en el tiempo  
- 🗓️ Volumen de reseñas organizadas por mes  
- ⭐ Distribución de calificaciones (comparación entre altas y bajas)  
- 🔎 Insights y atributos clave del negocio (ej. "servicio rápido", "ambiente agradable")  

El frontend traduce los datos procesados por el backend en **gráficos, tablas y componentes interactivos**, facilitando la comprensión de la información y apoyando la toma de decisiones estratégicas.

---

## 🏗️ Cómo Funciona

El frontend está desarrollado en **React**, con una arquitectura modular y componentes reutilizables que permiten:

- Consumo de APIs RESTful expuestas por el backend (documentadas en Swagger/OpenAPI).  
- Representación de métricas mediante **visualizaciones gráficas interactivas**.  
- Navegación sencilla gracias a un sistema de rutas bien definido.  
- Manejo de estado global para sincronizar datos en tiempo real con el backend.  

La comunicación se realiza mediante **fetch/axios** hacia la API, integrando la lógica de negocio procesada por el backend y transformándola en elementos visuales amigables para el usuario.

---

## 🎯 Objetivos

- Construir una interfaz **intuitiva, atractiva y fácil de usar**.  
- Garantizar una experiencia fluida en cualquier dispositivo (**diseño responsive**).  
- Implementar principios de **usabilidad y ergonomía**.  
- Facilitar la **interacción con los datos** mediante componentes gráficos modernos.  
- Asegurar la **escalabilidad y mantenibilidad** del código.  

---

## ⚙️ Requerimientos Técnicos

- Conexión al **backend (API RESTful)** documentado con Swagger/OpenAPI.  
- Uso de **React Router** para la gestión de rutas y vistas.  
- Manejo de estado con **Context API** según complejidad de la aplicación.  
- Integración de librerías de visualización de datos (ej. **Recharts**).  
- Estilos implementados con **CSS Modules, TailwindCSS o Styled Components** para consistencia visual.  
- Configuración lista para **entornos de desarrollo y producción**.  

---

## 🚫 Exclusiones

- El frontend **no incluye lógica de negocio ni procesamiento avanzado de datos** (se delega al backend).  
- No contempla funcionalidades de autenticación o registro de usuarios (**fuera del alcance del MVP actual**).  

---

## 📌 Tecnologías y Herramientas

- **Framework principal:** React  
- **Gestión de estado:** Context API 
- **Visualización de datos:** Recharts
- **Estilos:** TailwindCSS / CSS Modules  
- **Ruteo:** React Router  
- **Comunicación con API:** Axios / Fetch  
- **Control de versiones:** Git + GitHub  

---

## 📈 Ejemplo de Caso de Uso

Un dueño de restaurante ingresa a la plataforma y, desde el panel, observa un gráfico donde se muestra la **tendencia de calificaciones en los últimos seis meses**. Gracias a la claridad visual, identifica que los meses con menos reseñas coinciden con temporadas de baja afluencia y puede planificar campañas promocionales para esos periodos.  

---

## 📝 Estado del Proyecto

📌 **Terminado (MVP)** – El frontend está en fase de integración con el backend, construyendo los componentes visuales del panel de control y validando la correcta representación de los datos en tiempo real.
