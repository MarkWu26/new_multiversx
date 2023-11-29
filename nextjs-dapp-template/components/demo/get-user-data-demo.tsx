'use client';


import { useAccount, /* useConfig */ } from '@useelven/core';

import { useEffect, useRef } from 'react';
import axios from 'axios';

export const GetUserDataDemo = () => {
  const { address,  } = useAccount();
  /* const { explorerAddress } = useConfig(); */
  console.log('the address is: ', address)



  const fetchedOnce = useRef<boolean>(false);
  useEffect(() => {
    const sendDataToServer = async () => {
      try {
        // Make a POST request to your server endpoint
        const response = await axios.post('http://localhost:3001/save', { address }, {
        withCredentials: true,
      });
        // Handle the response if needed
        console.log('Server response:', response.data);
      } catch (error) {
        console.error('Error sending data to the server:', error);
      }
    };
    if (!fetchedOnce.current) sendDataToServer();
    return () => {
      fetchedOnce.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
    
    </>
  );
};
