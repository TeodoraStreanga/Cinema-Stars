import React from "react"
import axios from "axios"
import {useState} from "react"
import {useEffect} from "react"
import {Link} from "react-router-dom"
import "../Styles/styles.js"

function Movies() {
    
    const [title, setTitle] = useState([])
    const [movies, setMovies] = useState([])
    const [search, setSearch] = useState([])
    const [years, setYears] = useState([])
    const [genres, setGenres] = useState([])
    const [ratings, setRatings] = useState([])
    
    const [filter, setFilter] = useState({
        Year: "all",
        Genre: "all",
        Rating: "all"
    })
    useEffect(() => {getAllMovies(); getYears(1980); getGenres(); getRatings()},[])
    
    const yearList = years.map(year => (<option key={year} value={year}>{year}</option>))
    const genreList = genres.map(genre => (<option key={genre.Genre} value={genre.Genre}>{genre.Genre}</option>))
    const ratingList = ratings.map(rating =>(<option key={rating.Rating} value={rating.Rating}>{rating.Rating}</option>))
    
    return (
            <div className = "movies-main-container">
                {/*Nav bar*/}
                <div className = "nav-bar">
                    <span className = "nav-logo">CINEMA &#9733; STARS</span>

                    <div className = "nav-field">
                    {/*Nav buttons*/}
                    <Link ><button className = "nav-link" onClick={() => {getAllMovies(); window.location.reload()}}>Головна</button></Link>
                    <Link to = "/add-movie"><button className = "nav-link">Додати фільм</button></Link>

                    {/*Search bar*/}
                    <div className = "search-bar">
                        <input className = "search-field" type = "text" onChange = {(e) => setSearch(e.target.value)} placeholder= "Шукати фільм..."></input>
                        <button className = "search-button" onClick = {() => searchMovieName(search)}></button>
                    </div>
                </div>
            </div>
            {/*Title bar*/}
            <span className = "title-bar">{title}</span>
            {/*Filter bar*/}
            <div className = "filter-bar">
                    <select className = "filter-select" name = "Year" onChange={setChange}>
                        <option value = "all">За весь час</option>
                        {yearList}
                    </select>
                    <select className = "filter-select" name = "Genre" onChange={setChange}>
                        <option value = "all">Будь-який жанр</option>
                        {genreList}
                    </select>
                    <select className = "filter-select" name = "Rating" onChange={setChange}>
                        <option value = "all">Будь-який рейтинг</option>
                        {ratingList}
                    </select>
                    <button className = "filter-button" onClick = {() => filterMovies(filter.Year,filter.Genre,filter.Rating)}></button>
            </div>
            {/*Movie viewer*/}
            <div className = "movie-viewer">
                    {movies.map((movie)=>(
                        <div class = "movie-field" key = {movies.Movie_id}>
                            <div className = "movie-header">
                                <span className="header-text">{movie.Name}</span>
                                <div className = "header-options">
                                    <Link to = {`/update-movie/${movie.Movie_id}`}>
                                        <button className = "options-button">Оновити</button>
                                    </Link>
                                    <button className = "options-button" onClick ={() => {deleteMovie(movie.Movie_id)}}>Видалити</button>
                                </div>
                            </div>
                            <div className = "movie-info">
                                <img className = "poster" src = {movie.Poster} alt = {movie.Name}></img>
                                <div className = "movie-text">
                                    <div className = "text-item"> 
                                        <span className="text name">Рік:</span>
                                        <span className="text">{movie.Year}</span>
                                    </div>
                                    <div className = "text-item"> 
                                        <span className="text name">Жанр:</span>
                                        <span className="text">{movie.Genre}</span>
                                    </div>
                                    <div className = "text-item"> 
                                        <span className="text name">Рейтинг:</span>
                                        <span className="text">{movie.Rating}</span>
                                    </div>
                                    <div className = "text-item"> 
                                        <span className="text name">Час:</span>
                                        <span className="text">{movie.Length} хв</span>
                                    </div>
                                    <div className = "text-item"> 
                                        <span className="text name">Оцінка:</span>
                                        <span className="text">{movie.Score} / 10 &#9733;</span>
                                    </div>

                                    <div className = "text-item area">{movie.Plot}</div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>   
    )
    //Getting all movies 
    async function getAllMovies() {
        try{
            const res = await axios.get("http://localhost:4000/cinema-api/movies")
            console.log(res)
            setMovies(res.data)
            setTitle("Головна")
        }
        catch(err){
            console.log(err)
        }
    }
    //Delete a movie
    async function deleteMovie(id) {
        await axios.delete(`http://localhost:4000/cinema-api/delete/${id}`)
        window.location.reload()  
    }
    //Search for a movie by name
    async function searchMovieName(name) {
        try{
            const res = await axios.get(`http://localhost:4000/cinema-api/search/name/${name}`)
            console.log(res)
            setMovies(res.data)
            setTitle('Результати пошуку "' + name + '"')
        }
        catch(err){
            console.log(err)
        }
    }
    //Generating years for the filter bar
    function getYears(startYear){
        const currentYear = new Date().getFullYear();
        const list = [];
        while (startYear <= currentYear){list.push(startYear++);}
        setYears(list.reverse())
    }
    //Getting the genres for the filter bar
    async function getGenres() {
        try{
            const res = await axios.get("http://localhost:4000/cinema-api/genres")
            console.log(res)
            setGenres(res.data)
        }
        catch(err){
            console.log(err)
        }
    }
    //Getting the ratings for the filter bar
    async function getRatings() {
        try{
            const res = await axios.get("http://localhost:4000/cinema-api/ratings")
            console.log(res)
            setRatings(res.data)
        }
        catch(err){
            console.log(err)
        }
    }
    //setting filter values
    function setChange(e){setFilter((prev)=>({...prev, [e.target.name]: e.target.value}))}
    //getting the movies with values from the filter
    async function filterMovies(year, genre, rating)
    {
        try{
            const res = await axios.get(`http://localhost:4000/cinema-api/filter/${year}&${genre}&${rating}`)
            console.log(res)
            setMovies(res.data)
        }
        catch(err){
            console.log(err)
        }
    }   
}
export default Movies