"use client"
import StatsCards from '@/components/dashboard/StatsCard';
import { useSession } from '@/lib/auth-client';
import { Spinner } from '@heroui/react';
import React from 'react';

const RecruiterPage = () => {

    const {data: session, isPending} = useSession()
    if(isPending){
        return <div className="flex flex-col items-center gap-2">
        <Spinner color="accent" />
        <span className="text-xs text-muted">Accent</span>
      </div>
    }
    const user = session?.user

    return (
        <div className='p-2'>
           <h2 className='text-2xl mb-4 font-bold'> Welcome back, {user?.name}</h2>
           <StatsCards></StatsCards>
        </div>
    );
};

export default RecruiterPage;