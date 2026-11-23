// Elementos de la página
const contenedorNoticias = document.getElementById("noticias");
const mensaje = document.getElementById("mensaje");
const botonActualizar = document.getElementById("actualizar");

// Dirección de la API de noticias
const API = "https://hacker-news.firebaseio.com/v0/";

// Función para obtener las noticias
async function cargarNoticias() {
    mensaje.textContent = "Cargando noticias...";
    contenedorNoticias.innerHTML = "";
    botonActualizar.disabled = true;

    try {
        const respuesta = await fetch(API + "topstories.json");

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener las noticias.");
        }

        const identificadores = await respuesta.json();
        const seleccion = identificadores.slice(0, 9);

        const solicitudes = seleccion.map(async (id) => {
            const respuestaNoticia = await fetch(
                API + "item/" + id + ".json"
            );

            if (!respuestaNoticia.ok) {
                throw new Error("Error al consultar una noticia.");
            }

            return await respuestaNoticia.json();
        });

        const noticias = await Promise.all(solicitudes);
        mostrarNoticias(noticias);

    } catch (error) {
        mensaje.textContent =
            "No fue posible cargar las noticias. Intenta nuevamente.";
        console.error("Error:", error);

    } finally {
        botonActualizar.disabled = false;
    }
}

// Función para presentar las noticias
function mostrarNoticias(noticias) {
    contenedorNoticias.innerHTML = "";

    const noticiasValidas = noticias.filter(
        noticia => noticia && noticia.title && !noticia.deleted
    );

    if (noticiasValidas.length === 0) {
        mensaje.textContent = "No hay noticias disponibles.";
        return;
    }

    mensaje.textContent =
        "Se encontraron " + noticiasValidas.length + " noticias.";

    noticiasValidas.forEach(noticia => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";

        const titulo = document.createElement("h3");
        titulo.textContent = noticia.title;

        const autor = document.createElement("p");
        autor.textContent = "Autor: " + (noticia.by || "No disponible");

        const puntos = document.createElement("p");
        puntos.textContent = "Puntos: " + (noticia.score || 0);

        const enlace = document.createElement("a");
        enlace.href = noticia.url ||
            "https://news.ycombinator.com/item?id=" + noticia.id;
        enlace.textContent = "Leer noticia completa";
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";

        tarjeta.appendChild(titulo);
        tarjeta.appendChild(autor);
        tarjeta.appendChild(puntos);
        tarjeta.appendChild(enlace);

        contenedorNoticias.appendChild(tarjeta);
    });
}

// Botón para actualizar las noticias
botonActualizar.addEventListener("click", cargarNoticias);

// Cargar noticias al abrir la página
cargarNoticias();