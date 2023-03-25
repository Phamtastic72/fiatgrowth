import { useState } from 'react';

import type { NextPage } from 'next';
import Head from 'next/head';

import CalculatorCac from '../components/Calculator/components/Cac';
import CalculatorInputs from '../components/Calculator/components/Inputs';
import CalculatorLtv from '../components/Calculator/components/Ltv';
import CalculatorLtvCacRatio from '../components/Calculator/components/LtvCacRatio';
import CalculatorCustomerAcquisitionImpact from '../components/Calculator/components/LtvCustomerAcquisitionImpact';
import CalculatorMrr from '../components/Calculator/components/Mrr';

import Logo from '../components/Logo';
import { CalculateOutput } from './api/calculate';

const Home: NextPage = () => {
  const [results, setResults] = useState<CalculateOutput | null>(null);

  return (
    <>
      <div className="min-h-screen bg-matte px-4 pt-16 pb-24 font-sans text-clarity">
        <Head>
          <title>Fiat Growth</title>
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:title" content="Fiat Growth" key="og:title" />
          <meta
            name="twitter:title"
            content="Fiat Growth"
            key="twitter:title"
          />
        </Head>

        <header className="mx-auto mb-16 w-64 text-center md:mb-24 md:w-full md:max-w-xs xl:max-w-xl">
          <Logo className="mx-auto w-full max-w-md" />
        </header>

        <div className="mx-auto flex max-w-[1380px] flex-col gap-4 md:grid md:grid-cols-8 xl:gap-8 2xl:grid-cols-10">
          <div className="col-span-4 row-span-4 flex items-stretch 2xl:row-span-3">
            <CalculatorInputs onRun={setResults} />
          </div>
          {results && (
            <>
              <div className="md:col-span-4 xl:col-span-2 2xl:col-span-3">
                <CalculatorLtv {...results.ltv} />
              </div>
              <div className="md:col-span-4 xl:col-span-2 2xl:col-span-3">
                <CalculatorCac {...results.cac} />
              </div>
              <div className="md:col-span-4 2xl:col-span-6">
                <CalculatorLtvCacRatio data={results.ltv_cac} />
              </div>
              <div className="md:col-span-4 2xl:col-span-6">
                <CalculatorMrr data={results.mrr} />
              </div>
              <div className="col-span-8 2xl:col-span-10">
                <CalculatorCustomerAcquisitionImpact
                  data={results.acquisition}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
