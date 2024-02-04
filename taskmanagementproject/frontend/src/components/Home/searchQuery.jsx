import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Button,
    TextField,
    MenuItem
  } from '@mui/material';

  function SearchQueryGenerator() {
      const [site, setSite] = useState('');
      const [jobTitle, setJobTitle] = useState('');
      const [country, setCountry] = useState('');
      const [city, setCity] = useState('');
      const [emailDomain, setEmailDomain] = useState('');
      const [searchQueryURL, setSearchQueryURL] = useState('');
  
      const generateSearchQueryURL = () => {
          const sitePart = `site:${site}/in/`;
          const jobTitlePart = `"${jobTitle}"`;
          const locationPart = `"${city}, ${country}"`;
          const emailDomainPart = `"${emailDomain}"`;
  
          const query = `${sitePart} ${jobTitlePart} ${locationPart} ${emailDomainPart}`;
          setSearchQueryURL(query);
      };
  
      return (
          <div>
              <TextField
                  label="Site"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  fullWidth
              />
              <TextField
                  label="Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  fullWidth
              />
              <TextField
                  label="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  fullWidth
              />
              <TextField
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  fullWidth
              />
              <TextField
                  select
                  label="Email Domain"
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  fullWidth
              >
                <MenuItem value="gmail.com">Gmail</MenuItem>
                <MenuItem value="yahoo.com">Yahoo</MenuItem>
                <MenuItem value="outlook.com">Outlook</MenuItem>
                <MenuItem value="aol.com">AOL</MenuItem>
                <MenuItem value="icloud.com">iCloud</MenuItem>
              </TextField>
              <Button variant="contained" color="primary" onClick={generateSearchQueryURL}>
                  Generate Search Query
              </Button>
              <br />
              <br />
              {searchQueryURL && (
                  <TextField
                      label="Search Query URL"
                      value={searchQueryURL}
                      fullWidth
                      InputProps={{
                          readOnly: true,
                      }}
                  />
              )}
          </div>
      );
  }
  
  export default SearchQueryGenerator;
  