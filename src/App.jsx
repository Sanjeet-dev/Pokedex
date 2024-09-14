import React,{ useState, useEffect } from 'react'
import axios from 'axios';
import './App.css'

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPokemon, setSearchPokemon] = useState(null);
  const [isLoading,setIsLoading]=useState(false);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPokemon, setTotalPokemon] = useState(0);
  const pageSize = 50;

  useEffect(()=>{
    getPokemonList(currentPage);
  },[currentPage]);

  const getPokemonList = async(page) => {
    const offset = (page - 1)*pageSize;
    try{
      setIsLoading(true);
    const response =  await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`);

    const detailedPokemonData = await Promise.all(
      response.data.results.map(async(pokemon)=>{
        const res = await fetch(pokemon.url);
        return res.json();
      })
    );
    setPokemonList(detailedPokemonData);
    setTotalPokemon(response.data.count);
    setError("");
    setSearchPokemon(null);
    console.log("detailedPokemon data", detailedPokemonData);
    }
    
    catch(err){
      console.log("Some issue occurred in fetching", err);
      setError("Failed to load pokemon data");
    }finally{
      setIsLoading(false);
    }

  }

  // Fetch Pokemon based on search query:
 const handleSearch = () => {
  const trimmedQuery = searchQuery.trim().toLowerCase();

  if(!trimmedQuery){
    setError("Please enter a valid Pokemon name");
    return;
  }
  const filteredPokemon =  pokemonList.find(pokemon =>
    pokemon.name.toLowerCase() === trimmedQuery
  );

  if(filteredPokemon){
    setSearchPokemon(filteredPokemon);
    setError("");
    setSearchQuery("");
  }else{
    setSearchPokemon(null);
    setError("Pokemon not found. Please try again.");
  }
 }

 // pagination control (Next and Previous)

 const handleNextPage = () => {
  if(currentPage*pageSize < totalPokemon){
    setCurrentPage(currentPage+1);
  }
 };

 const handlePrevPage = () => {
  if(currentPage>1){
    setCurrentPage(currentPage-1);
  }
 };

  return (
  
    <div className="App">
    
    <div className="introToApp">
    <h1>Pokedex</h1>
    <div className="btns">
    <button onClick={getPokemonList}>Pokedex</button>
    <button onClick={()=> setShowSearchInput((prev)=> !prev)}>
    {showSearchInput ? "Hide Search":"Search"}
    </button>
    
    { showSearchInput && (
      <div className="inputbox">
        <input 
        className="searchBox"
        type="text"
        placeholder = "Search Pokemon"
        value={searchQuery}
        onChange={(e)=> setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      
      </div>
    )}
    </div>
    </div>
    {showSearchInput && <div className="showSearchPokemon">
    {error && <p>{error}</p>}
    {searchPokemon && (
      <div className="foundPokemon">
        {(searchPokemon.sprites?.front_default)?
                (<img className="searchPokemon"
                src={searchPokemon.sprites.front_default}  
                alt={searchPokemon.name} />): (<p>No Image Available</p>)
        }
        <span>{searchPokemon.name.charAt(0).toUpperCase() + searchPokemon.name.slice(1)}</span>
        <p>Height: {searchPokemon.height}</p>
        <p>Weight: {searchPokemon.weight}</p>
        <p>Type: {searchPokemon.types.map(type => type.type.name).join(", ")}</p>
      </div>
    )}
    </div>}

    { !searchPokemon &&
    <div className="pokemon-list">
      <h2>All Pokemons</h2>
      <div className="pokedex">
        {isLoading&&<h4>Loading...</h4>}
        <ul>
          {!isLoading &&
            pokemonList.map((pokemon)=>(
              <li key={pokemon.id}>
                {(pokemon.sprites?.front_default)?
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

    </div>}
    {/* Pagination control  */}
    <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
      <span className="pageNum">Page:{currentPage}</span>
      <button onClick={handleNextPage} disabled={currentPage*pageSize >= totalPokemon}>
        Next
      </button>
    </div>
    
    </div>
    
  )
}

export default App
