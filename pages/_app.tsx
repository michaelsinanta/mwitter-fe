import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { useEffect, useState } from "react";
import Navbar from '@/components/navbar/navbar';

export default function App({ Component, pageProps }: AppProps) {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    setShowing(true);
  }, []);

  if (!showing) {
    return null;
  }
  
  if (typeof window === 'undefined') {
    return <></>;
  } else {
  return ( 
    <RecoilRoot>
    <Navbar>
    <Component {...pageProps} />
    </Navbar>
    </RecoilRoot>
    )
}}
