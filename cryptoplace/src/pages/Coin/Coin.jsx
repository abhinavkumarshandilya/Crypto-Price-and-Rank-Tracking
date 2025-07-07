import React, { useContext, useEffect, useState } from 'react';
import './Coin.css';
import { useParams } from 'react-router-dom';
import { CoinContext } from '../../context/CoinContext';
import LineChart from '../../components/LineChart/LineChart';

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency } = useContext(CoinContext);

  const fetchCoinData = async () => {
    setError(null);
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-BafibD2VN1G77GFEYeU8hkvE' },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
        options
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch coin data: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data || !data.id) {
        throw new Error('Invalid coin data received');
      }
      setCoinData(data);
    } catch (err) {
      console.error('Error fetching coin data:', err);
      setError(err.message);
    }
  };

  const fetchHistoricalData = async () => {
    setError(null);
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-BafibD2VN1G77GFEYeU8hkvE' },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
        options
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch historical data: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data || !data.prices || !Array.isArray(data.prices)) {
        throw new Error('Invalid historical data received');
      }
      setHistoricalData(data);
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (coinId) {
      setLoading(true);
      Promise.all([fetchCoinData(), fetchHistoricalData()])
        .catch((err) => {
          console.error('Error in Promise.all:', err);
          setError('Failed to load data');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [coinId, currency]);

  if (loading) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coin">
        <p className="error">Error: {error}</p>
        <button
          onClick={() => {
            setLoading(true);
            Promise.all([fetchCoinData(), fetchHistoricalData()])
              .catch((err) => setError('Failed to load data'))
              .finally(() => setLoading(false));
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!coinData || !coinData.image || !coinData.name || !coinData.symbol) {
    return (
      <div className="coin">
        <p>No coin data available</p>
      </div>
    );
  }

  return (
    <div className="coin">
      <div className="coin-name">
        <img src={coinData.image.large} alt={coinData.name} />
        <p>
          <b>
            {coinData.name} ({coinData.symbol.toUpperCase()})
          </b>
        </p>
      </div>
      <div className="coin-chart">
        {historicalData && historicalData.prices.length > 0 ? (
          <LineChart historicalData={historicalData} />
        ) : (
          <p>No historical data available</p>
        )}
      </div>
      <div className="coin-details">
        <p>
          Market Rank: {coinData.market_cap_rank || 'N/A'}
        </p>
        <p>
          Price: {currency.symbol}
          {coinData.market_data.current_price[currency.name]?.toLocaleString() || 'N/A'}
        </p>
        <p>
          Market Cap: {currency.symbol}
          {coinData.market_data.market_cap[currency.name]?.toLocaleString() || 'N/A'}
        </p>
        <p>
          24H Change:{' '}
          <span
            style={{
              color: coinData.market_data.price_change_percentage_24h >= 0 ? 'green' : 'red',
            }}
          >
            {coinData.market_data.price_change_percentage_24h?.toFixed(2) || 'N/A'}%
          </span>
        </p>
      </div>
    </div>
  );
};

export default Coin;