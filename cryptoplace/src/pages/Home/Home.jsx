import React, { useContext, useEffect, useState } from 'react';
import './Home.css';
import { CoinContext } from '../../context/CoinContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { allCoin, currency, loading, error } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState('');

  const inputHandler = (event) => {
    setInput(event.target.value);
    // Reset displayCoin to allCoin when input is cleared
    if (event.target.value === '') {
      setDisplayCoin(allCoin);
    }
  };

  const searchHandler = async (event) => {
    event.preventDefault();
    if (!input.trim()) {
      setDisplayCoin(allCoin);
      return;
    }
    const coins = allCoin.filter((item) =>
      item.name.toLowerCase().includes(input.toLowerCase())
    );
    setDisplayCoin(coins);
  };

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  return (
    <div className="home">
      <div className="hero">
        <h1>Largest <br /> Crypto Marketplace</h1>
        <p>
          Welcome to the world's largest cryptocurrency marketplace. Sign up to explore more about cryptos.
        </p>
        <form onSubmit={searchHandler}>
           <datalist id='coinlist'>
            {allCoin.map((item,index)=>(<option key={index} value={item.name}/>))}
           </datalist>


          <input
            onChange={inputHandler} list='coinlist'
            value={input}
            type="text"
            placeholder="Search Crypto..."
            required
          />
          <button type="submit">Search</button>
        </form>
      </div>
      <div className="crypto-table">
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{ textAlign: 'center' }}>24H Change</p>
          <p className="market-cap">Market Cap</p>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : displayCoin.length === 0 ? (
          <p>No coins found</p>
        ) : (
          displayCoin.slice(0, 10).map((item) => (
            <Link to= {`/coin/${item.id}`} className="table-layout" key={item.id}>
              <p>{item.market_cap_rank}</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: '30px', marginRight: '10px' }} />
                <p>{item.name}</p>
              </div>
              <p>{currency.symbol}{item.current_price.toLocaleString()}</p>
              <p style={{ textAlign: 'center', color: item.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                {item.price_change_percentage_24h.toFixed(2)}%
              </p>
              <p className="market-cap">{currency.symbol}{item.market_cap.toLocaleString()}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;