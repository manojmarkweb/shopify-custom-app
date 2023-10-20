import React from 'react';
import {Button, Frame, Modal, TextContainer} from '@shopify/polaris';
import {useState, useCallback} from 'react';

export default function CityNameOverLay({ cityNames, selectedCountry }) {
  const [active, setActive] = useState(false);
  

  const handleChange = useCallback(() => setActive(!active), [active]);


  const titleBar = `${selectedCountry} City List`; 
  const activator = <Button onClick={handleChange}>Click here to See Full List</Button>;

  return (
    
      
        <Modal
          activator={activator}
          open={active}
          title= {titleBar}
          onClose={handleChange}
          
        >
          {cityNames.map((option, index) => (
              <Modal.Section key={index}>
                <TextContainer>
                  <p>
                  {index+1}. {option}
                  </p>
                </TextContainer>
              </Modal.Section>
            ))}
        </Modal>
      
    
  );
}