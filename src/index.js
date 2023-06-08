import jsonfields from "./app.js";
import "./styles.scss";

async function pokemonAPI() {
    var Request = await fetch("https://pokeapi.co/api/v2/pokemon/1").then((resp) => resp.json());

    // console.log(Request);

    Request = {
        id: Request.id,
        name: Request.name,
        type: Request.types.map((type) => type.type.name).join(", "),
        mail_settings: {
            host: "titan.mail.com",
            port: 403,
            nested_settings: {
                pola: "dot saksaksd ",
                nested_settings_2: {
                    val: 123323432,
                },
            },
            email: "admin@eutiximo.com",
            other_settings: {
                set1: "Lorem ipsum",
                dior: "123012-091-023",
            },
        },
        none: "no se que poner",
    };

    const JSONFIELDSx = new jsonfields("#app", Request);

    getJSON.addEventListener("click", () => {
        JSONFIELDSx.submit();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded");

    // pokemonAPI();
    const aaa = new jsonfields("#app", {
        serbia: {
            canciones: {
                satellites: ["cama", "veronica", "satellite"],
                conciertos: ["CDMX", "Puebla", "Monterrey"],
            },
        },
    });

    getJSON.addEventListener("click", () => {
        console.log(aaa.submit());
    });
});
