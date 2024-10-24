// (starto com node --watch server.mjs)
import express from "express";
import contatos from "./data/contatos.mjs";
const app = express();

// Middleware
app.use(express.json());

// Listar contatos
app.get("/contatos", (req, res) => {
    res.status(200).json({
        error: false,
        contatos
    });
});

// Listar apenas um contato
app.get("/contatos/:id", (req, res) => {
    const id = req.params.id;
       const  genero = req.query.genero;

    const contato = contatos.find((contato) => contato.id == id);

    if (!contato) {
        return res.status(404).json({
            mensagem: "Contato não encontrado!"
        });
    }

    return res.json({
       contato,

    });
});

// Criar um contato
app.post("/contatos", (req, res) => {
    const contato = req.body;


    if (!contato || !contato.nome || !contato.genero || !contato.telefone || !contato.email) {
        return res.status(400).json({
            mensagem: "Dados inválidos!"
        });
    }

    contato.id = contatos[contatos.length - 1].id + 1;
    contatos.push(contato);

    res.status(201).json({
        mensagem: "Contato criado com sucesso!",
        contato: contato
    });
});

app.listen(3000, () => {
    console.log("Servidor iniciado na porta 3000!");
});