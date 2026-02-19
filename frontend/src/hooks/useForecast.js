import { useState } from 'react';
import axios from 'axios';

const useForecast = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData);
      setData(response.data);
      return response.data; // Return data so App can set originalTransactions
    } catch (err) {
      console.error(err);
      setError("Failed to upload file. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateForecast = async (transactions) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/forecast', {
        transactions: transactions
      });
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to recalculate forecast.");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    uploadFile,
    updateForecast,
    setData
  };
};

export default useForecast;
