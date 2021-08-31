import React, { useState, useEffect } from 'react';
import {MenuItem, FormControl,Select, Card, CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import './App.css';
import Table from './Table';
import {sortData, prettyPrintStat} from './util'; 
import LineGraph from './LineGraph';
import Map from './Map';
import 'leaflet/dist/leaflet.css';
import numeral from 'numeral';
import VaccinesGraph from './HorizontalBar';

//State = How to write a variable in REACT <<<<<<


  // https://disease.sh/v3/covid-19/countries

  //useEffect = Runs a piece of code based on a given condicion



function App() {
  const [countries, setCountries] = useState( [] );
  const [country, setCountry] = useState( 'worldwide' );
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  // const [mapCenter, setMapCenter] = useState({ lat: 40.80746, lng: 3.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data); 
    });
  }, []);

  useEffect(() => {
    //The code inside here will run once when the component loads and not again
    //async -> send a request, wait for it, do something with info
    
    const getCountriesData = async () => {
      await fetch ('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country, //United States, United Kingdom 
            value: country.countryInfo.iso2 //UK,US,FR
          }));
          

          let sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      });
    };
    
    getCountriesData();
  }, []);



  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch (url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
      
      // All of the data from the country response
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4);
      })
  };
  return (

    <div className="App">
      <div className='app__left'>
          {/*Header*/}
        {/*Title + Select input dropdown field*/}

        <div className='app__header'>

          <h1>Covid-19 Tracker</h1>

          <FormControl className='app__dropdown'>
            <Select variant = 'outlined' onChange={onCountryChange} value={country}>
              {/* Loop through all the countries and show a drop down list of the options  */}
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value = {country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

        </div>  

        <div className='app__stats'>
          <InfoBox isRed active={casesType === "cases"} onClick={(e) => setCasesType('cases')} title='Coronavirus cases' cases={prettyPrintStat(countryInfo.todayCases)} total={countryInfo.cases}></InfoBox>

          <InfoBox active={casesType === "recovered"} onClick={(e) => setCasesType('recovered')} title='Recovered' cases={prettyPrintStat(countryInfo.todayRecovered)} total={countryInfo.recovered}></InfoBox>

          <InfoBox isRed active={casesType === "deaths"} onClick={(e) => setCasesType('deaths')} title='Deaths' cases={prettyPrintStat(countryInfo.todayDeaths)} total={countryInfo.deaths}></InfoBox>
        </div>     
      
        {/* Map */}
        <Map casesType={casesType} countries = {mapCountries} center={mapCenter} zoom={mapZoom} />

        {/* total vacunados */}
        
        <VaccinesGraph></VaccinesGraph>

      </div>

      <Card className='app__right'>
        <CardContent>
          
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}></Table>


          {/* Graph */}
          <h3>Worldwide new {casesType}</h3>  
          
          <LineGraph casesType={casesType}></LineGraph>


        </CardContent>
      </Card>
    </div>
  );
}

export default App;

