import { auth, db, GoogleAuthProvider, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber, onAuthStateChanged, collection, addDoc, serverTimestamp } from './firebase-config.js';

let pendingLeadData = null;
let confirmationResult = null;

let currentContext = 'sidebar';

// Global accessible functions
window.startAuthFlow = function(contextType) {
    currentContext = contextType || 'sidebar';
    let date, isVirtual, name, phone, email, project;

    if (currentContext === 'sidebar') {
        date = document.getElementById('bDate').value;
        isVirtual = document.getElementById('vVirtual').checked;
        name = document.getElementById('bName').value;
        phone = document.getElementById('bPhone').value;
        email = document.getElementById('bEmail') ? document.getElementById('bEmail').value : "";
        project = document.getElementById('pTitle') ? document.getElementById('pTitle').innerText : 'General Inquiry';
    } else {
        date = document.getElementById('mDate').value;
        isVirtual = document.getElementById('mVirtual').checked;
        name = document.getElementById('mName').value;
        phone = document.getElementById('mPhone').value;
        email = document.getElementById('mEmail').value;
        project = document.getElementById('modalProjectInput').value || 'General Inquiry';
    }

    if(!date || !name || !phone) {
        alert("Please fill all required fields.");
        return;
    }

    pendingLeadData = {
        date: date,
        visitType: isVirtual ? 'Virtual' : 'In-Person',
        name: name,
        phone: phone,
        email: email,
        project: project
    };

    const containerId = currentContext === 'sidebar' ? 'recaptcha-container' : 'modal-recaptcha-container';

    if (currentContext === 'sidebar') {
        document.getElementById('bookingFormStep').style.display = 'none';
        document.getElementById('authStep').style.display = 'block';
    } else {
        document.getElementById('modalStep1').classList.remove('active');
        document.getElementById('modalStepAuth').classList.add('active');
    }

    // Init Recaptcha if not already done
    if(!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved.
            }
        });
    }
};

window.loginWithGoogle = async function() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        // User is signed in.
        pendingLeadData.email = pendingLeadData.email || result.user.email;
        pendingLeadData.name = pendingLeadData.name || result.user.displayName;
        await submitLeadToBackend();
    } catch(error) {
        console.error("Google Auth Error", error);
        alert("Authentication failed: " + error.message);
    }
};

window.sendPhoneOTP = async function() {
    const phoneNumber = pendingLeadData.phone;
    // ensure +91 format for India
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : '+91' + phoneNumber;
    
    try {
        const appVerifier = window.recaptchaVerifier;
        confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        
        if (currentContext === 'sidebar') {
            document.getElementById('authStep').style.display = 'none';
            document.getElementById('otpStep').style.display = 'block';
        } else {
            document.getElementById('modalStepAuth').classList.remove('active');
            document.getElementById('modalStepOTP').classList.add('active');
        }
    } catch(error) {
        console.error("OTP Error", error);
        alert("Failed to send OTP. Ensure billing is enabled and phone number is valid format (+91...). Error: " + error.message);
    }
};

window.verifyPhoneOTP = async function() {
    const code = currentContext === 'sidebar' ? document.getElementById('otpCode').value : document.getElementById('mOtpCode').value;
    try {
        await confirmationResult.confirm(code);
        // User is signed in.
        await submitLeadToBackend();
    } catch (error) {
        console.error("OTP Verify Error", error);
        alert("Invalid OTP code.");
    }
};

async function submitLeadToBackend() {
    try {
        if(pendingLeadData) {
            const leadPayload = {
                ...pendingLeadData,
                userId: auth.currentUser ? auth.currentUser.uid : null
            };
            
            const response = await fetch('http://localhost:5000/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadPayload)
            });
            
            if (!response.ok) {
                throw new Error("Backend submission failed.");
            }
        }
        
        if (currentContext === 'sidebar') {
            document.getElementById('authStep').style.display = 'none';
            document.getElementById('otpStep').style.display = 'none';
            document.getElementById('bookingFormStep').style.display = 'none';
            document.getElementById('successStep').style.display = 'block';
        } else {
            document.getElementById('modalStepAuth').classList.remove('active');
            document.getElementById('modalStepOTP').classList.remove('active');
            document.getElementById('modalStepSuccess').classList.add('active');
        }
        
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("Error saving your request. Please try again later.");
    }
}
