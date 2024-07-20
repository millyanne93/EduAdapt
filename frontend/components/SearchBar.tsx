import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './SearchBar.module.css';

interface User {
  _id: string;
  name: string;
  results: any[];
}

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSearch = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5000/api/users?username=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Failed to search users', error);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setResults([]);
    setQuery(user.name);
  };

  useEffect(() => {
    if (query) {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        className={styles.input}
      />
      {results.length > 0 && (
        <ul className={styles.resultsList}>
          {results.map((user) => (
            <li key={user._id} onClick={() => handleSelectUser(user)} className={styles.resultItem}>
              {user.name}
            </li>
          ))}
        </ul>
      )}
      {selectedUser && (
        <div className={styles.userResults}>
          <h3>{selectedUser.name}'s Results</h3>
          <ul>
            {selectedUser.results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
