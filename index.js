
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

var con = mysql.createConnection({
    host: "remotemysql.com",
    user: "KnV19OC0YF",
    password: "TaiKwEQOCL",
    port: "3306",
    database: "KnV19OC0YF"

})

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
  res.send("Hello World!")
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
  
  console.log(request.body)
  response.json("ok       string za ubacivanje INSERT INTO Film(naziv,strani_naziv,redatelji,glumci,drzava,audio,titlovi,trajanje,opis,slika,slika_pozadina, zanr, ocjena) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")


/*
  var sql = 'INSERT INTO Film(naziv,strani_naziv,redatelji,glumci,drzava,audio,titlovi,trajanje,opis,slika,slika_pozadina, zanr, ocjena) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

      con.query(sql,[naziv,strani_naziv,redatelji,glumci,drzava,audio,titlovi,trajanje,opis,slika,slika_pozadina, zanr, ocjena], (err,res) =>{
          if(err){
             throw err;
           }
           response.send(true);
     })
  }
  */
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
  let post_data = request.body; 
  
  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  let naziv = post_data.naziv; 
  let cijene_djeca = post_data.cijene_djeca;
  let cijene_odrasli = post_data.cijene_odrasli; 
  let cijene_studenti = post_data.cijene_studenti;  

  var sql = "INSERT INTO Cijene (datum_unosa, naziv, cijene_djeca, cijene_odrasli, cijene_studenti) VALUES (?,?,?, ?, ?)"; 
  con.query(sql, [datum_unosa, naziv, cijene_djeca, cijene_odrasli, cijene_studenti], (err, res)=>{
    if(err) throw err; 
    
    console.log("uneseno");
  
  })
})

app.post('/Karta/unosPonude', (request, response, next) =>{
  let post_data = request.body; 

  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'); 

})

app.post("/Raspored_filmova/dodaj", (request, response, next)=>{

  let post_data = request.body; 
  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD'); 
  var datum_prikazivanja = post_data.datum_prikazivanja; 
  var vrijeme_prikazivanja = post_data.vrijeme_prikazivanja;  
  var id_filma = post_data.id_filma; 
  var max_ulaznica = post_data.max_ulaznica; 
  var trenutno_ulaznica = post_data.trenutno_ulaznica; 
  var dvorana = post_data.dvorana; 

  var sql = "INSERT INTO Raspored_filmova (id_filma, datum_unosa, datum_prikazivanja, vrijeme_prikazivanja, max_ulaznica, trenutno_ulaznica, dvorana) VALUES (?,?,?,?,?,?,?)"; 
  con.query(sql, [id_filma, datum_unosa, datum_prikazivanja, vrijeme_prikazivanja,max_ulaznica, trenutno_ulaznica, dvorana], (err,res)=>{
    if(err) throw err; 
    console.log("Uneseno");
    response.send("uneseno");
  })
})

app.get('/Raspored_filmova/dohvatFilma/:id_filma', (request, response,next) =>{

  let id_filma = request.params.id_filma;
  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD');

  var sql = "SELECT Raspored_filmova.datum_prikazivanja, Raspored_filmova.vrijeme_prikazivanja  FROM Raspored_filmova, Film WHERE Raspored_filmova.id_filma = ? AND Raspored_filmova.id_filma = Film.id AND Raspored_filmova.datum_prikazivanja >= ?"; 
  con.query(sql, [id_filma,datum_unosa], (err,res)=>{
    if(err) throw err; 

    console.log("Prikazani su svi izbori!"); 
    response.json(res);
  })
})

app.get('/Cijene/dohvatCijena', (request, response, next)=>{

    var sql = "SELECT * FROM Cijene WHERE datum_unosa = (SELECT MAX(datum_unosa) FROM Cijene)"; 
    con.query(sql, (err, res)=>{
      if(err) throw err; 

      response.json(res);
    })

})

app.get('/Raspored_filmova/dohvatDatum/:datum_prikazivanja', (request, response, next)=>{


  let datum_prikazivanja = request.params.datum_prikazivanja; 
  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD');

  var sql = "SELECT Film.naziv, Raspored_filmova.vrijeme_prikazivanja FROM Raspored_filmova, Film WHERE Raspored_filmova.datum_prikazivanja = ? AND Raspored_filmova.id_filma = Film.id AND Raspored_filmova.datum_prikazivanja >= ?"; 
  con.query(sql, [datum_prikazivanja, datum_unosa], (err,res)=>{
    if(err) throw err; 

    if(res.length > 0){
      response.json(res); 
    }else{
      console.log("null");
      response.json(null);
    }
  })
})

app.get('/Film/dohvatId/:naziv', (request, response, next)=>{


  let naziv = request.params.naziv; 

  var sql = "SELECT id FROM Film WHERE naziv = ?"; 
  con.query(sql, [naziv], (err,res)=>{
    if(err) throw err; 

    if(res.length > 0){
      response.json(res); 
    }else{
      console.log("null");
      response.json(null);
    }
  })
})

app.get('/Raspored_filmova/dohvatNaziv/:datum_prikazivanja/:id_filma', (request, response, next)=>{


  let datum_prikazivanja = request.params.datum_prikazivanja; 
  let id_filma = request.params.id_filma;

  var sql = "SELECT Raspored_filmova.vrijeme_prikazivanja FROM Raspored_filmova, Film WHERE Raspored_filmova.datum_prikazivanja = ? AND Raspored_filmova.id_filma = ? AND Raspored_filmova.id_filma = Film.id "; 
  con.query(sql, [datum_prikazivanja, id_filma], (err,res)=>{
    if(err) throw err; 

    if(res.length > 0){
      response.json(res); 
    }else{
      console.log("null");
      response.json(null);
    }
  })
})

app.get('/Raspored_filmova/dohvatiSve/:datum_prikazivanja/:id_filma/:vrijeme_prikazivanja', (request, response, next)=>{


  let datum_prikazivanja = request.params.datum_prikazivanja; 
  console.log(datum_prikazivanja); 
  let id_filma = request.params.id_filma;
  console.log(id_filma);
  let vrijeme_prikazivanja = request.params.vrijeme_prikazivanja; 
  console.log(vrijeme_prikazivanja);

  var sql = "SELECT Raspored_filmova.id, Film.naziv, Raspored_filmova.datum_prikazivanja, Raspored_filmova.vrijeme_prikazivanja, Raspored_filmova.max_ulaznica, Raspored_filmova.trenutno_ulaznica, Raspored_filmova.dvorana FROM Raspored_filmova, Film WHERE Raspored_filmova.datum_prikazivanja = ? AND Raspored_filmova.vrijeme_prikazivanja = ? AND Raspored_filmova.id_filma = Film.id";
  con.query(sql, [datum_prikazivanja, vrijeme_prikazivanja, id_filma], (err,res)=>{
    if(err) throw err; 

    if(res.length > 0){
      console.log(res); 
      response.json(res); 
    }else{
      console.log("null");
      response.json(null);
    }
  })
})

app.post('/Karta/insert', (request, response, next) => {

  let post_data = request.body; 

  let ime = post_data.ime; 
  let prezime = post_data.prezime; 
  let cijena = post_data.cijena; 
  let red = post_data.red; 
  let sjedalo = post_data.sjedalo; 
  let oznaka = post_data.oznaka; 
  let ukupno = post_data.ukupno; 
  let id_korisnik = post_data.id_korisnik; 
  let id_raspored = post_data.id_raspored; 

  var sql = "INSERT INTO Karta (ime, prezime, cijena, red, sjedalo, oznaka, ukupno, id_raspored, id_korisnik) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"; 
  con.query(sql, [ime, prezime, cijena, red, sjedalo, oznaka, ukupno, id_raspored, id_korisnik,], (err, res)=>{

    if(err) throw err; 

    response.json("true"); 
  })
})

app.post('/Raspored_filmova/update', (request, response, next)=>{

  let post_data = request.body; 

  let trenutno_ulaznica = post_data.trenutno_ulaznica;
  let id = post_data.id;  
  
  var sql = 'UPDATE Raspored_filmova SET trenutno_ulaznica = ? WHERE id = ? ';

  con.query(sql,[trenutno_ulaznica, id], (err,res)=>{
      if(err) throw err; 
      
      response.json(true); 
  })
  
})

app.get('/Karta/dohvatiSve/:datum_prikazivanja/:id_filma/:vrijeme_prikazivanja/:id', (request, response, next)=>{

  let id = request.params.id; 
  let datum_prikazivanja = request.params.datum_prikazivanja; 
  let id_filma = request.params.id_filma;
  let vrijeme_prikazivanja = request.params.vrijeme_prikazivanja; 

  var sql = "SELECT Karta.oznaka FROM Karta, Raspored_filmova, Film WHERE Raspored_filmova.datum_prikazivanja = ? AND Raspored_filmova.vrijeme_prikazivanja = ? AND Raspored_filmova.id_filma = Film.id AND Raspored_filmova.id = Karta.id_raspored";
  con.query(sql, [datum_prikazivanja, vrijeme_prikazivanja, id_filma, id], (err,res)=>{
    if(err) throw err; 

    if(res.length > 0){
      console.log(res); 
      response.json(res); 
    }else{
      console.log("null");
      response.json(null);
    }
  })
})

app.get('/Karta/ponudaDatum/:datum_prikazivanja/:id_korisnik', (request, response, next)=>{

  let datum_prikazivanja = request.params.datum_prikazivanja;  
  let id_korisnik = request.params.id_korisnik; 

  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD');

  var sql = "SELECT Film.slika, Film.naziv, Film.id, Raspored_filmova.datum_prikazivanja, Raspored_filmova.vrijeme_prikazivanja FROM Karta, Raspored_filmova, Film WHERE Karta.id_korisnik = ? AND Raspored_filmova.datum_prikazivanja = ? AND Karta.id_raspored = Raspored_filmova.id AND  Raspored_filmova.id_filma = Film.id AND Raspored_filmova.datum_prikazivanja >= ?";
  con.query(sql, [id_korisnik, datum_prikazivanja, datum_unosa], (err,res)=>{
    if(err) throw err; 

    if(res.length > 0){
      console.log(res); 
      response.json(res); 
    }else{
      console.log("null");
      response.json(null);
    }
  })
})

app.get('/Karta/sveRezervacije/:id_korisnik', (request, response, next)=>{

  let id_korisnik = request.params.id_korisnik; 

  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD');

  var sql = "SELECT Film.slika, Film.naziv, Karta.id, Raspored_filmova.datum_prikazivanja, Raspored_filmova.vrijeme_prikazivanja FROM Karta, Raspored_filmova, Film WHERE Karta.id_korisnik = ? AND Karta.id_raspored = Raspored_filmova.id AND  Raspored_filmova.id_filma = Film.id AND Raspored_filmova.datum_prikazivanja >= ?";
  con.query(sql, [id_korisnik, datum_unosa], (err,res)=>{
    if(err) throw err; 

    if(res.length > 0){
      console.log(res); 
      response.json(res); 
    }else{
      console.log("null");
      response.json(null);
    }
  })
})

app.get('/Karta/dohvatiRezervaciju/:id', (request, response, next)=>{

  let id = request.params.id; 

  var sql = "SELECT Karta.ime, Karta.prezime, Film.naziv, Raspored_filmova.datum_prikazivanja, Raspored_filmova.vrijeme_prikazivanja, Karta.red, Karta.sjedalo, Karta.cijena, Film.zanr, Film.trajanje, Film.ocjena FROM Karta, Raspored_filmova, Film WHERE Karta.id = ? AND Karta.id_raspored = Raspored_filmova.id AND  Raspored_filmova.id_filma = Film.id ";
  con.query(sql, [id], (err,res)=>{
    if(err) throw err; 

    if(res.length > 0){
      console.log(res); 
      response.json(res); 
    }else{
      console.log("null");
      response.json(null);
    }
  })
})

app.delete('/Karta/deleteRezervacija/:id', (request, response, next)=>{

  let id = request.params.id; 

  var sql = "DELETE FROM Karta WHERE id = ?"; 
  con.query(sql, [id], (err,res)=>{

    if(err) throw err; 

    response.json("true"); 
  })
})


app.post('/Najcesca_pitanja/insert', (request, response, next) => {

  let post_data = request.body; 

  let naziv = post_data.naziv; 
  let opis = post_data.opis;  

  var sql = "INSERT INTO Najcesca_pitanja (naziv, opis) VALUES (?, ?)"; 
  con.query(sql, [naziv,opis], (err, res)=>{

    if(err) throw err; 

    response.json("true"); 
  })
})

app.get('/Najcesca_pitanja/dohvatPitanja/', (request, response, next)=>{

  var sql = "SELECT * FROM Najcesca_pitanja"; 
  con.query(sql, (err,res)=>{
    if(err) throw err; 

    if(res.length > 0){
      response.json(res); 
    }else{
      console.log("null");
      response.json(null);
    }
  })
})

app.post('/Upit/insert', (request, response, next)=> {
  
  let post_data = request.body; 

  let pitanje = post_data.pitanje; 
  let prijedlog = post_data.prijedlog; 
  let id_korisnik = post_data.id_korisnik; 

  var sql = 'INSERT INTO Upit(pitanje, prijedlog, id_korisnik) VALUES ( ?, ?, ?)';

      con.query(sql,[pitanje, prijedlog, id_korisnik], (err,res) =>{
          if(err){
             throw err;
           }
           response.send(true);
     })
  }
);


app.get('/Film/dohvat_preporuka', (request, response, next) =>{
  let post_data = request.body; 
  
  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD');
 
  var sql = "SELECT DISTINCT Film.naziv, Film.slika, Film.zanr, Film.trajanje, Film.ocjena, Film.id, Film.slika_pozadina FROM Film, Raspored_filmova WHERE Raspored_filmova.datum_prikazivanja = ? AND Raspored_filmova.id_filma = Film.id"; 
  con.query(sql, [datum_unosa], (err, res)=>{
    if(err) throw err; 
    
    response.json(res);
  })
})
 

///web part

var login = require("./jsFiles/login")
//var register = require("./register")


  app.post("/db/login", (req,res) =>{
    console.log(req.body)
    login.login(req,res)})
