import express from "express";
import bodyParser from 'body-parser';
import mongoose from "mongoose";
const app = express();
const PORT = 3000;

const usernameDB = encodeURIComponent("ABUnifor");
const passwordDB = encodeURIComponent("jrERMxLLV4jIMV2W");
const clusterDB = "cluster0.ghkxkmv.mongodb.net";

let mongoURI = `mongodb+srv://${usernameDB}:${passwordDB}@${clusterDB}/webUnifor`;

// ---- App express config ---- //
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('src/public'));
app.listen(PORT, () => {    
    console.log(`App listening on port ${PORT}`)
});

// --- Connect DB --- //
mongoose.connect(mongoURI);
var db = mongoose.connection;

db.on('error', () => console.log("Erro na conexão"));
db.once('open', () => console.log("DB conectado"))

// --- Rotas de Navegação --- ///
app.get('/', (req, res) => {
   return res.redirect("index.html")
});
app.get('/signin',(req,res) =>{
    return res.redirect("signin.html")
})
app.get('/login',(req,res) =>{
    return res.redirect("login.html")
})

// ------ Rota de Login ------ //
app.post('/login', (request, response) => {
    try {
        const username = request.body.username;
        const password = request.body.password;

        const user = db.collection('users').findOne({
            username: username
        }, (err, res) => {
            if (res == null) {
                console.log("Usuário não existe")
                return response.send("Usuário não existe")
            } else if (err) throw err;

            if (res.password == password) {
                console.log("Login feito com sucesso")
                const userId = res._id; // Get the user ID
                return response.redirect(`/dashboard.html?userId=${userId}&userName=${username}`); // Pass the user ID through the URL
            } else {
                console.log("Senha incorreta")
                return response.send("Senha incorreta")
            }
        })
        console.log(`${username} e ${password}`)
    } catch (error) {
        console.log(error);
        res.send("Informação Inválida ❌");
    }
});

// ----- Rota de Cadastro ----- //
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = {
        username: username,
        password: password
    }

    try {
        db.collection('users').insertOne(user)
        console.log(user.username+' cadastrado');
        return res.redirect("index.html")
        
    } catch (error) {
        
    }

})

// ----- Rota de Delete ----- //
app.delete('/user/:id', (req, res) => {
    const userId = req.params.id;

    try {
        db.collection('users').deleteOne({ _id: userId }, (err, result) => {
            if (err) throw err;

            console.log("Usuário deletado com sucesso");
            return res.send("Usuário deletado com sucesso");
        });
    } catch (error) {
        console.log(error);
        res.send("Erro ao deletar usuário");
    }
});

// ----- Rota de Update ----- //
app.put('/user/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;

    try {
        db.collection('users').updateOne({ _id: userId }, { $set: updatedUser }, (err, result) => {
            if (err) throw err;

            console.log("Usuário atualizado com sucesso");
            return res.send("Usuário atualizado com sucesso");
        });
    } catch (error) {
        console.log(error);
        res.send("Erro ao atualizar usuário");
    }
});





