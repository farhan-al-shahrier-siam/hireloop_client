import { protectedServerFetch } from "../core/server"

export const getApplicationByApplicantId = async (applicantId)=>{
    return protectedServerFetch(`/api/applications?applicantId=${applicantId}`)
}