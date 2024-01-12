import React, { useState, useEffect } from 'react';
import "./App.css"
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [nameFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [categoryFilter, monthFilter, sortOrder, nameFilter]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filteredData = data
    .filter((item) => {
      return (
        (categoryFilter === '' || item.Category === categoryFilter) &&
        (monthFilter === '' || new Date(item.DOB).toLocaleString('en-US', { month: 'long' }) === monthFilter) &&
        (nameFilter === '' || item.Name.toLowerCase().includes(nameFilter.toLowerCase()))
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.Name.localeCompare(b.Name);
      } else {
        return b.Name.localeCompare(a.Name);
      }
    });

  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const monthName = new Date(`2022-${index + 1}-01`).toLocaleString('en-US', { month: 'long' });
    return { value: monthName, label: monthName };
  });

  return (
    <div>
      <h1 className='Heading-tittle'>DATA FILTERING</h1>
    
      <label className='Filter-labels'>
        Filter by Category:
        <select className='Filter-input-Box'
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </label>

      <label className='Filter-labels'  >
        Filter by Month (DOB):
        <select className='Filter-input-Box'
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        >
          <option value="">All</option>
          {monthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className='Filter-labels'  >
        Sort by Name:
        <select className='Filter-input-Box'
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Alphabetical (A-Z)</option>
          <option value="desc">Alphabetical (Z-A)</option>
        </select>
      </label>
      
      <table className='Content-table'>
        <thead className='Content-table-Head'>
          <tr>
            <th>SNo</th>
            <th>Name</th>
            <th>Category</th>
            <th>DOB</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr className='Content-table-Row' key={item._id}>
              <td>{index + 1}</td>
              <td>{item.Name}</td>
              <td>{item.Category}</td>
              <td>{new Date(item.DOB).toLocaleDateString()}</td>
              <td>{item.Time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
