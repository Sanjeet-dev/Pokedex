import React,{ useState, useEffect } from 'react'
import axios from 'axios';
import './App.css'

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState("");

  useEffect(()=>{
    getPokemonList();
  },[]);

  const getPokemonList = async() => {
    try{
    const response =  await axios.get("https://pokeapi.co/api/v2/pokemon?limit=2000");

    const detailedPokemonData = await Promise.all(
      response.data.results.map(async(pokemon)=>{
        const res = await fetch(pokemon.url);
        return res.json();
      })
    );
    setPokemonList(detailedPokemonData);
    console.log("detailedPokemon data", detailedPokemonData);
    }catch(err){
      console.log("Some issue occurred in fetching", err);
      setError("Failed to load pokemon data");
    }

  }
  if(error){
    return <p>{error}</p>;
  }

  return (
  
    <div className="App">
    <div className="introToApp">
    <h1>Pokedex</h1>
    <div className="btns">
    <button>Pokedex</button>
    <button>Search</button>
    </div>
    </div>
    <div className="pokemon-list">
      <h2>All Pokemons</h2>
      <div className="pokedex">
        <ul>
          {
            pokemonList.map((pokemon)=>(
              <li key={pokemon.id}>
                {(pokemon.sprites && pokemon.sprites.front_default)?
                (<img 
                src={pokemon.sprites.front_default}  
                alt={pokemon.name} />): (<p>No Image Available</p>)
}
                <span>{pokemon.name}</span>

              </li>
            ))
          }
        </ul>
      </div>

    </div>
    </div>
    
  )
}

export default App
