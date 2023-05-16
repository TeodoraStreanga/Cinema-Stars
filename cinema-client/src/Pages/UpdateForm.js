import React from "react"
import axios from "axios"
import {useEffect} from "react"
import {useState} from "react"
import {useLocation, useNavigate} from "react-router-dom"
import {Link} from "react-router-dom"
import "../Styles/styles.js"

function UpdateForm() {
    const navigate = useNavigate()
    const location = useLocation()
    const movieid = location.pathname.split("/")[2]

    const [current, setCurrent] = useState([])
    const [years, setYears] = useState([])
    const [genres, setGenres] = useState([])
    const [ratings, setRatings] = useState([])
    const [file, setFile] = useState([])
    const [thumbnail, setThumbnail] = useState([])
    
    const [movie, setMovie] = useState({
        Name: " ",
        Year: " ",
        Genre: " ",
        Rating: " ",
        Length: " ",
        Plot: " ",
        Score: " "
    })
    // eslint-disable-next-line
    useEffect(() => {getCurrentMovie(); getYears(1980); getGenres(); getRatings()}, [])
    
    useEffect(() => {
        if (current.length > 0) {
          const {Name, Year, Genre, Rating, Length, Plot, Score} = current[0];
          setMovie({Name, Year, Genre, Rating, Length, Plot, Score})
          setThumbnail(current[0].Poster);
        }
      }, [current]);

    const yearList = years.map(year => (<option key={year} value={year}>{year}</option>))
    const genreList = genres.map(genre => (<option key={genre.Genre} value={genre.Genre}>{genre.Genre}</option>))
    const ratingList = ratings.map(rating =>(<option key={rating.Rating} value={rating.Rating}>{rating.Rating}</option>))
    const hideFileInput = React.useRef(null)

    return (
        <div className="form-container"> 
            <span className = "form-header">Оновити фільм</span>
            <div className = "form">
                <div className = "image-viewer">
                    <div className = "thumbnail-viewer">
                        {thumbnail && <img className = "thumbnail" src = {thumbnail} alt = ""></img>}
                    </div> 
                    <button className = "form-upload" onClick = {handleFileClick}>
                        Додати зображення
                    </button>
                    <input style={{display: 'none'}} ref = {hideFileInput} name = "Poster" onChange = {setFileChange} 
                    type = "file">
                    </input>
                </div>
        
                <div className = "inputs-viewer">
                    <input className = "form-input form-field" name = "Name" onChange = {setChange} 
                    placeholder = "Назва фільму" type = "text" value ={movie.Name}>
                    </input>

                    <select className = "form-input form-select" name = "Year" value ={movie.Year} onChange={setChange}>
                        <option value = "">Рік...</option>
                        {yearList}
                    </select>

                    <select className = "form-input form-select" name = "Genre" value ={movie.Genre} onChange={setChange}>
                        <option value = "">Жанр...</option>
                        {genreList}
                    </select>

                    <select className = "form-input form-select" name = "Rating" value ={movie.Rating} onChange={setChange}>
                        <option value = " ">Рейтинг...</option>
                        {ratingList}
                    </select>

                    <div className = "form-number-field">
                        <input className = "form-input form-number" name = "Length" value ={movie.Length} onChange = {setChange} 
                        placeholder = "Час" type = "text">
                        </input>
                        <span className = "number-desc">Xвилин</span>
                    </div>

                    <div className = "form-number-field">
                        <input className = "form-input form-number" name = "Score" value ={movie.Score} onChange = {setChange} 
                        placeholder = "Оцінка" type = "text">
                        </input>
                        <span className = "number-desc">/ 10 &#9733;</span>
                    </div>

                    <textarea className = "form-input form-area" name = "Plot"  value ={movie.Plot} onChange = {setChange} 
                    placeholder = "Сюжет"></textarea>
                </div>  
                       
            </div>
            <div className = "form-options">
                <Link to = "/"><button className = "form-submit">Назад</button></Link>
                <button className = "form-submit" onClick = {sendMovie}>Оновити фільм</button>
            </div>
        </div>
    );

    function handleFileClick(e){hideFileInput.current.click()}
    //Setting changes
    function setChange(e){setMovie((prev)=>({...prev, [e.target.name]: e.target.value}))}
    function setFileChange(e){
        e.preventDefault()
        const selectedFile = e.target.files[0]
        setFile(selectedFile)

        if (selectedFile) {
        const reader = new FileReader()
        reader.onload = () => {
            setThumbnail(reader.result)
            console.log(thumbnail)
        }
        reader.readAsDataURL(selectedFile)
        }
    }
    //Send the movie
    async function sendMovie(e){
    
        e.preventDefault();
        try{
            const formdata = new FormData()
            
            if (file){ formdata.append('image', file)}
           
            formdata.append('Name', movie.Name)
            formdata.append('Year', movie.Year)
            formdata.append('Genre', movie.Genre)
            formdata.append('Rating', movie.Rating)
            formdata.append('Length', movie.Length)
            formdata.append('Plot', movie.Plot)
            formdata.append('Score', movie.Score)
            
            await axios.put(`http://localhost:4000/cinema-api/update/${movieid}`, formdata) 
            navigate("/")
        }
        catch(err){
            alert("Помилка")
            console.error(err)
        }
    }
    //Getting the current film info
    async function getCurrentMovie()
    {
        try{
            const res = await axios.get("http://localhost:4000/cinema-api/search/movie/" + movieid)
            console.log(res)
            setCurrent(res.data)
        }
        catch(err){
            console.log(err)
        }
    }
    //Generating years
    function getYears(startYear){
        const currentYear = new Date().getFullYear();
        const list = [];
        while (startYear <= currentYear){list.push(startYear++);}
        setYears(list.reverse())
    }
    //Getting the genres
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
    //Getting the ratings
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
}
export default UpdateForm