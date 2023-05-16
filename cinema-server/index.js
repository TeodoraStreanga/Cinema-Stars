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
app.put("/cinema-api/update/:id", upload.single('image'), (req,res) =>{
    
    const movieid = req.params.id
    const Name = req.body.Name
    const Year =  req.body.Year
    const Genre = req.body.Genre
    const Rating = req.body.Rating
    const Length = req.body.Length
    const Plot = req.body.Plot
    const Score = req.body.Score
    let  Poster = null 
    
    if (req.file) {Poster = 'http://localhost:4000/storage/' + req.file.filename;}
    
    let sql = "UPDATE movies SET "
    let text = []
    
    if (Name != null) {
        text.push("Name = '" + Name + "'")
    }
    if (Year != null) {
        text.push("Year = '" + Year + "'")
    }
    if (Genre != null) {
        text.push("Genre = '" + Genre + "'")
    }
    if (Rating != null) {
        text.push("Rating = '" + Rating + "'")
    }
    if (Length != null) {
        text.push("Length = '" + Length + "'")
    }
    if (Plot != null) {
        text.push("Plot = '" + Plot + "'")
    }
    if (Score != null) {
        text.push("Score = '" + Score + "'")
    }
    if (Poster != null) {
        text.push("Poster = '" + Poster + "'")
    }

    sql += text.join(', ') + "WHERE Movie_id = " + movieid

    db.query(sql, (err,data) =>{
        if(err) throw err
        res.json(data)
    })
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
    const Year = req.params.year
    const Genre = req.params.genre
    const Rating = req.params.rating

    let sql = 'SELECT * FROM movies'

    if (Year != "all" || Genre != "all" || Rating != "all") {
        
        sql += ' WHERE '
        let text = []
    
        if (Year != "all") {
            text.push('Year = ' + Year)
        }
        if (Genre != "all") {
            text.push('Genre LIKE "' + Genre + '"')
        }
        if (Rating != "all") {
            text.push('Rating LIKE "' + Rating + '"')
        }
        sql += text.join(' AND ')
    }
    db.query(sql, (err,data) =>{
        if(err) throw err
        res.json(data)
    })
})
//Listening on port 4000
app.listen(4000, function(){
    console.log("Connection to server successful! Running on port 4000")
})