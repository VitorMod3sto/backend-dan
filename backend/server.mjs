import express from 'express';
import { uuid } from 'uuidv4';

import contatos from './data/contatos.mjs'

const app = express();

// middleware
app.use(express.json());

// GET: / (endpoint)
app.get("/", (req, res) => {
    res.send(`
        <h1 style='color: red;'>
            Olá Mundo!
        </h1>
        <p>
            Aula DevOps - Hand-On - Backend - Docker
        </p>
    `)
});

/**
 * GET: /contatos - obtém a lista de contatos
 * GET: /contatos/:id - obtém 1 contato (rota dinâmica)
 * POST: /contatos - Cria um novo contato
 * PUT: /contatos/:id - Edita um contato
 * DELETE: /contatos/:id - Deletar um contato
 */
// GET: /contatos - obtém a lista de contatos
app.get('/contatos', (req, res) => {
    /**
     * podemos utilizar req.query para filtrar,
     * por exemplo por gênero:
     * http://127.0.0.1:3000/contatos?genero=F
     * const { genero } = req.query;
     * res.status(200).json({
     *  error: false,
     *  contatos: contatos.filter(contato => contato.genero === genero)
     * })
     */ 
    res.status(200).json({
        error: false,
        contatos
    })
});

// GET: /contatos/:id - obtém 1 contato (rota dinâmica)
app.get('/contatos/:id', (req, res) => {
    const id = req.params.id;
    const contato = contatos.find((contato) => contato.id == id);

    if(!contato) 
        return res.status(404).json({
            error: true,
            message: "Contato não encontrado!"
        });

    res.status(200).json({
        error: false,
        contato
    });
});

// POST: /contatos - Cria um novo contato
app.post('/contatos', (req, res) => {
    // const contato = req.body;
    const { nome, genero, telefone, email } = req.body;

    // Todos os campos são obrigatórios
    if(!nome || !genero || !telefone || !email )
        return res.status(400).json({
            error: true,
            message: "Entrada inválida!"
        });
    
    if(contatos.find((contato) => contato.email === email))
        return res.status(400).json({
            error: true,
            message: "Email já cadastrado!"
        })
    
        id = (contatos.length == 0) 
            ? 1 // primeiro id 
            : contatos[contatos.length-1].id + 1; // id do último contato + 1
    const contato = { id: uuid(), nome, genero, telefone, email };
    res.status(201).json({
        error: false,
        contato
    });
})

// PUT: /contatos/:id - Edita um contato
app.put('/contatos/:id', (req, res) => {
    
    const id = req.params.id;
    const contato = contatos.find((contato) => contato.id == id);
    
    if(!contato) 
        return res.status(404).json({
        error: true,
        message: "Contato não encontrado!"
    });
    
    // const contato = req.body;
    const { nome, genero, telefone, email } = req.body;

    // Exceções primeiro:
    if(email) {
        if(contatos.find((contato) => contato.email === email))
            return res.status(400).json({
                error: true,
                message: "Email já cadastrado!"
            })
        contato.email = email;
    }
    if(nome) contato.nome = nome;
    if(genero) contato.genero = genero;
    if(telefone) contato.telefone = telefone;

    return res.status(200).json({
        error: false,
        message: "Contato atualizado com sucesso!"
    });
    
});


// DELETE: /contatos/:id - Deletar um contato
app.delete('/contatos/:id', (req, res) => {
    
    const id = req.params.id;
    const index = contatos.findIndex((contato) => contato.id == id);
    
    if(index == -1) 
        return res.status(404).json({
            error: true,
            message: "Contato não encontrado!"
        });
    
    contatos.splice(index, 1); // remove o contato encontrado
    return res.status(200).json({
        error: false,
        message: "Contato deletado com sucesso!"
    });
    
});

app.listen(3000, '127.0.0.1', ()=> {
    console.log("Servidor iniciado na porta 3000.");
});

// execute com o comando `node --watch server.mjs`
// --watch substitui o Nodemon.