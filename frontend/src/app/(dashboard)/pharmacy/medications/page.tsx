"use client";

import React, { useState } from 'react';
import { MainView, BulkInsertView } from '@/components/dashboard/pharmacy/medications';

const PharmacyMedicationsPage = () => {
  const [view, setView] = useState('main');

  return (
    <section className=''>
      {view === 'bulk' ? (
        <BulkInsertView setView={() => setView('main')} />
      ) : (
        <MainView setView={() => setView('bulk')} />
      )}
    </section>
  );
};

export default PharmacyMedicationsPage;
