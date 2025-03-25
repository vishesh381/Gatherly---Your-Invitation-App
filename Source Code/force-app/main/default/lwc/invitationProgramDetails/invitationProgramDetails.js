import { LightningElement, wire } from 'lwc';
import getProgramDetailsByInvitationId from '@salesforce/apex/InvitationController.getProgramDetailsByInvitationId'
export default class InvitationProgramDetails extends LightningElement {
    recordId=''
    programList=[]
    connectedCallback(){
        let invitationId = new URL(location.href).searchParams.get('invitationid')
        if(invitationId){
            this.recordId = invitationId
        }
    }
    @wire(getProgramDetailsByInvitationId, {Id:'$recordId'})
    programDetailsHandler({data, error}){
        if(data){
            console.log("programList", data)
            this.programList = data
        }
        if(error){
            console.error("Error in programDetailsHandler", error)
        }
    }
}