import jsonfields from "./app.js";
import "./styles.scss";

document.addEventListener("DOMContentLoaded", () => {
    // Agregar bootstrap al elemento al precionar una convinacion de teclas
    const Bootstrap = document.createElement("link");
    Bootstrap.rel = "stylesheet";
    Bootstrap.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    if (sessionStorage.bootstrap) document.head.appendChild(Bootstrap);
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.shiftKey && event.key === "!") {
            sessionStorage.bootstrap = true;
            window.location.reload();
        }
        if (event.ctrlKey && event.shiftKey && event.key === "@") {
            sessionStorage.removeItem("bootstrap");
            window.location.reload();
        }
    });

    // RUN Method
    (async function () {
        const Request = await fetch("https://pokeapi.co/api/v2/pokemon/1").then((resp) => resp.json());
        // const Request = await fetch("https://jsonplaceholder.typicode.com/todos").then((resp) => resp.json());

        const JsonFields = new jsonfields(
            {
                selector: "#app",
                bootstrapSupport: sessionStorage.hasOwnProperty("bootstrap"),
            },
            Request
        );

        getJSON.addEventListener("click", () => {
            console.log(JsonFields.getJSON());
        });
    })();
});
