import React from "react"
import axios from "axios"
import {useEffect} from "react"
import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Link} from "react-router-dom"
import "../Styles/styles.js"

function AddForm() {
    const navigate = useNavigate()

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
    useEffect(() => {setThumbnail();getYears(1980);getGenres(); getRatings()},[])

    const yearList = years.map(year => (<option key={year} value={year}>{year}</option>))
    const genreList = genres.map(genre => (<option key={genre.Genre} value={genre.Genre}>{genre.Genre}</option>))
    const ratingList = ratings.map(rating =>(<option key={rating.Rating} value={rating.Rating}>{rating.Rating}</option>))
    const hideFileInput = React.useRef(null)

    return (
        <div className="form-container"> 
            <span className = "form-header">Додати фільм</span>
            <div className = "form">
                <div className = "image-viewer">
                    <div className = "thumbnail-viewer">
                        {thumbnail && <img className = "thumbnail" src = {thumbnail} alt = ""></img>}
                    </div> 
                    <button className = "form-upload" onClick = {handleFileClick}>
                        Додати зображення
                    </button>
                    <input style={{display: 'none'}} ref = {hideFileInput} name = "Poster" onChange = {setFileChange} type = "file">
                    </input>
                </div>
                <div className = "inputs-viewer">
                    <input className = "form-input form-field" name = "Name" onChange = {setChange} placeholder = "Назва фільму" type = "text">
                    </input>
                    <select className = "form-input form-select" name = "Year" onChange={setChange}>
                        <option value = "">Рік...</option>
                        {yearList}
                    </select>
                    <select className = "form-input form-select" name = "Genre" onChange={setChange}>
                        <option value = "">Жанр...</option>
                        {genreList}
                    </select>
                    <select className = "form-input form-select" name = "Rating" label = " " onChange={setChange}>
                        <option value = " ">Рейтинг...</option>
                        {ratingList}
                    </select>
                    <div className = "form-number-field">
                        <input className = "form-input form-number" name = "Length" onChange = {setChange} placeholder = "Час" type = "text">
                        </input>
                        <span className = "number-desc">Xвилин</span>
                    </div>
                    <div className = "form-number-field">
                        <input className = "form-input form-number" name = "Score" onChange = {setChange} placeholder = "Оцінка" type = "text">
                        </input>
                        <span className = "number-desc">/10 &#9733;</span>
                    </div>
                    <textarea className = "form-input form-area" name = "Plot"  onChange = {setChange} placeholder = "Сюжет"></textarea>
                </div>  
            </div>
            <div className = "form-options">
                <Link to = "/"><button className = "form-submit">Назад</button></Link>
                <button className = "form-submit" onClick = {sendMovie}>Додати фільм</button>
            </div>
        </div>
    );

    function handleFileClick(e){hideFileInput.current.click()}
    //Setting changes
    function setChange(e){setMovie((prev)=>({...prev, [e.target.name]: e.target.value}))}

    function setFileChange(e){
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
            const formdata = new FormData();

            formdata.append('image', file)
            formdata.append('Name', movie.Name);
            formdata.append('Year', movie.Year);
            formdata.append('Genre', movie.Genre);
            formdata.append('Rating', movie.Rating);
            formdata.append('Length', movie.Length);
            formdata.append('Plot', movie.Plot);
            formdata.append('Score', movie.Score);
            
            await axios.post("http://localhost:4000/cinema-api/insert", formdata) 
            navigate("/")
        }
        catch(err){
            alert("Ви повинні заповнити усі поля!")
            console.error(err)
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
export default AddForm