'use client'

import type { NextPage } from 'next';
/* import { SimpleDemo } from '@/components/demo/simple-demo';

import { GetLoggingInStateDemo } from '@/components/demo/get-logging-in-state-demo';
import { GetLoginInfoDemo } from '@/components/demo/get-login-info-demo';*/
import { Authenticated } from '@/components/elven-ui/authenticated'; 
import { GetUserDataDemo } from '@/components/demo/get-user-data-demo';
import { CardContent, Card } from '@/components/ui/card';
import { LoginModalButton } from '@/components/elven-ui/login-modal-button';
import { useState, useEffect } from 'react';
import { DiscordLogin } from '@/components/elven-ui/discord-login';
import axios from 'axios';
/* import { useRouter } from 'next/router'; */
import { IoHeartSharp } from "react-icons/io5";
import { GoLink } from "react-icons/go";
import { useLogin,/*  useLogout */ } from '@useelven/core';
import CustomProgressBar from '@/components/ui/Progress-bar';


const Home: NextPage = () => {

const [isStepTwo, setIsStepTwo] = useState(false)
const [url, setUrl] = useState(null)
const { isLoggedIn } = useLogin();
console.log('logged in: ', isLoggedIn)
console.log('step2?', isStepTwo)


useEffect(()=>{
  const getUrl = async() => {
    try {
      const url = await axios.get('http://localhost:3001/', {
        withCredentials: true
      })  
      console.log('the url is: ', url.data.link)
      setUrl(url.data.link)
    } catch (error) {
      console.error(error)
    }
  }

  getUrl();
}, [])

const [hasEffectRun, setHasEffectRun] = useState(false);



useEffect(() => {
  if (!hasEffectRun) {
    // Check if the URL contains the success parameter
    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');

    if (successParam === 'true') {
      setIsStepTwo(true);
    }
    
    setHasEffectRun(true);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Run this effect once when the component mounts

const progressValue = isStepTwo ? (isLoggedIn ? 100 : 50) : 0;
console.log(progressValue)

  return (
    <>
     <>
    <div className="w-full h-full flex  items-center justify-center overflow-hidden ">
 
      <Card className="mb-4 mt-32 w-[600px] py-5 flex items-center justify-center shadow-2xl">
        <CardContent className=" mb-4 flex-col items-center justify-center w-full">
          <div className='text-center items-center justify-center mb-5 mt-10 text-[18px]  sm:text-[20px] md:text-[20px] lg:text-[24px] font-medium'>
            <span className='flex gap-x-2 ml-3 items-center justify-center'><GoLink/> Link your accounts.</span>
          </div>
        <div className='text-center flex flex-col text-[12px] mb-[88px] mt-5 sm:text-[13px] md:text-[14px]'>
        <span className=''>In order to use TweetShift you must link your Twitter account to the bot. </span>
        <span>You will be asked to sign into Discord, so we know who you are, then into Twitter</span>
        </div>


          <div className="mb-12 w-full justify-center px-16 ">
          <CustomProgressBar progressValue={progressValue} isStepTwo={isStepTwo} isLoggedIn={isLoggedIn}/>
          </div>

          {isLoggedIn && (
          <div  className='mt-[-12px] flex w-full items-center justify-center mb-4 text-gray-400'>
            <span className=" text-[12px] md:text-[14px] lg:text-[16px]">Successfully registered. You can now log out.</span>
          </div>
          )}
        
         
          <div className="mb-4 w-full flex items-center justify-center">
          {isStepTwo ? <LoginModalButton setIsStepTwo={setIsStepTwo}/> :   <DiscordLogin url={url ?? undefined} />}
          </div>

          {/* <div className='w-full px-5'>
           
          </div> */}
         
         
        </CardContent>
      </Card>
     
      <a className='flex justify-center items-center w-full bottom-5 absolute cursor-pointer'
      href='https://twitter.com/MultiversX' target="_blank"
      >
        <span className="flex items-center gap-x-1 border-b border-b-gray-300 sm:text-[10px] text-[8px] lg:text-[0.75rem] font-normal"> Made with <IoHeartSharp/> by Lucky Birds Labs</span>
         
      </a>
      
      </div>
    </> 
    <Authenticated
        spinnerCentered
       /*  fallback={
          <div className="font-bold  text-center mt-8 text-[17px] sm:text-[19px] lg:text-[24px]">
            Connect your wallet!
          </div>
        } */
      >
       
        <div className="flex mb-4 gap-4 lg:text-[24px] sm:text-[19px] text-[16px]flex-wrap justify-center items-center w-full flex-col lg:flex-row">
          
          <GetUserDataDemo />
        </div>
       
      </Authenticated>
      
    </>
  );
};

export default Home;
