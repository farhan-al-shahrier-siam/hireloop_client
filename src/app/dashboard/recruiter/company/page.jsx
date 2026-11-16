import React from 'react';
import CompanyProfileManager from './CompanyProfileManager';
import { getUserSession } from '@/lib/core/session';
import { getRecruiterCompany } from '@/lib/api/companies';

const CompanyPage = async () => {

    const user = await getUserSession();
    // console.log(user);

    const initialCompany = await getRecruiterCompany(user?.id)
    // console.log(initialCompany);
    return (
        <div>
            <CompanyProfileManager initialCompany={initialCompany}  recruiter={user}></CompanyProfileManager>
        </div>
    );
};

export default CompanyPage;