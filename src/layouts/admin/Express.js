import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';

const MultiSelectDropdown = ({ selectedOptions, onSelectChange }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const countriesArray = Object.values(data);
        setCountries(countriesArray);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const fetchStates = async (countryCode) => {
    try {
      const response = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${countryCode}&username=demo`);
      const data = await response.json();
      setStates(data.geonames);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async (stateCode) => {
    try {
      const response = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${stateCode}&username=demo`);
      const data = await response.json();
      setCities(data.geonames);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry) {
      fetchCities(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    const filtered = states.filter(state =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStates(filtered);
  }, [searchTerm, states]);

  useEffect(() => {
    const filtered = cities.filter(city =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [searchTerm, cities]);

  const countryOptions = countries.map(country => ({
    value: country.geonameid,
    label: country.countryName,
  }));

  const stateOptions = filteredStates.map(state => ({
    value: state.geonameId,
    label: state.name,
  }));

  const cityOptions = filteredCities.map(city => ({
    value: city.geonameId,
    label: city.name,
  }));

  const handleCountryChange = selectedCountry => {
    setSelectedCountry(selectedCountry.value);
    onSelectChange([]);
  };

  const handleStateChange = selectedStates => {
    const selectedValues = selectedStates.map(state => state.value);
    onSelectChange(selectedValues);
  };

  const handleCityChange = selectedCities => {
    const selectedValues = selectedCities.map(city => city.value);
    onSelectChange(selectedValues);
  };

  return (
    <div className="multi-select-dropdown">
      <Select
        options={countryOptions}
        onChange={handleCountryChange}
        placeholder="Select Country"
      />
      {selectedCountry && (
        <>
          <Select
            isMulti
            options={stateOptions}
            onChange={handleStateChange}
            placeholder="Select States"
          />
          <Select
            isMulti
            options={cityOptions}
            onChange={handleCityChange}
            placeholder="Select Cities"
          />
        </>
      )}
    </div>
  );
};

// Example usage:
const Express = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = selected => {
    setSelectedOptions(selected);
  };

  return (
    <div>
      <h1>Multi Select Dropdown with Countries, States, and Cities</h1>
      <MultiSelectDropdown
        selectedOptions={selectedOptions}
        onSelectChange={handleSelectChange}
      />
      <div>Selected Options: {selectedOptions.join(', ')}</div>
    </div>
  );
};

export default Express;
