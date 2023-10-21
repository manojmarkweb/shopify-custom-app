
import React, { useState } from 'react';
import { Select, LegacyCard, FormLayout,  LegacyStack, Divider, AlphaCard, Text, ButtonGroup, Button } from '@shopify/polaris';
import CityTag from './CityTag';
import InputForm1 from './InputForm1';
import {cityNamesUSA, cityNamesCANADA, cityNamesAustralia} from './cityList';
import CityNameOverLay from './CityNameOverLay1';

const countryOptions = [
  {label: 'SELECT', value: ''},
  { label: 'USA', value: 'USA' },
  { label: 'CANADA', value: 'CANADA' },
  { label: 'AUSTRALIA', value: 'AUSTRALIA' },
];

function ParentComponent() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [SelectedCity, setSelectedCity] = useState(['']);
  const [SelectedCityDescription, setSelectedCityDescription] = useState('');
  const [selectedCountryFlag, setSelectedCountryFlag]= useState(false);
 

  const handleCountryChange = (city) => {
    setSelectedCountry(city);
    if(city === 'USA'){
      setSelectedCity(cityNamesUSA);
      setSelectedCountryFlag(true);
      setSelectedCityDescription("300+ City of USA Added");
      
    }else if(city === 'CANADA'){
      setSelectedCity(cityNamesCANADA);
      setSelectedCountryFlag(true);
      setSelectedCityDescription("100+ City of CANADA Added");
      
    }else if(city === 'AUSTRALIA'){
      setSelectedCity(cityNamesAustralia);
      setSelectedCountryFlag(true);
      setSelectedCityDescription("100+ City of AUSTRALIA Added");
      
    }else{
      setSelectedCountryFlag(false);
    }
  };
  

  return (
    <LegacyCard sectioned>
      <div style={{paddingBottom:'20px',}}>
      <FormLayout>
          <Select
            label="Select City"
            options={countryOptions}
            value={selectedCountry}
            onChange={handleCountryChange}
          />
          {selectedCountryFlag ?<AlphaCard>
        <div style={{color:'red',}}>
        <Text as="h2" variant="bodyMd">{SelectedCityDescription}<span><CityNameOverLay cityNames={SelectedCity} selectedCountry={selectedCountry}/></span></Text>
        </div>
      </AlphaCard>:''}
      </FormLayout>
      </div>
      
      {/* <CityTag cityNames={SelectedCity}  /> */}
      <InputForm1 cityNames={SelectedCity} />
      
    </LegacyCard>
  );
}

export default ParentComponent;
