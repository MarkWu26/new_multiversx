// ProgressBarComponent.tsx
import React from 'react';
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import Image from 'next/image';
import { BsDatabaseFillCheck } from "react-icons/bs";
import { InlineIcon } from '@iconify/react';

interface CustomProgressBarProps {
    progressValue : number;
    isStepTwo: boolean;
    isLoggedIn: boolean;

}

const CustomProgressBar: React.FC<CustomProgressBarProps> = ({progressValue, isStepTwo, isLoggedIn}) => {
    console.log('the progress value is:', progressValue)
  return (
    <ProgressBar percent={progressValue}>
      <Step>
        {({ accomplished, /* index */ }) => (
            <div className={`flex items-center flex-col ${isStepTwo ? 'gap-y-3' : 'gap-y-6'}`}>
        <div className={`${isStepTwo ? 'mt-[-46px]' : 'mt-[-58px]'}`}>
          <Image
            src="/discord.svg" // Path to your Discord SVG file
            alt="Discord"
            width={50}
            height={50}
          />
        </div>
        <div className={`indexedStep ${accomplished ? 'accomplished' : null}`}>
        {isStepTwo ? (
          <span className=' '>
          <InlineIcon className="rounded-[50%] items-center justify-center bg-red-300 text-[38px]" icon="bx:bx-check" />{' '}
        </span>
        ) : (
            <span className='rounded-[50%]  bg-red-300 px-4 py-2'>
                1
          </span>
        )}
        </div>
      </div>
        )}
      </Step>
      <Step>
        {({ accomplished, /* index */ }) => (
         
          <div className={`flex items-center flex-col ${accomplished ? 'gap-y-2' : 'gap-y-4'}`}>
          <div className={`${accomplished ? 'mt-[-52px]' : 'mt-[-62px]'}`}>
          <Image
              src={`/x-white.png`}
              alt={`MultiversX`}
              width={50} // set the width according to your design
              height={50} // set the height according to your design
            />
          </div>
          <div className={`indexedStep ${accomplished ? 'accomplished' : null}`}>
          {(!isLoggedIn && isStepTwo) || accomplished ? (
          <span className=' '>
            <InlineIcon className="rounded-[50%] items-center justify-center bg-red-300 text-[38px]" icon="bx:bx-check" />{' '}
          </span>
        ) : (
            <span className='rounded-[50%]  bg-red-300 px-4 py-2'>
                2
          </span>
        )}
          </div>
        </div>
        )}
      </Step>
      <Step>
        {({ accomplished, /* index */ }) => (
           <div className={`flex items-center flex-col ${accomplished ? 'gap-y-3' : 'gap-y-6'}`}>
           <div className={`${accomplished ? 'mt-[-54px]' : 'mt-[-62px]'}`}>
                <BsDatabaseFillCheck className="text-[45px]"/>
           </div>
           <div className={`indexedStep ${accomplished ? 'accomplished' : null}`}>
           {accomplished ? (
          <span className=' '>
          <InlineIcon className="rounded-[50%] items-center justify-center bg-red-300 text-[38px]" icon="bx:bx-check" />{' '}
        </span>
        ) : (
            <span className='rounded-[50%]  bg-red-300 px-4 py-2'>
                3
          </span>
        )}
           </div>
         </div>
        )}
      </Step>
    </ProgressBar>
  );
};

export default CustomProgressBar;
