import { serverFetch } from "../core/server"

export const getRecruiterCompany = (recruiterId)=>{
    return serverFetch(`/api/my/companies?recruiterId=${recruiterId}`)
}

export const getCompanies = async()=>{
    return serverFetch("/api/companies")
}