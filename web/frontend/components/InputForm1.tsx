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
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [selectOptions, setSelectOptions] = useState([{label: 'SELECT', value: ''},]);
  const [isPaused, setIsPaused] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(formValues.template);


    

 
  const handleFieldChange = (field, value) => {
    if (field === 'template') {
      setSelectedTemplate(value); // Update the selected template
      setFormValues(prevValues => ({
      ...prevValues,
      [field]: value, // Update the "template" field in formValues
    }));
    }else if (field === 'title') {
      // Automatically generate the handle from the title
      const handle = value.replace(/ /g, '-');
      setFormValues((prevValues) => ({
        ...prevValues,
        [field]: value,
        handle, // Update the handle here
        metatitle: value,
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
  
  // const themeFetch = async() =>{
  //   try{
  //       const response = await fetch("/admin/api/themes", {
  //         method: "GET",
  //         headers: {
  //           'Content-Type': 'application/json', // Set content type to JSON
  //         },
  //       });
  //       const responseData = await response.json();
  //       console.log(responseData);
  //   }catch(err){

  //   }
  // }
  const themeFetch = async () => {
    try {
      const response = await fetch("/api/themes", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        },
      });
  
      const responseData = await response.json();
       // Find the main theme ID from the themes data
    const mainTheme = responseData.themes.data.find(theme => theme.role === 'main');
    
    if (mainTheme) {
      const mainThemeId = mainTheme.id;
      console.log("Main Theme ID:", mainThemeId);

      // Now that you have the mainThemeId, make the API call for assets
      await fetchThemeAssets(mainThemeId);
    } else {
      console.log("Main theme not found.");
    }
  } catch (err) {
    console.error(err);
  }
  };
  
  
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
    

// const createPages = async () => {
//   for (const cityName of cityNames) {
    
//     await handlesubmit1(cityName);
//   }
//   };
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

  const fetchThemeAssets = async (themeId) => {
    try {
      const response = await fetch(`/api/themes/${themeId}/assets`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch theme assets. Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      // const data = responseData.themeAsset.data;
      // const filteredKeys= data
      //       .filter(item => item.key.startsWith("templates/page") && item.key.endsWith(".liquid"))
      //       .map(item => item.key);

      //       setFilteredKeys(filteredKeys);
      //       console.log(filteredKeys);

      // console.log(responseData); // Log the theme assets response
      if (responseData.themesAsset && Array.isArray(responseData.themesAsset.data)) {
        const data = responseData.themesAsset.data;
        const filteredKeys = data
          .filter(item => item.key.startsWith("templates/page") && item.key.endsWith(".liquid"))
          .map(item => item.key);
          
          convertToSelectOptions(filteredKeys);
        console.log(filteredKeys); // This will log an array of filtered keys
      } else {
        console.error("Invalid response data structure for theme assets");
      }
    } catch (err) {
      console.error(err);
    }
  };
  function convertToSelectOptions(filteredKeys) {
    const selectOptions = filteredKeys.map(key => {
      const matches = key.match(/templates\/page\.(.*?)\.liquid/);

      if (matches && matches.length ===2){
        const value = matches[1];
        return {
          label: value, // You can customize the label as needed
          value: value,
        };
      }
      return null;
    });
    // You can do something with selectOptions here or return it if needed
    selectOptions.unshift({
      label: 'SELECT PAGE TEMPLATE', // Customize the label as needed
      value: '',
    });

    const validOptions = selectOptions.filter(option => option !== null);
    setSelectOptions(validOptions);
    
  }
  // const selectOptions = [
  //   {
  //     label: "templates/page.teeth-straightening-treatment.liquid",
  //     value:"templates/page.teeth-straightening-treatment.liquid"
  //   },
  // ];
  const themeAsset = async () => {
    try {
      const response = await fetch("/api/themes/161308541223/assets", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch theme assets. Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log(responseData); // Log the theme assets response
    } catch (err) {
      console.error(err);
    }
  };


//   const handleFetchTheme = async () => {
//     themeFetch()
//     .then((response) => {
//       // You can access the response data here
//       const mainTheme = response.themes.data.find(theme => theme.role === 'main');
//       if (mainTheme) {
//         const mainThemeId = mainTheme.id;
//         console.log("Main Theme ID:", mainThemeId);
        
//       } else {
//         console.log("Main theme not found.");
//       }
//     })
//     .catch((error) => {
//       console.error("Failed to fetch themes:", error);
//     })
// }
const handlePauseToggle = () => {
  setIsPaused(!isPaused);
};

const handleCancel = () => {
 // Abort the operation when the cancel button is clicked
    setIsCancelled(true);  // Set the cancellation flag
};



  return (
      <div>
        <Button onClick={themeFetch}>Fetch Page Template</Button>
        {/* <Button onClick={fetchThemeAssets1}>Fetch Theme Assets</Button> */}
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
        <Select
        label="Select Page Template"
        options={selectOptions}
        onChange={(value) => handleFieldChange('template', value)}
        value={selectedTemplate}
        />
        {/* <TextField
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
        /> */}
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
          readOnly
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
    <div style={{ marginBottom: '20px' }}>
    
    </div>
  </div>
);
}

