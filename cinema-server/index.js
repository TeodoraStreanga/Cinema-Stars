//importing libraries
const express = require ("express")
const mysql = require ("mysql")
const cors = require ("cors")
const multer = require ("multer")
const path = require ("path")

//configuring libraries
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('public')); 
app.use('/storage', express.static('storage'));

//creating a storage for files
const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, "./public/storage/")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})

//creating the database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cinema-db"
})

//Getting all movies
app.get("/cinema-api/movies", (req,res) =>{
    const sql = "SELECT * FROM movies"
    
    db.query(sql,(err,data) =>{
        if(err) throw err
        res.json(data)
    })
})
//Getting all genres
app.get("/cinema-api/genres", (req,res) =>{ 
    const sql = "SELECT * FROM genres"
    
    db.query(sql,(err,data) =>{
        if(err) throw err
        res.json(data)
    })
})
//Getting all ratings
app.get("/cinema-api/ratings", (req,res) =>{
    const sql = "SELECT * FROM ratings"
    
    db.query(sql,(err,data) =>{
        if(err) throw err
        res.json(data)
    })
})
//Add a movie
app.post('/cinema-api/insert', upload.single('image'), (req,res)=> {
    
    const values = [
        req.body.Name,
        req.body.Year,
        req.body.Genre,
        req.body.Rating,
        req.body.Length,
        req.body.Plot,
        req.body.Score,
        'http://localhost:4000/storage/' + req.file.filename
    ]
    const sql = "INSERT INTO movies (Name, Year, Genre, Rating, Length, Plot, Score, Poster) VALUES (?,?,?,?,?,?,?,?)"

    db.query(sql, values, (err, data) =>{
        if(err) throw err
        res.json(data)
    })
})
//Update a movie
app.put("/cinema-api/update/:id", upload.single('image'), (req, res) => {
    
    movieId = req.params.id
    let poster = null

    const values = [
        req.body.Name,
        req.body.Year,
        req.body.Genre,
        req.body.Rating,
        req.body.Length,
        req.body.Plot,
        req.body.Score
    ]
    let text = []

    let sql = "UPDATE movies SET Name = ?, Year = ?, Genre = ?, Rating = ?, Length = ?, Plot = ?, Score = ?"
    
    if (req.file) {
        poster = 'http://localhost:4000/storage/' + req.file.filename;
    }
    if (poster !== null) {
        text.push("Poster = ?");
        values.push(poster);
    }

    if (text.length > 0) {
        sql += ", " + text.join(", ");
    }

    sql += " WHERE Movie_id = ?";
    values.push(movieId);

    db.query(sql, values, (err, data) => {
        if (err) throw err;
        res.json(data);
    });
})
//Delete a movie
app.delete("/cinema-api/delete/:id", (req,res) =>{
    const id = req.params.id
    sql = "DELETE FROM movies WHERE Movie_id = ?"

    db.query(sql, id, (err,data) =>{
        if(err) throw err
        res.json(data)
    })
    db.query("ALTER TABLE movies AUTO_INCREMENT=1")
})
//Search by name
app.get("/cinema-api/search/name/:name", (req,res) =>{
    const name = req.params.name
    sql = 'SELECT * FROM movies WHERE Name LIKE "%' + name + '%"'
    
    db.query(sql, (err,data) =>{
        if(err) throw err
        res.json(data)
    })
})
//Search by id
app.get("/cinema-api/search/movie/:id", (req,res) =>{
    
    var id = req.params.id
    sql = 'SELECT * FROM movies WHERE Movie_id = ?'
    
    db.query(sql, id, (err,data) =>{
        if(err) throw err
        res.json(data)
    })
})
//Filter by Year, Genre and Rating
app.get("/cinema-api/filter/:year&:genre&:rating", (req,res) =>{
    const year = req.params.year
    const genre = req.params.genre
    const rating = req.params.rating

    let sql = 'SELECT * FROM movies'

    if (year == "all" && genre == "all" && rating == "all")
    {
        db.query(sql, (err,data) =>{
            if(err) throw err
            res.json(data)
        })
    }
    if (year != "all" || genre != "all" || rating != "all") {
        
        sql += ' WHERE '
        let text = []
        let values =[]
    
        if (year != "all") {
            text.push('Year = ?')
            values.push(Year)
        }
        if (genre != "all") {
            text.push('Genre LIKE ?')
            values.push(Genre)
        }
        if (rating != "all") {
            text.push('Rating LIKE ?')
            values.push(Rating)
        }
        sql += text.join(' AND ')  

        db.query(sql, values, (err,data) =>{
            if(err) throw err
            res.json(data)
        })
    }  
})
//Listening on port 4000
app.listen(4000, function(){
    console.log("Connection to server successful! Running on port 4000")
})