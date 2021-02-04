
const mysql = require("mysql")
/*
var con = mysql.createConnection({
  host: "remotemysql.com",
  user: "KnV19OC0YF",
  password: "TaiKwEQOCL",
  port: "3306",
  database: "KnV19OC0YF"

})*/

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
    pool.getConnection(function(error,connection){
      if(error) throw error
      connection.query(checkEmail, (err, res)=>{
        connection.release()
        if (err) throw err
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
      pool.getConnection(function(error,connection){
        if(error) throw error
        connection.query(checkIfEmailExists,(err,res)=>{
          connection.release();
          if(err) throw err;
          if(res.length>0){
            console.log("email "+admin.email+" alredy exists")
          }else{
            pool.getConnection(function(error,connection){
              if(error) throw error
              connection.query(insertAdmin, (err,res)=>{
                connection.release()
                if(err) throw err
                console.log(admin.email + "   inserted")
              })
            })
          }
        })
      })
      
    });
  },


  insertTables:function(tables){
    tables.forEach(table=>{
      pool.getConnection(function(error,connection){
        if(error) throw error
        connection.query(table, function(err,res){
          connection.release()
          if(err) console.log(err);
      
          console.log("created table if not exists");
        })
      })
    })
  },


  register:function(post_data, hash, insertUser, checkEmail,response){
    pool.getConnection(function(error,connection){  
      if(error) throw error
      connection.query(checkEmail,[post_data.email],(err,res)=>{
        connection.release()
        if(err) throw err;
        if(res.length>0){
          response.json("Korisnik već postoji!");
        }else{
          pool.getConnection(function(error,connection){  
            if(error) throw error
            connection.query(insertUser,[post_data.ime,post_data.prezime,post_data.telefon,post_data.email,hash], (err,res) =>{
              connection.release()
              if(err){
                  throw err;
                }
                console.log(true)
                response.send(true);
              
            })
          })
        }
      })
    })

  },

  androidLogin:function(post_data,hash, findUser, response){
    pool.getConnection(function(error,connection){  
      if(error) throw error
      connection.query(findUser,[post_data.email, hash],(err,res)=>{
        connection
        if(err) throw err; 
        console.log(res);
        if(res.length > 0){
          response.json(res);
        }else{
          response.json("Pogrešna prijava!"); 
        }
      })
    })
  },

  getMovies:function(response,sql, searching){
    console.log("get movies ")
    if(searching== null){
      pool.getConnection(function(error,connection){
        
        if(error) throw error
        connection.query(sql,(err, res)=>{
          connection.release()
          if(err) throw err; 
          if(res.length>0){
            console.log(res); 
            response.json(res);
          }
        })
      })
    }else{
      console.log("everything is not null")
      console.log(searching)
      console.log("Did the vrite out?")
      pool.getConnection(function(error,connection){
        if(error) throw error
        connection.query(sql,[searching],(err, res)=>{
          connection.release()
          console.log(sql)
          console.log(res)
          if(err) throw err; 
          if(res.length>0){
            //console.log(res); 
            response.json(res);
          }
        })
      })
    }
    
  },

  updateUser:function(sql,data,hash,response){
    if(hash == null){
      console.log(sql)
      pool.getConnection(function(error,connection){
        if(error) throw error
        connection.query(sql,[ data.ime, data.prezime, data.telefon, data.email, data.slika, data.id], (err,res)=>{
          connection.release()
          if(err) throw err; 
          
          response.json(true); 
      })
    })
    }else{
      console.log(sql)
      pool.getConnection(function(error,connection){
        if(error) throw error
        connection.query(sql,[ data.ime, data.prezime, data.telefon, data.email, hash, data.slika , data.id], (err,res)=>{
          connection.release()
          if(err) throw err; 
          
          response.json(true); 
      })
    })
    }
    
  },

  userData:function(sql, searching, response){
    pool.getConnection(function(error,connection){
      if(error) throw error
      connection.query(sql, [searching], (err, res)=>{
        connection.release()
        if(err) throw err; 
        if(res.length>0){
          console.log(res); 
          response.json(res);
        }else{
          response.json(false); 
        }
      })
    })
  },

  dodajNoviIzbor:function(sql,post_data, response){
    pool.getConnection(function(error,connection){
      if(error) throw error
      connection.query(sql, [post_data.datum_dodavanja, post_data.id_korisnik, post_data.id_film], (err, res)=>{
        connection.release()
        if(err) throw err; 
    
        response.json("true"); 
      })
    })
  },

  provjeraFilma:function(sql,data,response){
    console.log(data.id_korisnik)
    console.log(data.id_film)
    pool.getConnection(function(error,connection){
      if(error) throw error
      connection.query(sql, [data.id_korisnik, data.id_film], (err, res)=>{
        connection.release()
        if(err) throw err; 
    
        if(res.length>0){
          response.json(0); 
        }
    
        else{
          response.json(1); 
        }
      })
    })
  },

  dohvatPoDatumu:function(sql, data, response){
    pool.getConnection(function(error,connection){
      if(error) throw error
      connection.query(sql, [data.id_korisnik, data.datum_dodavanja], (err,res)=>{
        connection.release()
        if(err) throw err; 
    
        if(res.length > 0){
          response.json(res); 
        }else{
          console.log("null");
          response.json(null);
        }
      })
    })
  },

  deleteIzbor:function(sql,data, response){
    pool.getConnection(function(error,connection){
      if(error) throw error
      connection.query(sql, [data.id_korisnik, data.id_film], (err,res)=>{
        connection.release()

        if(err) throw err; 
    
        response.json("true"); 
      })
    })
  },

  izborDohvat:function(sql,data,response){
    pool.getConnection(function(error,connection){
      if(error) throw error
      connection.query(sql, [data.id_korisnik], (err,res)=>{
        connection.release()
        if(err) throw err; 
    
        console.log("Prikazani su svi izbori!"); 
        response.json(res);
      })
    })
  }

}
  

