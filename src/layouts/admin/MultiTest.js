import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import axios from 'axios';

const MultiSelectDropdown = ({ onSelectChange, apiUrl, type }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
      }
    };

    fetchData();
  }, [apiUrl, type]);

  useEffect(() => {
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const options = filteredData.map(item => ({
    value: item.name,
    label: item.name,
  }));

  const handleSelectChange = selectedOptions => {
    const selectedValues = selectedOptions.map(option => option.value);
    onSelectChange(selectedValues, type);
  };

  const Option = ({ innerProps, label, isSelected }) => (
    <div {...innerProps}>
      <input type="checkbox" checked={isSelected} readOnly />
      {label}
    </div>
  );

  const Menu = props => {
    const maxHeight = 200;
    return (
      <components.Menu {...props}>
        <div style={{ maxHeight, overflowY: 'auto' }}>{props.children}</div>
      </components.Menu>
    );
  };

  return (
    <div className="multi-select-dropdown">
      <Select
        isMulti
        options={options}
        onChange={handleSelectChange}
        onInputChange={setSearchTerm}
        placeholder={`Search and select ${type}s...`}
        components={{ Option, Menu }}
        menuIsOpen={options.length > 0}
      />
    </div>
  );
};

// Example usage:
const App = () => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  const handleSelectChange = (selectedValues, type) => {
    if (type === 'country') {
      setSelectedCountries(selectedValues);
    } else if (type === 'state') {
      setSelectedStates(selectedValues);
    } else if (type === 'city') {
      setSelectedCities(selectedValues);
    }
  };

  const countriesApiUrl = process.env.REACT_APP_COUNTRIES_API_URL;
  const statesApiUrl = process.env.REACT_APP_STATES_API_URL;
  const citiesApiUrl = process.env.REACT_APP_CITIES_API_URL;

  return (
    <div>
      <h1>Multi Select Dropdowns</h1>
      <MultiSelectDropdown
        onSelectChange={(values) => handleSelectChange(values, 'country')}
        apiUrl={countriesApiUrl}
        type="country"
      />
      <MultiSelectDropdown
        onSelectChange={(values) => handleSelectChange(values, 'state')}
        apiUrl={statesApiUrl}
        type="state"
      />
      <MultiSelectDropdown
        onSelectChange={(values) => handleSelectChange(values, 'city')}
        apiUrl={citiesApiUrl}
        type="city"
      />
      <div>Selected Countries: {selectedCountries.join(', ')}</div>
      <div>Selected States: {selectedStates.join(', ')}</div>
      <div>Selected Cities: {selectedCities.join(', ')}</div>
      <button onClick={postSelectedData}>Submit Selected Data</button>
    </div>
  );
};

export default App;
