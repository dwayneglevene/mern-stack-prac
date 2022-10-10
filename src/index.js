import React,{useState,useEffect} from "react"
import {createRoot} from "react-dom"
import Axios from "axios"
import CreateNewForm from "./components/CreateNewForm"
import AnimalCard from "./components/AnimalCard"

function App(){

    const [animals,setAnimals] = useState([]);

    useEffect(() => {
        async function go(){
            const response = await Axios.get("/api/animals")
            setAnimals(response.data)
        }
        go()
    },[])


    return (
        <div className ="container">
            <p><a href="/">Back to public homepageS</a></p>
            <CreateNewForm setAnimals={setAnimals} />

            <div className="animal=grid">
            {animals.map(function(animal) {
                return <AnimalCard  key={animal._id} name={animal.name} species={animal.species} photo={animal.photo} id={animal._id} setAnimals={setAnimals}/>
            })}
        </div>
        </div>
    )
}


// function AnimalCard(props){
//     return <p>Hi, my name is {props.name} blank and i am fly {props.species}</p>
// }
const root = createRoot(document.querySelector("#app"))
root.render(<App />)