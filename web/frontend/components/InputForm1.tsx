import React  from "react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

import {Form, FormLayout, TextField, Button, Select, ProgressBar, ButtonGroup} from '@shopify/polaris';

import {useState, useCallback, useEffect} from 'react';

export default function InputForm1({ cityNames }) {
  const characterLimit = 158;
  const fetch = useAuthenticatedFetch();
  const [formValues, setFormValues] = useState({
    title: '',
    author: '',
    handle: '',
    template: '',
    metafield: '',
    metatitle: '',
    metadescription: '',
  });
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalPending, setTotalPending] = useState(cityNames.length);
  const [progress, setProgress] = useState(0);
  const [submittedData, setSubmittedData] = useState({});
  const handleFieldChange = (field, value) => {
    if (field === 'title') {
      // Automatically generate the handle from the title
      const handle = value.replace(/ /g, '-');
      setFormValues((prevValues) => ({
        ...prevValues,
        [field]: value,
        handle, // Update the handle here
      }));
    }else if(field === 'metadescription'){
        if((value.length <= characterLimit)){
          setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
          }));
        }

    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [field]: value,
      }));
    }
  };


  const options = [
    {label: 'Markweb', value: 'markweb'},
    {label: 'Manoj', value: 'manoj'},
    {label: 'Kaushal', value: 'kaushal'},
  ];
  
  useEffect(() => {
    // Calculate the progress based on the total completed and pending
    if (cityNames.length > 0) {
      const newProgress = (totalCompleted / cityNames.length) * 100;
      setProgress(newProgress);
    }
  }, [totalCompleted, cityNames]);
  const themeFetch = async() =>{
    try{
        const response = await fetch("/api/themes", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json', // Set content type to JSON
          },
        });
        const responseData = await response.json();
        console.log(responseData);
    }catch(err){

    }
  }

  useEffect(() =>{
      
    themeFetch();
    
  }, []);
  
const handlesubmit1 = async (cityName) =>{
  const title1 =  formValues.title.replace('${cityName}', cityName);
  const author1 = formValues.author.replace('${cityName}', cityName);
  const handle1 = formValues.handle.replace('${cityName}', cityName);
  const template1 = formValues.template.replace('${cityName}', cityName);
  const metafield1 = formValues.metafield.replace('${cityName}', cityName);
  const metatitle1 = formValues.metatitle.replace('${cityName}', cityName);
  const metadescription1 = formValues.metadescription.replace('${cityName}', cityName);
   
  const Formdata ={
        title: title1,
        author: author1,
        handle: handle1,
        template : template1,
        metafield : metafield1,
        metatitle : metatitle1,
        metadescription : metadescription1,
      }
      const Pagesfetch = async () => {
        try{
          const response = await fetch("/api/pages",{
            method: "POST",
            headers: {
              'Content-Type': 'application/json', // Set content type to JSON
            },
            body: JSON.stringify(Formdata),
          });
          const responseData = await response.json();
          if (responseData.success) {
            setTotalCompleted((prevTotalCompleted) => prevTotalCompleted + 1);
            setTotalPending((prevTotalPending) => prevTotalPending - 1);
          } else {
            console.log("Failed to create page:", responseData.error);
          }
        }catch(err){
          console.log(err)
        }
      }
      Pagesfetch();
      await new Promise(resolve => setTimeout(resolve, 2000));

}
const createPages = async () => {
  for (const cityName of cityNames) {
    
    await handlesubmit1(cityName);
  }
   
  };
  const handleReset = async () =>{
    setProgress(0);
    setFormValues({
      title: '',
      author: '',
      handle: '',
      template: '',
      metafield: '',
      metatitle: '',
      metadescription: '',
    });
  }
  
  const characterCount = formValues.metadescription.length;
  
  return (
      <div>
    <Form onSubmit={createPages}>
      <FormLayout>
        <TextField
          value={formValues.title}
          onChange={(value) => handleFieldChange('title', value)}
          label="Title"
          type="text"
          autoComplete=""
          helpText={
            <span>
              Enter Title For Page
            </span>
          }
        />
           <TextField
          value={formValues.handle}
          label="Handle"
          readOnly
          type="text"
          autoComplete=""
        />
        <Select
        label="Select Author"
        options={options}
        onChange={(value) => handleFieldChange('author', value)}
        value={formValues.author}
        />
        <TextField
          value={formValues.template}
          onChange={(value) => handleFieldChange('template', value)}
          label="Page_Template_Suffix"
          type="text"
          autoComplete=""
          helpText={
            <span>
              Enter Template Name For Page
            </span>
          }
        />
        <TextField
          value={formValues.metafield}
          onChange={(value) => handleFieldChange('metafield', value) }
          label="Metafield Name"
          type="text"
          autoComplete=""
          helpText={
            <span>
              Enter metafield Name For Page
            </span>
          }
        />
        <TextField
          value={formValues.metatitle}
          onChange={(value) => handleFieldChange('metatitle', value)}
          label="Meta Title"
          type="text"
          autoComplete=""
          helpText={
            <span>
              Enter Meta Title For Page
            </span>
          }
        />
         <TextField
          value={formValues.metadescription}
          onChange={(value) => handleFieldChange('metadescription', value)}
          label="Meta Descriptions"
          type="text"
          autoComplete=""
          multiline={4}
          helpText={
            <span>
              Enter Meta Descriptons For Page
            </span>
          }
        />
        <p>
        Character Count: {characterCount} / Character Limit: {characterLimit}
      </p>
      <div style={{ marginBottom: '20px' }}>
      <ButtonGroup >
        <Button submit>Submit</Button>
        <Button onClick={handleReset}>Reset</Button>
      </ButtonGroup>
      </div>
      </FormLayout>
    </Form>
    <ProgressBar progress={progress} size="large" />
        <p>Completed: {totalCompleted}</p>
        
    
    
    
  </div>
);
}

