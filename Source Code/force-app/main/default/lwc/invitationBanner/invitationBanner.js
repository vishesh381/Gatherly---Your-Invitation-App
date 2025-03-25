import { LightningElement, wire } from 'lwc';
import marriageInvitationAssets from '@salesforce/resourceUrl/marriageInvitationAssets'
import getInvitationDetailsById from '@salesforce/apex/InvitationController.getInvitationDetailsById'
import CONFETTI from '@salesforce/resourceUrl/confetti'
import {loadScript} from 'lightning/platformResourceLoader'
export default class InvitationBanner extends LightningElement {
    theme = 'theme1'
    recordId ='' //a00QE000003A56QYAS
    invitationDetails={}
    isConfettiLoaded = false
    facebookUrl=''
    twitterUrl=''
    instagramUrl=''


    connectedCallback(){
        let invitationId = new URL(location.href).searchParams.get('invitationid')
        if(invitationId){
            this.recordId = invitationId
        }
    }
    //countdown properties
    intervalId
    days=0
    minutes=0
    hours=0
    seconds=0

    // Paths to the static resources
    instagramImage = marriageInvitationAssets+'/instagram.svg'
    facebookImage = marriageInvitationAssets+'/facebook.svg'
    twitterImage = marriageInvitationAssets+'/twitter.svg'

     // Dynamically setting background image style for the banner
    get bannerImage(){
        let themeName = marriageInvitationAssets + `/${this.theme}.jpeg`
        return `background-image:url(${themeName})`
    }

        // Wire service to fetch invitation details by ID
    @wire(getInvitationDetailsById, {Id:'$recordId'})
    invitationDetailsHandler({data, error}){
        if(data){
            console.log("invitationDetailsHandler", JSON.stringify(data))
            this.theme = data.Theme__c
            this.invitationDetails = data
            this.facebookUrl=data.Facebook_Url__c
            this.twitterUrl=data.Twitter_Url__c
            this.instagramUrl=data.Instagram_Url__c
            this.countdownTimer(data.Event_Date_and_Time__c)
        }
        if(error){
            console.error(error)
        }
    }


    //function to start the countdown timer
    countdownTimer(targetDate) {
        // Set up an interval that repeats every second
        this.intervalId = setInterval(() => {
            // Get the current time in milliseconds
            const currentTime = new Date().getTime();
    
            // Convert the target date to milliseconds
            const targetTime = new Date(targetDate).getTime();
    
            // Calculate the time difference between the target and current time
            const timeDifference = targetTime - currentTime;
    
            // Calculate days, hours, minutes, and seconds from the time difference
            this.days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            this.hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            this.minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            this.seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
            // If the time difference is less than or equal to 0, stop the interval
            if (timeDifference <= 0) {
                clearInterval(this.intervalId);
            }
        }, 1000); // Repeat the interval every 1000 milliseconds (1 second)
    }
    

    renderedCallback(){
        if(!this.isConfettiLoaded){
            loadScript(this, CONFETTI).then(()=>{
                this.isConfettiLoaded = true
                console.log("Loaded Successfully")
                const jsConfetti = new JSConfetti()
                jsConfetti.addConfetti()
            }).catch(error=>{
                console.error("Error loading CONFETTI", error)
            })
        }
        
    }

}