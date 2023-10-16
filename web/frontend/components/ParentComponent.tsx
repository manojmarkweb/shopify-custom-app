
import React, { useState } from 'react';
import { Select, LegacyCard, FormLayout,  LegacyStack, Divider } from '@shopify/polaris';
import CityTag from './CityTag';
import InputForm1 from './InputForm1';
import {cityNamesUSA, cityNamesCANADA, cityNamesAustralia} from './cityList';
import InputFormNew from './InputFormNew';

const countryOptions = [
  { label: 'USA', value: 'USA' },
  { label: 'CANADA', value: 'CANADA' },
  { label: 'AUSTRALIA', value: 'AUSTRALIA' },
];

function ParentComponent() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [SelectedCity, setSelectedCity] = useState(['']);

  const handleCountryChange = (city) => {
    setSelectedCountry(city);
    if(city === 'USA'){
      setSelectedCity(cityNamesUSA);
    }else if(city === "CANADA"){
      setSelectedCity(cityNamesCANADA);
    }else if(city === 'AUSTRALIA'){
      setSelectedCity(cityNamesAustralia);
    }
  };

  return (
    <LegacyCard sectioned>
      <FormLayout>
        
          <Select
            label="Select City"
            options={countryOptions}
            value={selectedCountry}
            onChange={handleCountryChange}
          />
       
      </FormLayout>
      <CityTag cityNames={SelectedCity}  />
      <InputForm1 cityNames={SelectedCity} />
      {/* <InputFormNew cityNames={SelectedCity} /> */}
    </LegacyCard>
  );
}

export default ParentComponent;
