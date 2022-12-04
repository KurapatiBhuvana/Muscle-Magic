const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
var serviceAccount = require("./myproject.json");
const request = require('request');

initializeApp({
    credential: cert(serviceAccount)
  });
  
const db = getFirestore();
var express = require('express')  
var app = express()  
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {  
    res.render('home');
}); 


app.get('/register', function (req, res) {  
    res.render('registration') 
});

app.get('/signupSubmit',function(req,res){
    db.collection("Customers")
    .add({
        email : req.query.email,
        username : req.query.name,
        password : req.query.pass
    })
    .then(() => {
        res.render('login');
    })
}); 

app.get('/login', function (req, res) {  
    res.render('login') 
});

app.get('/loginfail',(req,res)=>{
    res.render("loginfail");
  })

app.get('/loginSubmit',(req,res) =>{
    
   const username = req.query.name;
    
    const password=req.query.pass;

        db.collection("Customers")
       
           .where("username","==",username)
          .where("password","==",password)
           .get()
           .then((docs) =>{
            if(docs.size> 0){
              res.render("homepage");
            }
            else{
              res.render("loginfail");
            }
           });
    });


app.get('/homepage', function (req, res) {  
            res.render('homepage')

}); 


app.get('/exercise',(req,res) =>{
    const musc = req.query.musc;
    const diff = req.query.diff;


    const options = {
        method: 'GET',
        url: 'https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises',
        qs: {muscle: musc ,difficulty: diff},
        headers: {
          'X-RapidAPI-Key': '618882c328msh0e86f591090347fp1f5458jsnd109517e2532',
          'X-RapidAPI-Host': 'exercises-by-api-ninjas.p.rapidapi.com',
          useQueryString: true
        }
      };
      
      request(options, function (error, response, body) {
          if (error) throw new Error(error);
           const name = JSON.parse(body)[0].name;
           const instructions = JSON.parse(body)[0].instructions;
           const type = JSON.parse(body)[0].type;
           const muscle = JSON.parse(body)[0].muscle;
           const difficulty = JSON.parse(body)[0].difficulty;

           res.render('main1',{
            name:  name,
            instructions: instructions,
            type : type,
            muscle : muscle,
            difficulty : difficulty,


            
          });
      });


  });



app.listen(3000, function () {  
console.log('Example app listening on port 3000!')  
})