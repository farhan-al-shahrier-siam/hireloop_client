import { serverFetch } from "../core/server"

export const getRecruiterCompany = (recruiterId)=>{
    return serverFetch(`/api/my/companies?recruiterId=${recruiterId}`)
}