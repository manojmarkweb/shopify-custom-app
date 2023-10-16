import React from 'react';
import {Tag, LegacyStack, Card} from '@shopify/polaris';




function CityTag( { cityNames }) {
 

  const tagMarkup = cityNames.map((option) => (
      <Tag key={option}>{option}</Tag>
      ));
    
  

  return <Card><LegacyStack spacing="tight">{tagMarkup}</LegacyStack></Card>;
}


export default CityTag;