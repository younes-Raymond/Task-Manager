import React, { useState ,useEffect } from 'react';
import { Typography, Container, Paper, Grid, FormControlLabel, Switch, MenuItem, Select } from '@mui/material';
import SettingsSuggestTwoToneIcon from '@mui/icons-material/SettingsSuggestTwoTone';
import axios from 'axios';

function SettingsComponent() {

  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); 
  const [userGeolocation, setUserGeolocation] = useState(null);  
  const [changePassword, setChangePassword ] = useState(false);
  const [helpAndSupport, setHelpAndSupport] = useState(false)
  const [countryCode, setCountryCode] = useState(null);
  const [countryInfo, setCountryInfo ] = useState(null);

  
  const getInfoOfCountry = async (lat, lon) => {
    try {
      const res = await axios.get(`https://restcountries.com/v2/all?lat=${lat}&lng=${lon}`);
      console.log(res.data)
      return res.data;
    } catch (error) {
      console.error('Error fetching country data:', error);
      return null;
    }
  };
  


  const getUserGeolocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const language = latitude > 36 && latitude < 43 && longitude > -10 && longitude < 4 ? 'es' : 'en';
          setSelectedLanguage(language);
          setUserGeolocation(language === selectedLanguage ? null : language);

          const countryData = await getInfoOfCountry(latitude, longitude);
          if (countryData) {
            const countryCode = countryData[0]?.alpha2Code.toLowerCase();
            setCountryCode(countryCode);
            setCountryInfo(countryData[0]); // Store country information
          }
        },
        error => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.log('Geolocation is not available in this browser.');
    }
  };


  useEffect(() => {
    getUserGeolocation();
  }, []);

  const handleNotificationToggle = () => {
    setNotificationEnabled(!notificationEnabled);
  };

  const handleDarkModeToggle = () => {
    setDarkModeEnabled(!darkModeEnabled);

  };
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };
  
  const handleChangePasswordToggle = (event) => {
    setChangePassword(event.target.value)
  }

  const handleHelpAndSupportToggle = () => {
    setHelpAndSupport(!helpAndSupport)
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationEnabled}
                  onChange={handleNotificationToggle}
                  color="primary"
                />
              }
              label="Enable Notifications"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Additional Settings
            </Typography>
        
            <FormControlLabel
              control={
                <Switch
                  checked={darkModeEnabled}
                  onChange={handleDarkModeToggle}
                  color="primary"
                />
              }
              label="Dark Mode"
            />


<FormControlLabel
  control={
    <Select
      value={selectedLanguage}
      onChange={handleLanguageChange}
    >
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="fr">French</MenuItem>
      <MenuItem value="ar">Arabic</MenuItem>
    </Select>
  }
  label="Language and Localization"
/>

               <FormControlLabel
              control={
                <Switch
                  checked={changePassword}
                  onChange={handleChangePasswordToggle}
                  color="primary"
                />
              }
              label="Password and Security"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={helpAndSupport}
                  onChange={handleHelpAndSupportToggle}
                  color="primary"
                />
              }
              label="Help and Support"
            />    
 <FormControlLabel
        control={
          <Switch
            checked={userGeolocation !== null}
            onChange={getUserGeolocation}
            disabled={selectedLanguage !== 'en' && selectedLanguage !== 'es'}
          />
        }
        label="Automatic Geolocation Language"
      />
            {countryInfo && (
        <div>
          <h2>Country Information</h2>
          <img src={countryInfo.flags.svg} alt={`${countryInfo.name} Flag`} width="100" height="60" />
          <p>Country: {countryInfo.name.common}</p>
          <p>Capital: {countryInfo.capital}</p>
          <p>Region: {countryInfo.region}</p>
        </div>
      )}   
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
  
}

export default SettingsComponent;
