// Login component wraps all auth services in one place
// You can always use only one of them if needed
import { useCallback, memo, useState } from 'react';
import { useLogin, LoginMethodsEnum } from '@useelven/core';
import { WalletConnectQRCode } from './walletconnect-qr-code';
/* import { WalletConnectPairings } from './walletconnect-pairings'; */
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { LedgerAccountsList } from './ledger-accounts-list';
import { getLoginMethodDeviceName } from '@/lib/getSigningDeviceName';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { FaLock } from "react-icons/fa";

interface LoginComponentProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // other props as needed
}

export const LoginComponent: React.FC<LoginComponentProps> = memo(({setIsOpen}) => {
  const {
    login,
    isLoggingIn,
    error,
    walletConnectUri,
    getHWAccounts,
   /*  walletConnectPairingLogin,
    walletConnectPairings,
    walletConnectRemovePairing, */
  } = useLogin();

  const [loginMethod, setLoginMethod] = useState<LoginMethodsEnum>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  console.log('is the modal open? ', isModalOpen)

  const handleLogin = useCallback(
    (type: LoginMethodsEnum, ledgerAccountsIndex?: number) => () => {
      setLoginMethod(type);
      login(type, ledgerAccountsIndex);

      if(type===LoginMethodsEnum.walletconnect){
        console.log('HAHAHAH')
        setIsModalOpen(true)
        console.log('test', isModalOpen)
      }
    },
    [login]
  );

  const handleLedgerAccountsList = useCallback(() => {
    setLoginMethod(LoginMethodsEnum.ledger);
  }, []);

  const resetLoginMethod = useCallback(() => {
    setLoginMethod(undefined);
  }, []);

  const ledgerOrPortalName = getLoginMethodDeviceName(loginMethod!);

  if (error)
    return (
      <div className="flex flex-col">
        <div className="text-center">{error}</div>
        <div className="text-center pt-4 font-bold">Close and try again</div>
      </div>
    );

    const onCloseComplete = (open: boolean) => {
      if (!open) {
        setIsOpen(false);
        setTimeout(() => {
         /*  setLoggingInState('error', ''); */
        }, 1000);
      }
    };

  return (
    <>
      {isLoggingIn ? (
        <div className="flex inset-0 z-50 items-center justify-center min-h-[200px]">
          <div>
            {ledgerOrPortalName ? (
              <>
                <div className="text-lg">Confirmation required</div>
                <div className="text-sm">Approve on {ledgerOrPortalName}</div>
              </>
            ) : null}
            <div className="flex items-center justify-center">
              <Spinner size="40" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center px-8">
          <Button
            className="w-full select-none h-auto"
            variant="outline"
            onClick={handleLogin(LoginMethodsEnum.walletconnect)}
          >
            xPortal Mobile App
          </Button>
          <Button
            className="w-full select-none h-auto"
            variant="outline"
            onClick={handleLogin(LoginMethodsEnum.extension)}
          >
            MultiversX Browser Extension
          </Button>
          <Button
            className="w-full select-none h-auto"
            variant="outline"
            onClick={handleLogin(LoginMethodsEnum.wallet)}
          >
            MultiversX Web Wallet
          </Button>
          <Button
            className="w-full select-none h-auto"
            variant="outline"
            onClick={handleLedgerAccountsList}
          >
            Ledger
          </Button>
          <Button
            className="w-full select-none h-auto"
            variant="outline"
            onClick={handleLogin(LoginMethodsEnum.xalias)}
          >
            xAlias
          </Button>
        </div>
      )}

      {loginMethod === LoginMethodsEnum.walletconnect && walletConnectUri && (
        <>
          <Dialog open={isModalOpen} onOpenChange={onCloseComplete}>
      
      <DialogContent className="max-w-lg sm:max-w-lg bg-white dark:bg-zinc-950 p-0 flex items-center justify-center flex-col">
        <div className="px-[60px] pt-12 flex justify-center items-start">
       
          <FaLock className="text-[#23F7DD] items-center mt-[1px] absolute text-[12px] py-0 px-0 left-[85px]"/>
         
       
            <span className='text-[12px] text-center items-center flex-row text-gray-300'>
              <span> Scam/Phishing verification: </span>
        <span className='text-[#23F7DD] font-bold'> 
         https://</span>saturn.projectx.mx<br/>

        Please confirm that you are indeed connecting to
        <span className='text-[#23F7DD] font-bold'> https://</span>
        saturn.projectx.mx for
        <span className='text-[#23F7DD] font-bold'> 24 hours <br/> </span>
        and that you trust this site. You might be sharing sensitive data.
        <span className='text-[#23F7DD] font-bold'> Learn more </span></span>   
        </div>
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className='text-[25px] tracking-wider'>Login Using xPortal App</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 overflow-y-auto max-h-[calc(100vh-160px)] mt-[-4] p-2 py-0 pb-12">
          {/* <LoginComponent isOpen={isOpen} setIsOpen={setIsOpen}/> */} <span className='text-[14px] mb-3 text-gray-300'>Scan the QR code using the xPortal App</span>
          <WalletConnectQRCode uri={walletConnectUri} />
        </div>
      </DialogContent>
    </Dialog>
        </>
      )}

     {/*  {loginMethod === LoginMethodsEnum.walletconnect &&
        walletConnectPairings &&
        walletConnectPairings.length > 0 && (
          <WalletConnectPairings
            pairings={walletConnectPairings}
            login={walletConnectPairingLogin}
            remove={walletConnectRemovePairing}
          />
        )} */}
      {loginMethod === LoginMethodsEnum.ledger && (
        <LedgerAccountsList
          getHWAccounts={getHWAccounts}
          resetLoginMethod={resetLoginMethod}
          handleLogin={handleLogin}
        />
      )}
    </>
  );
});

LoginComponent.displayName = 'LoginComponent';
