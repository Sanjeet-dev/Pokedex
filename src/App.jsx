import React,{ useState, useEffect } from 'react'
import axios from 'axios';
import './App.css'

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState("");

  useEffect(()=>{
    getPokemonList();
  },[]);

  const getPokemonList = async() => {
    try{
    const response =  await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1300");

    const detailedPokemonData = await Promise.all(
      response.data.results.map(async(pokemon)=>{
        const res = await fetch(pokemon.url);
        return res.json();
      })
    );
    setPokemonList(detailedPokemonData);
    console.log("detailedPokemon data", detailedPokemonData);
    }
    
    catch(err){
      console.log("Some issue occurred in fetching", err);
      setError("Failed to load pokemon data");
    }

  }
  if(error){
    return <p>{error}</p>;
  }

  // Fetch Pokemon based on search query:
  const handleSearch = async() => {
    try{
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}");
      const data = await response.json();

      const detailedPokemonData = await Promise.all(
        data.results.map(async(pokemon)=>{
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );
      setPokemonList(detailedPokemonData);
      setError("");
    } catch(error){
      setPokemon(null);
      setError("Pokemon not found. Please try again.");
    }
  }

  return (
  
    <div className="App">
    <div className="introToApp">
    <h1>Pokedex</h1>
    <div className="btns">
    <button>Pokedex</button>
    <button onClick={()=> setShowSearchInput((prev)=> !prev)}>
    {showSearchInput ? "Hide Search":"Search"}
    </button>
    
    { showSearchInput && (
      <div>
        <input 
        type="text"
        placeholder = "Search Pokemon"
        value={searchQuery}
        onChange={(e)=> setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      
      </div>
    )}
    {error && <p>{err}</p>}
    {pokemon && (
      <div>
        <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        {(pokemon.sprites && pokemon.sprites.front_default)?
                (<img 
                src={pokemon.sprites.front_default}  
                alt={pokemon.name} />): (<p>No Image Available</p>)
        }
        <p>Type: {pokemon.types.map(type => type.type.name).join(", ")}</p>
      </div>
    )}
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
