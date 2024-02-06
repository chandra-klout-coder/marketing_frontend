import React, { useState, useRef, useEffect } from "react";
import Select, { components } from "react-select";
import { useHistory, Link } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";

import loadingGif from "../../assets/images/load.gif";
import Defaultuser from "../../assets/images/defaultuser.png";

const MultiSelectDropdown = ({
  selectedOptions,
  onSelectChange,
  apiUrl,
  type,
}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const selectRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        setData(data.data);
        setFilteredData(data.data);
      } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
      }
    };

    fetchData();
  }, [apiUrl, type]);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  const options = filteredData.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  const handleSelectChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    onSelectChange(selectedValues, type);
  };

  // Custom option component with checkboxes
  const Option = ({ innerProps, label, isSelected }) => (
    <div {...innerProps}>
      <input type="checkbox" checked={isSelected} readOnly />
      {label}
    </div>
  );

  // Custom menu component with max height and overflow
  const Menu = (props) => {
    const maxHeight = 200;

    return (
      <components.Menu {...props}>
        <div style={{ maxHeight }}>{props.children}</div>
      </components.Menu>
    );
  };

  return (
    <div className="multi-select-dropdown" ref={selectRef}>
      <label>Select {`${type}`} </label>
      <Select
        isMulti
        options={options}
        value={selectedOptions.map((option) => ({
          value: option,
          label: option,
        }))}
        onChange={handleSelectChange}
        onInputChange={setSearchTerm}
        placeholder={`Select ${type}...`}
        components={{ Option, Menu }}
        menuIsOpen={isMenuOpen}
        onMenuOpen={() => setIsMenuOpen(true)}
        // onMenuClose={() => setIsMenuOpen(false)}
        blurInputOnSelect
      />
    </div>
  );
};

const countriesApiUrl = process.env.REACT_APP_API_URL + "/api/countries";
const statesApiUrl = process.env.REACT_APP_API_URL + "/api/states";
const citiesApiUrl = process.env.REACT_APP_API_URL + "/api/cities";
const jobtitlesApiUrl = process.env.REACT_APP_API_URL + "/api/jobtitles";
const industriesApiUrl = process.env.REACT_APP_API_URL + "/api/industries";
const companiesApiUrl = process.env.REACT_APP_API_URL + "/api/companies";
const employeeApiUrl = process.env.REACT_APP_API_URL + "/api/employee-size";


const AllIcp = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedJobTitles, setSelectedJobTitles] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const handleSelectChange = (selectedValues, type) => {
    if (type === "country") {
      setSelectedCountries(selectedValues);
    } else if (type === "state") {
      setSelectedStates(selectedValues);
    } else if (type === "city") {
      setSelectedCities(selectedValues);
    } else if (type === "job-title") {
      setSelectedJobTitles(selectedValues);
    } else if (type === "industry") {
      setSelectedIndustries(selectedValues);
    } else if (type === "company") {
      setSelectedCompanies(selectedValues);
    } else if (type === "employee-size") {
      setSelectedEmployees(selectedValues);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.post("/api/icp-search", {
        countries: selectedCountries,
        states: selectedStates,
        cities: selectedCities,
        industries: selectedIndustries,
        jobtitles: selectedJobTitles,
        companies: selectedCompanies,
        employee_size: selectedEmployees
      });

      // Handle the response data as needed
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <div className="row">
        <div
          className="col-12"
          style={{
            backgroundColor: "#fff",
            padding: "10px 20px",
            borderRadius: "10px",
          }}
        >
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">ICP Search</h1>
            <Link
              to={`/admin/dashboard`}
              className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              style={{
                backgroundColor: "#F5007E",
                borderColor: "#F5007E",
                color: "white",
                borderRadius: "12px",
              }}
            >
              <i className="fa fa-solid fa-arrow-left"></i> &nbsp; Go Back
            </Link>
          </div>
        </div>
      </div>

      <div className="row p-3">
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">ICP</h6>
          </div>
          <div className="card-body">
            {/* <form
              className="user mt-5" 
              onSubmit={handleSubmit}
              encType="multipart/form-data"
             > */}
            <div className="row">
              <div className="col-3">
                <MultiSelectDropdown
                  selectedOptions={selectedCountries}
                  onSelectChange={(values) =>
                    handleSelectChange(values, "country")
                  }
                  apiUrl={countriesApiUrl}
                  type="country"
                />
                {/* <div>Selected Options: {selectedCountries.join(", ")}</div> */}
              </div>

              <div className="col-3">
                <MultiSelectDropdown
                  selectedOptions={selectedStates}
                  onSelectChange={(values) =>
                    handleSelectChange(values, "state")
                  }
                  apiUrl={statesApiUrl}
                  type="state"
                />
                {/* <div>Selected Options: {selectedOptions.join(", ")}</div> */}
              </div>

              <div className="col-3">
                <MultiSelectDropdown
                  selectedOptions={selectedCities}
                  onSelectChange={(values) =>
                    handleSelectChange(values, "city")
                  }
                  apiUrl={citiesApiUrl}
                  type="city"
                />
                {/* <div>Selected Options: {selectedOptions.join(", ")}</div> */}
              </div>

              <div className="col-3">
                <MultiSelectDropdown
                  selectedOptions={selectedJobTitles}
                  onSelectChange={(values) =>
                    handleSelectChange(values, "job-title")
                  }
                  apiUrl={jobtitlesApiUrl}
                  type="job-title"
                />
                {/* <div>Selected Options: {selectedOptions.join(", ")}</div> */}
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-3">
                <MultiSelectDropdown
                  selectedOptions={selectedIndustries}
                  onSelectChange={(values) =>
                    handleSelectChange(values, "industry")
                  }
                  apiUrl={industriesApiUrl}
                  type="industry"
                />
                {/* <div>Selected Options: {selectedCountries.join(", ")}</div> */}
              </div>

              <div className="col-3">
                <MultiSelectDropdown
                  selectedOptions={selectedCompanies}
                  onSelectChange={(values) =>
                    handleSelectChange(values, "company")
                  }
                  apiUrl={companiesApiUrl}
                  type="company"
                />
                {/* <div>Selected Options: {selectedCountries.join(", ")}</div> */}
              </div>

              <div className="col-3">
                <MultiSelectDropdown
                  selectedOptions={selectedEmployees}
                  onSelectChange={(values) =>
                    handleSelectChange(values, "employee-size")
                  }
                  apiUrl={employeeApiUrl}
                  type="employee-size"
                />
                {/* <div>Selected Options: {selectedCountries.join(", ")}</div> */}
              </div>

              <div className="col-3">
                <button
                  className="btn btn-primary btn-user mt-4"
                  style={{
                    backgroundColor: "#F5007E",
                    borderColor: "#F5007E",
                    fontSize: "16px",
                    padding: "2% 8%",
                  }}
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <img
                      src={loadingGif}
                      alt="Loading"
                      style={{ width: "20px", height: "20px" }}
                    />
                  ) : (
                    "Save Now"
                  )}
                </button>
              </div>
            </div>
            {/* </form> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllIcp;
