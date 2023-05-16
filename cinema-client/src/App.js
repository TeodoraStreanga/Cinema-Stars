import {BrowserRouter, Routes, Route} from "react-router-dom"
import Movies from "./Pages/MoviesMain.js"
import AddForm from "./Pages/AddForm.js"
import UpdateForm from "./Pages/UpdateForm"
import "./Styles/styles.js"

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element ={<Movies />}></Route>
      <Route path = "/add-movie" element ={<AddForm />}></Route>
      <Route path = "/update-movie/:id" element ={<UpdateForm />}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App
