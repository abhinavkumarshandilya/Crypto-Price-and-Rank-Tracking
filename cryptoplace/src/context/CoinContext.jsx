import { createContext, useEffect, useState } from 'react';

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
  const [allCoin, setAllCoin] = useState([]);
  const [currency, setCurrency] = useState({ name: 'usd', symbol: '$' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllCoin = async () => {
    setLoading(true);
    setError(null);
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-BafibD2VN1G77GFEYeU8hkvE' },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
        options
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch coin data: ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Unexpected API response format');
      }
      setAllCoin(data);
    } catch (err) {
      console.error('Error fetching coins:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCoin();
  }, [currency]);

  const contextValue = {
    allCoin,
    currency,
    setCurrency,
    loading,
    error,
  };

  return <CoinContext.Provider value={contextValue}>{props.children}</CoinContext.Provider>;
};

export default CoinContextProvider;