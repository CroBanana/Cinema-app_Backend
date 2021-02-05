
const mysql = require("mysql")
/*
var con = mysql.createConnection({
  host: "remotemysql.com",
  user: "KnV19OC0YF",
  password: "TaiKwEQOCL",
  port: "3306",
  database: "KnV19OC0YF"

})*/

var moment = require('moment');

var pool = mysql.createPool({
  connectionLimit:1,
  host: "remotemysql.com",
  user: "KnV19OC0YF",
  password: "TaiKwEQOCL",
  port: "3306",
  database: "KnV19OC0YF"
})
console.log(pool)

module.exports = {
  checkEmailAndPassword: function (checkEmail,password, response){
    pool.query(checkEmail,(error,res)=>{
      if(error) throw error
        if(res.length>0 ){
          var isAdmin=false;
          console.log(res)
          console.log(res[0].lozinka)
          console.log(password)
          console.log(res[0].potvrda)
          if(res[0].lozinka == password){
            if(res[0].potvrda== "da"){
              isAdmin=true;
            }
            response.send({emailRes:true,passwordRes:true,isAdmin:isAdmin})
          }else{
            response.send({emailRes:true,passwordRes:false,isAdmin:isAdmin})
          }
        }
        else{
          response.send({emailRes:false,passwordRes:false,isAdmin:isAdmin})
          
        }
      
    })
  },


  createAdmins:function(admins){
    admins.forEach(admin => {
      var checkIfEmailExists = `select * from User where email ="${admin.email}"`
      var insertAdmin= `insert into User (ime,prezime,telefon,email,lozinka,potvrda)
                        values ("${admin.ime}",
                        "${admin.prezime}",
                        "${admin.telefon}",
                        "${admin.email}",
                        "${admin.lozinka}",
                        "${admin.potvrda}")`
      console.log(insertAdmin)
      pool.query(checkIfEmailExists,(error,res)=>{
        if(error) throw error
        
          if(res.length>0){
            console.log("email "+admin.email+" alredy exists")
          }else{
            pool.query(insertAdmin,(error,res)=>{
              if(error) throw error
                console.log(admin.email + "   inserted")
              })
            }
          })
        
      
      
    });
  },


  insertTables:function(tables){
    tables.forEach(table=>{
      pool.query(table,(error,res)=>{
        if(error) throw error
    
        console.log("created table if not exists");
        
      })
    })
  },


  register:function(post_data, hash, insertUser, checkEmail,response){
    
      pool.query(checkEmail,[post_data.email],(error,res)=>{
        
        if(error) throw error;
        if(res.length>0){
          response.json("Korisnik već postoji!");
        }else{
          
            pool.query(insertUser,[post_data.ime,post_data.prezime,post_data.telefon,post_data.email,hash], (err,res) =>{
              
              if(err){
                  throw err;
                }
                console.log(true)
                response.send(true);
              
            })
          
        }
      })
    

  },

  androidLogin:function(post_data,hash, findUser, response){
    
      pool.query(findUser,[post_data.email, hash],(err,res)=>{

        if(err) throw err; 
        console.log(res);
        if(res.length > 0){
          response.json(res);
        }else{
          response.json("Pogrešna prijava!"); 
        }
      })
    
  },

  getMovies:function(response,sql, searching){
    console.log("get movies ")
    if(searching== null){

        pool.query(sql,(err, res)=>{
          
          if(err) throw err; 
          if(res.length>0){
            console.log(res); 
            response.json(res);
          }
        })
      
    }else{
      console.log("everything is not null")
      console.log(searching)
      console.log("Did the vrite out?")
        pool.query(sql,[searching],(err, res)=>{
          console.log(sql)
          console.log(res)
          if(err) throw err; 
          if(res.length>0){
            //console.log(res); 
            response.json(res);
          }
        })
      
    }
    
  },

  updateUser:function(sql,data,hash,response){
    if(hash == null){
      console.log(sql)

        pool.query(sql,[ data.ime, data.prezime, data.telefon, data.email, data.slika, data.id], (err,res)=>{
          if(err) throw err; 
          
          response.json(true); 
      })
    
    }else{
      console.log(sql)
        pool.query(sql,[ data.ime, data.prezime, data.telefon, data.email, hash, data.slika , data.id], (err,res)=>{
          if(err) throw err; 
          
          response.json(true); 
      })
    
    }
    
  },

  userData:function(sql, searching, response){

      pool.query(sql, [searching], (err, res)=>{
        
        if(err) throw err; 
        if(res.length>0){
          console.log(res); 
          response.json(res);
        }else{
          response.json(false); 
        }
      })
    
  },

  dodajNoviIzbor:function(sql,post_data, response){

      pool.query(sql, [post_data.datum_dodavanja, post_data.id_korisnik, post_data.id_film], (err, res)=>{

        if(err) throw err; 
    
        response.json("true"); 
      })
    
  },

  provjeraFilma:function(sql,data,response){
    console.log(data.id_korisnik)
    console.log(data.id_film)

      pool.query(sql, [data.id_korisnik, data.id_film], (err, res)=>{
        
        if(err) throw err; 
    
        if(res.length>0){
          response.json(0); 
        }
    
        else{
          response.json(1); 
        }
      })
    
  },

  dohvatPoDatumu:function(sql, data, response){

      pool.query(sql, [data.id_korisnik, data.datum_dodavanja], (err,res)=>{

        if(err) throw err; 
    
        if(res.length > 0){
          response.json(res); 
        }else{
          console.log("null");
          response.json(null);
        }
      })
    
  },

  deleteIzbor:function(sql,data, response){
    
      pool.query(sql, [data.id_korisnik, data.id_film], (err,res)=>{

        if(err) throw err; 
    
        response.json("true"); 
      })
  },

  izborDohvat:function(sql,data,response){
      pool.query(sql, [data.id_korisnik], (err,res)=>{
        if(err) throw err; 
    
        console.log("Prikazani su svi izbori!"); 
        response.json(res);
      })
  },

  unosCijene:function(request){
    let post_data = request.body; 
  
  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  let naziv = post_data.naziv; 
  let cijene_djeca = post_data.cijene_djeca;
  let cijene_odrasli = post_data.cijene_odrasli; 
  let cijene_studenti = post_data.cijene_studenti;  

  var sql = "INSERT INTO Cijene (datum_unosa, naziv, cijene_djeca, cijene_odrasli, cijene_studenti) VALUES (?,?,?, ?, ?)"; 

    pool.query(sql, [datum_unosa, naziv, cijene_djeca, cijene_odrasli, cijene_studenti], (err, res)=>{

      if(err) throw err; 
      
      console.log("uneseno");
    
    })
  },

  rasporedFilmova_dodaj:function (request,response){
    let post_data = request.body; 
  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD'); 
  var datum_prikazivanja = post_data.datum_prikazivanja; 
  var vrijeme_prikazivanja = post_data.vrijeme_prikazivanja;  
  var id_filma = post_data.id_filma; 
  var max_ulaznica = post_data.max_ulaznica; 
  var trenutno_ulaznica = post_data.trenutno_ulaznica; 
  var dvorana = post_data.dvorana; 

  var sql = "INSERT INTO Raspored_filmova (id_filma, datum_unosa, datum_prikazivanja, vrijeme_prikazivanja, max_ulaznica, trenutno_ulaznica, dvorana) VALUES (?,?,?,?,?,?,?)"; 

    pool.query(sql, [id_filma, datum_unosa, datum_prikazivanja, vrijeme_prikazivanja,max_ulaznica, trenutno_ulaznica, dvorana], (err,res)=>{

      if(err) throw err; 
      console.log("Uneseno");
      response.send("uneseno");
    })
  },

  dohvatFulmova_id:function(request,response){
    let id_filma = request.params.id_filma;
  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD');

  var sql = "SELECT Raspored_filmova.datum_prikazivanja, Raspored_filmova.vrijeme_prikazivanja  FROM Raspored_filmova, Film WHERE Raspored_filmova.id_filma = ? AND Raspored_filmova.id_filma = Film.id AND Raspored_filmova.datum_prikazivanja >= ?"; 

    pool.query(sql, [id_filma,datum_unosa], (err,res)=>{
      
      if(err) throw err; 

      console.log("Prikazani su svi izbori!"); 
      response.json(res);
    })
  },

  dohvatiCijene:function(request,response){
    var sql = "SELECT * FROM Cijene WHERE datum_unosa = (SELECT MAX(datum_unosa) FROM Cijene)"; 
    pool.query(sql, (err, res)=>{
      if(err) throw err; 

      response.json(res);
    })
  },

  dohvatiDatum:function(request,response){
    let datum_prikazivanja = request.params.datum_prikazivanja; 
  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD');

  var sql = "SELECT Film.naziv, Raspored_filmova.vrijeme_prikazivanja FROM Raspored_filmova, Film WHERE Raspored_filmova.datum_prikazivanja = ? AND Raspored_filmova.id_filma = Film.id AND Raspored_filmova.datum_prikazivanja >= ?"; 

    pool.query(sql, [datum_prikazivanja, datum_unosa], (err,res)=>{

      if(err) throw err; 
      

      if(res.length > 0){
        response.json(res); 
      }else{
        console.log("null");
        response.json(null);
      }
    })
  },

  dohvatiNaziv:function(request,response){
    let naziv = request.params.naziv; 

  var sql = "SELECT id FROM Film WHERE naziv = ?"; 

    pool.query(sql, [naziv], (err,res)=>{

      if(err) throw err; 

      if(res.length > 0){
        response.json(res); 
      }else{
        console.log("null");
        response.json(null);
      }
    })
  },

  dohvatNaziva2:function (request,response) {
    let datum_prikazivanja = request.params.datum_prikazivanja; 
  let id_filma = request.params.id_filma;

  var sql = "SELECT Raspored_filmova.vrijeme_prikazivanja FROM Raspored_filmova, Film WHERE Raspored_filmova.datum_prikazivanja = ? AND Raspored_filmova.id_filma = ? AND Raspored_filmova.id_filma = Film.id "; 

    pool.query(sql, [datum_prikazivanja, id_filma], (err,res)=>{

      if(err) throw err; 

      if(res.length > 0){
        response.json(res); 
      }else{
        console.log("null");
        response.json(null);
      }
    })
  },

  dohvatiSve:function (request,response) {
    let datum_prikazivanja = request.params.datum_prikazivanja; 
  console.log(datum_prikazivanja); 
  let id_filma = request.params.id_filma;
  console.log(id_filma);
  let vrijeme_prikazivanja = request.params.vrijeme_prikazivanja; 
  console.log(vrijeme_prikazivanja);

  var sql = "SELECT Raspored_filmova.id, Film.naziv, Raspored_filmova.datum_prikazivanja, Raspored_filmova.vrijeme_prikazivanja, Raspored_filmova.max_ulaznica, Raspored_filmova.trenutno_ulaznica, Raspored_filmova.dvorana FROM Raspored_filmova, Film WHERE Raspored_filmova.datum_prikazivanja = ? AND Raspored_filmova.vrijeme_prikazivanja = ? AND Raspored_filmova.id_filma = Film.id";

    pool.query(sql, [datum_prikazivanja, vrijeme_prikazivanja, id_filma], (err,res)=>{
      if(err) throw err; 

      if(res.length > 0){
        console.log(res); 
        response.json(res); 
      }else{
        console.log("null");
        response.json(null);
      }
    })
  },

  insertKarta:function(request,response){
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

    pool.query(sql, [ime, prezime, cijena, red, sjedalo, oznaka, ukupno, id_raspored, id_korisnik,], (err, res)=>{

      if(err) throw err; 

      response.json("true"); 
    })
  },

  rasporedFilmova_Update:function(request,response){
    let post_data = request.body; 

  let trenutno_ulaznica = post_data.trenutno_ulaznica;
  let id = post_data.id;  
  
  var sql = 'UPDATE Raspored_filmova SET trenutno_ulaznica = ? WHERE id = ? ';

    pool.query(sql,[trenutno_ulaznica, id], (err,res)=>{

        if(err) throw err; 
        
        response.json(true); 
    })
  },

  kartaDohvatiSve:function(request,response){
    let id = request.params.id; 
  let datum_prikazivanja = request.params.datum_prikazivanja; 
  let id_filma = request.params.id_filma;
  let vrijeme_prikazivanja = request.params.vrijeme_prikazivanja; 

  var sql = "SELECT Karta.oznaka FROM Karta, Raspored_filmova, Film WHERE Raspored_filmova.datum_prikazivanja = ? AND Raspored_filmova.vrijeme_prikazivanja = ? AND Raspored_filmova.id_filma = Film.id AND Raspored_filmova.id = Karta.id_raspored";

    pool.query(sql, [datum_prikazivanja, vrijeme_prikazivanja, id_filma, id], (err,res)=>{

      if(err) throw err; 

      if(res.length > 0){
        console.log(res); 
        response.json(res); 
      }else{
        console.log("null");
        response.json(null);
      }
    })
  },

  kartaPonudaDatuma:function(request,response){
    let datum_prikazivanja = request.params.datum_prikazivanja;  
  let id_korisnik = request.params.id_korisnik; 

  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD');

  var sql = "SELECT Film.slika, Film.naziv, Film.id, Raspored_filmova.datum_prikazivanja, Raspored_filmova.vrijeme_prikazivanja FROM Karta, Raspored_filmova, Film WHERE Karta.id_korisnik = ? AND Raspored_filmova.datum_prikazivanja = ? AND Karta.id_raspored = Raspored_filmova.id AND  Raspored_filmova.id_filma = Film.id AND Raspored_filmova.datum_prikazivanja >= ?";

    pool.query(sql, [id_korisnik, datum_prikazivanja, datum_unosa], (err,res)=>{

      if(err) throw err; 

      if(res.length > 0){
        console.log(res); 
        response.json(res); 
      }else{
        console.log("null");
        response.json(null);
      }
    })
  },

  kartaSveRezervacije:function (request,response) {
    
    console.log(request.params)
  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD');

  var sql = "SELECT Film.slika, Film.naziv, Karta.id, Raspored_filmova.datum_prikazivanja, Raspored_filmova.vrijeme_prikazivanja FROM Karta, Raspored_filmova, Film WHERE Karta.id_korisnik = ? AND Karta.id_raspored = Raspored_filmova.id AND  Raspored_filmova.id_filma = Film.id AND Raspored_filmova.datum_prikazivanja >= ?";

    pool.query(sql, [request.params.id_korisnik , datum_unosa], (err,res)=>{
      console.log(res)
      if(err) throw err; 

      if(res.length > 0){
        console.log(res); 
        response.json(res); 
      }else{
        console.log("null");
        response.json("Nema rezervacija");
      }
    })
  },

  kartaDohvatiRezervacije:function(request,response){
    let id = request.params.id; 

  var sql = "SELECT Karta.ime, Karta.prezime, Film.naziv, Raspored_filmova.datum_prikazivanja, Raspored_filmova.vrijeme_prikazivanja, Karta.red, Karta.sjedalo, Karta.cijena, Film.zanr, Film.trajanje, Film.ocjena FROM Karta, Raspored_filmova, Film WHERE Karta.id = ? AND Karta.id_raspored = Raspored_filmova.id AND  Raspored_filmova.id_filma = Film.id ";

    pool.query(sql, [id], (err,res)=>{
      if(err) throw err; 

      if(res.length > 0){
        console.log(res); 
        response.json(res); 
      }else{
        console.log("null");
        response.json(null);
      }
    })
  },

  kartaDeleteRezervacija:function(request,response){
    let id = request.params.id; 

  var sql = "DELETE FROM Karta WHERE id = ?"; 


    pool.query(sql, [id], (err,res)=>{

      if(err) throw err; 

      response.json("true"); 
    })
  },

  najcescaPitanjaInsert:function(request,response){
    let post_data = request.body; 

  let naziv = post_data.naziv; 
  let opis = post_data.opis;  

  var sql = "INSERT INTO Najcesca_pitanja (naziv, opis) VALUES (?, ?)"; 

    pool.query(sql, [naziv,opis], (err, res)=>{
      
      if(err) throw err; 

      response.json("true"); 
    })
  },

  upitInsert:function(request,response){
    let post_data = request.body; 

  let pitanje = post_data.pitanje; 
  let prijedlog = post_data.prijedlog; 
  let id_korisnik = post_data.id_korisnik; 

  var sql = 'INSERT INTO Upit(pitanje, prijedlog, id_korisnik) VALUES ( ?, ?, ?)';

      pool.query(sql,[pitanje, prijedlog, id_korisnik], (err,res) =>{
        
          if(err){
             throw err;
           }
           response.send(true);
     })
  },

  najcescaPitanjaDohvat:function(request,response){
    var sql = "SELECT * FROM Najcesca_pitanja"; 

    pool.query(sql, (err,res)=>{

      if(err) throw err; 

      if(res.length > 0){
        response.json(res); 
      }else{
        console.log("null");
        response.json(null);
      }
    })
  },

  filmDOhvatPreporuka:function(request,response){
    let post_data = request.body; 
  
  var datum_unosa = moment(Date.now()).format('YYYY-MM-DD');
  console.log(datum_unosa)
  var sql = "SELECT DISTINCT Film.naziv, Film.slika, Film.zanr, Film.trajanje, Film.ocjena, Film.id, Film.slika_pozadina FROM Film, Raspored_filmova WHERE Raspored_filmova.datum_prikazivanja = ? AND Raspored_filmova.id_filma = Film.id"; 
    pool.query(sql, [datum_unosa], (err, res)=>{

      if(err) throw err; 
      
      response.json(res);
    })
  }, 

  kartaSveRezervacijeAdmin:function(request,response){

    var sql = "SELECT Karta.ime, Karta.prezime, Film.naziv, Raspored_filmova.datum_prikazivanja, Raspored_filmova.vrijeme_prikazivanja, Karta.red, Karta.sjedalo, Karta.cijena, Film.zanr, Film.trajanje FROM KnV19OC0YF.Karta, KnV19OC0YF.Raspored_filmova, KnV19OC0YF.Film  order by Raspored_filmova.datum_prikazivanja DESC , Raspored_filmova.vrijeme_prikazivanja DESC"; 
      pool.query(sql, (err, res)=>{
  
        if(err) throw err; 
        
        response.json(res);
      })
    }



}
  

