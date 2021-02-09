
var express = require('express');
var mysql = require('mysql');
var moment = require('moment');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

var mysql = require('mysql'); 
const { request, response } = require('express');
const backend = process.env.PORT || 3000; 
/*
var pool = mysql.createPool({
    connectionLimit:3,
    host: "remotemysql.com",
    user: "KnV19OC0YF",
    password: "TaiKwEQOCL",
    port: "3306",
    database: "KnV19OC0YF"

})*/

//░░░░░░░░███░░░░░░░░
//░░░░░░░░███░░░░░░░░
//░░░░░░░░███░░░░░░░░
//░░░░░░░░███░░░░░░░░
//░░░░░░░░███░░░░░░░░
//░░░░░░░░███░░░░░░░░
//░░░░░░░░███░░░░░░░░
//░░░░░░░░███░░░░░░░░
//░░░░░░░░███░░░░░░░░
//░░░█████████████░░░
//░░░░███████████░░░░
//░░░░░█████████░░░░░
//░░░░░░███████░░░░░░
//░░░░░░░█████░░░░░░░
// ░░░░░░░███░░░░░░░░
/////////////Fill database tables and set admins if they dont exist
var createAdmins= require("./jsFiles/createAdmins")
var model = require("./Model/model")
model.insertTables()
createAdmins.createAdmins()
////////////




///////         \_(*.*)_/       why do we need this?
app.get('/', (req,res) => {
  res.send("Dobar dan!")
  console.log("Hello World u konzolu")
})

app.post('/api', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Thing created successfully!'
  });
});

app.get('/register', (req, res)=>{
  res.send("Nesto"); 
})

app.listen(backend, () => {  console.log('Server radi na:' + backend);});
///////

//app.post("/db/login", (req,res) =>{
 // login.login(req,res)})


 //works
var register = require("./jsFiles/register")
app.post('/register', (request, response, next)=> {
    register.register(request,response)
});

var loginAndroid = require("./jsFiles/loginAndroid")
app.post('/login', (request, response, next)=>{
  loginAndroid.androidLogin(request,response)
})

var DBconnection = require("./jsFiles/DBconnection")
app.get('/dohvat_filmova',(request, response, next)=>{
  console.log("Pokusaj dohvacanja filmova")
  //console.log(response)
  
  //response.json("OK???")
  //var sql = "SELECT naziv, slika, zanr, trajanje, ocjena, id, slika_pozadina FROM Film"; 
  var sql = "SELECT * FROM Film"; 
  DBconnection.getMovies(response,sql)
})

app.get('/film/filmDetalji/:id',(request, response, next)=>{
  console.log("Pokusaj dohvacanja filmova preko id-a")
  //let id = request.params.id; 
   
  //console.log(id); 
  var sql = `SELECT * FROM Film WHERE id = ?`; 
  DBconnection.getMovies(response,sql,request.params.id)
})

app.get('/film/kategorije/:zanr',(request, response, next)=>{
  console.log("Pokusaj dohvacanja filmova preko zanra")
  //let zanr = request.params.zanr; 
  //console.log(zanr); 
  
  var sql = "SELECT * FROM Film WHERE zanr = ?"; 
  DBconnection.getMovies(response,sql,request.params.zanr)
})

/*
app.post('/film/dodaj_zanr', (request, response, next)=> {
  
    let post_data = request.body; 
    let zanr = post_data.zanr; 

    var sql = 'INSERT INTO ZanrFilma(zanr) VALUES (?)';

        con.query(sql,[zanr], (err,res) =>{
            if(err){
               throw err;
             }
             response.send(true);
       })
    }
);

*/



app.post('/unos_filma', (request, response, next)=> {
  
  DBconnection.unosFilma(request,response)
})

var changeUser = require("./jsFiles/changeUser")
app.post('/user/update', (request, response, next)=>{
  let post_data = request.body; 

    changeUser.changeUser(post_data,response)
})

app.post('/user/update2', (request, response, next)=>{

  let post_data = request.body; 

  changeUser.changeUserNoPassword(post_data,response)
})

app.get('/user/podaci/:email', (request, response, next)=>{

  var sql = "SELECT * FROM User WHERE email = ?"; 
  DBconnection.userData(sql,request.params.email,response)
})




app.get('/user/podaci_id/:id', (request, response, next)=>{
  
  var sql = "SELECT * FROM User WHERE id = ?"; 
  DBconnection.userData(sql, request.params.id,response)
})

app.post('/mojIzbor/insert', (request, response, next) => {

  let post_data = request.body; 

  var sql = "INSERT INTO MojIzbor (datum_dodavanja, id_korisnik, id_film) VALUES (?, ?, ?)"; 
  DBconnection.dodajNoviIzbor(sql,post_data,response)
})

app.get('/mojIzbor/provjeraFilma/:id_korisnik/:id_film', (request, response, next)=>{

  let post_data = request.params

  var sql = "SELECT * FROM MojIzbor WHERE id_korisnik = ? AND id_film = ?"; 
  DBconnection.provjeraFilma(sql,post_data,response)
})

app.get('/mojIzbor/dohvatPoDatumu/:id_korisnik/:datum_dodavanja', (request, response, next)=>{

  var sql = "SELECT MojIzbor.id_korisnik, MojIzbor.datum_dodavanja, Film.naziv, Film.slika_pozadina, Film.id  FROM MojIzbor, Film WHERE MojIzbor.id_korisnik = ? AND MojIzbor.datum_dodavanja = ? AND MojIzbor.id_film = Film.id"; 
  DBconnection.dohvatPoDatumu(sql,request.params,response)
})

app.delete('/mojIzbor/deleteIzbor/:id_korisnik/:id_film', (request, response, next)=>{

  var sql = "DELETE FROM MojIzbor WHERE id_korisnik = ? AND id_film = ?"; 
  DBconnection.deleteIzbor(sql,request.params,response)
})

app.get('/mojIzbor/izborDohvat/:id_korisnik', (request, response,next) =>{

  var sql = "SELECT MojIzbor.id_korisnik, Film.naziv, Film.slika_pozadina, Film.id  FROM MojIzbor, Film WHERE MojIzbor.id_korisnik = ? AND MojIzbor.id_film = Film.id"; 
  DBconnection.izborDohvat(sql,request.params,response)
})


app.post('/Cijene/unosCijene', (request, response, next) =>{
  DBconnection.unosCijene(request,response)
  
})

app.post('/Karta/unosPonude', (request, response, next) =>{
  let post_data = request.body; 

  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'); 

})

app.post("/Raspored_filmova/dodaj", (request, response, next)=>{

  DBconnection.rasporedFilmova_dodaj(request,response)
  
})

app.get('/Raspored_filmova/dohvatFilma/:id_filma', (request, response,next) =>{

  DBconnection.dohvatFulmova_id(request,response)
  
})

app.get('/Cijene/dohvatCijena', (request, response, next)=>{

    DBconnection.dohvatiCijene(request,response)
    

})

app.get('/Raspored_filmova/dohvatDatum/:datum_prikazivanja', (request, response, next)=>{


  DBconnection.dohvatiDatum(request,response)
  
})

app.get('/Film/dohvatId/:naziv', (request, response, next)=>{


  DBconnection.dohvatiNaziv(request,response)
  
})

app.get('/Raspored_filmova/dohvatNaziv/:datum_prikazivanja/:id_filma', (request, response, next)=>{


  DBconnection.dohvatNaziva2(request,response)
  
})

app.get('/Raspored_filmova/dohvatiSve/:datum_prikazivanja/:id_filma/:vrijeme_prikazivanja', (request, response, next)=>{


  DBconnection.dohvatiSve(request,response)
  
})

app.post('/Karta/insert', (request, response, next) => {

  DBconnection.insertKarta(request,response)
  
})

app.post('/Raspored_filmova/update', (request, response, next)=>{

  DBconnection.rasporedFilmova_Update(request,response)
  
  
})

app.get('/Karta/dohvatiSve/:datum_prikazivanja/:id_filma/:vrijeme_prikazivanja/:id', (request, response, next)=>{

  DBconnection.kartaDohvatiSve(request,response)
  
})

app.get('/Karta/ponudaDatum/:datum_prikazivanja/:id_korisnik', (request, response, next)=>{

  DBconnection.kartaPonudaDatuma(request,response)
  
})

app.get('/Karta/sveRezervacije/:id_korisnik', (request, response, next)=>{

  DBconnection.kartaSveRezervacije(request,response)
  
})

app.get('/Karta/dohvatiRezervaciju/:id', (request, response, next)=>{

  DBconnection.kartaDohvatiRezervacije(request,response)
  
})

app.delete('/Karta/deleteRezervacija/:id', (request, response, next)=>{

  DBconnection.kartaDeleteRezervacija(request,response)

})


app.post('/Najcesca_pitanja/insert', (request, response, next) => {

  DBconnection.najcescaPitanjaInsert(request,response)
  
})

app.get('/Najcesca_pitanja/dohvatPitanja/', (request, response, next)=>{

  DBconnection.najcescaPitanjaDohvat(request,response)
  
})

app.post('/Upit/insert', (request, response, next)=> {
  
  DBconnection.upitInsert(request,response)
    
  }
);


app.get('/Film/dohvat_preporuka', (request, response, next) =>{
  DBconnection.filmDOhvatPreporuka(request,response)
  
})
 

///web part

var login = require("./jsFiles/login")
//var register = require("./register")


app.post("/db/login", (req,res) =>{
  console.log(req.body)
  login.login(req,res)})

app.get("/Rezervacije/Admin", (request, response, next) =>{
  DBconnection.kartaSveRezervacijeAdmin(request,response)
})

app.get("/Users",(request,response, next)=>{
  DBconnection.getAllUsers(request,response)
})

app.get("/Dates",(request,response, next)=>{
  DBconnection.getDates(request,response)
})

app.get("/VrijemeGledanja",(request,response,next) =>{
  DBconnection.getTime(request,response)
})

app.post("/FiltriraneRezervacije", (request,response)=>{
  
  DBconnection.getRezervacijeWhen(request,response)
})

app.get("/FilmoviNaziv", (request,response)=>{
  DBconnection.getFilmoviNaziv(request,response)
})

app.get("/Drzave", (request,response)=>{
  DBconnection.getDrzave(request,response)
})

app.get("/Godine", (request,response)=>{
  DBconnection.getGodine(request,response)
})

app.get("/Audio", (request,response)=>{
  DBconnection.getAudio(request,response)
})

app.post("/FiltriraniFIlmovi", (request,response)=>{
  DBconnection.filtriraniFilmovi(request,response)
})

app.post("/NoviFilmRaspored", (request,response) =>{
  DBconnection.noviFilmRaspored(request,response)
})

app.get("/SviRasporedi", (request,response) =>{
  DBconnection.sviRasporedi(request,response)
})