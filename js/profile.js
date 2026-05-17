import { auth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from './firebase-config.js';

const ADMIN_EMAILS = ['kamdarh143@gmail.com', 'cresthiveconsultancy@gmail.com'];
const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000/api' : '/api';

const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const btnUserLogin = document.getElementById('btnUserLogin');
const btnLogout = document.getElementById('btnLogout');
const userName = document.getElementById('userName');
const adminRedirect = document.getElementById('adminRedirect');

// Tabs
const tabEnquiries = document.getElementById('tabEnquiries');
const tabDownloads = document.getElementById('tabDownloads');
const tabSettings = document.getElementById('tabSettings');
const tabManual = document.getElementById('tabManual');

const sectionEnquiries = document.getElementById('sectionEnquiries');
const sectionDownloads = document.getElementById('sectionDownloads');
const sectionSettings = document.getElementById('sectionSettings');
const sectionManual = document.getElementById('sectionManual');

function resetTabs() {
    [tabEnquiries, tabDownloads, tabSettings, tabManual].forEach(t => t.classList.remove('active'));
    [sectionEnquiries, sectionDownloads, sectionSettings, sectionManual].forEach(s => s.style.display = 'none');
}

tabEnquiries.onclick = () => { resetTabs(); tabEnquiries.classList.add('active'); sectionEnquiries.style.display = 'block'; };
tabDownloads.onclick = () => { resetTabs(); tabDownloads.classList.add('active'); sectionDownloads.style.display = 'block'; };
tabSettings.onclick = () => { resetTabs(); tabSettings.classList.add('active'); sectionSettings.style.display = 'block'; };
tabManual.onclick = () => { resetTabs(); tabManual.classList.add('active'); sectionManual.style.display = 'block'; };


// Check Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        btnLogout.style.display = 'block';
        
        userName.innerText = user.displayName || user.email.split('@')[0];
        
        // Show Admin Redirect if applicable
        if (ADMIN_EMAILS.includes(user.email)) {
            adminRedirect.style.display = 'block';
        } else {
            adminRedirect.style.display = 'none';
        }

        // Fill Basic Google Settings (fallback)
        document.getElementById('settingName').value = user.displayName || '';
        document.getElementById('settingEmail').value = user.email || '';

        fetchUserProfile(user.email, user.displayName);
        fetchUserEnquiries(user.email);
    } else {
        loginSection.style.display = 'block';
        dashboardSection.style.display = 'none';
        btnLogout.style.display = 'none';
    }
});

btnUserLogin.addEventListener('click', async () => {
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login Failed", error);
        alert(error.message);
    }
});

btnLogout.addEventListener('click', async () => await signOut(auth));

async function fetchUserEnquiries(email) {
    const tbody = document.getElementById('enquiriesTableBody');
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px;">Loading your enquiries...</td></tr>';
    
    try {
        const res = await fetch(`${BACKEND_URL}/leads/user/${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const leads = await res.json();
        
        if (leads.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px;">You have not made any property enquiries yet.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        leads.forEach(data => {
            const dateStr = new Date(data.createdAt || data.date).toLocaleString();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td><strong>${escapeHTML(data.project || 'General Inquiry')}</strong></td>
                <td>${escapeHTML(data.visitType || 'N/A')}</td>
                <td><span class="status-badge">Submitted</span></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Fetch Error:", error);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 30px; color: red;">Error connecting to backend server. Make sure the backend server (start.bat) is running.</td></tr>`;
    }
}

async function fetchUserProfile(email, fallbackName) {
    try {
        const res = await fetch(`${BACKEND_URL}/users/${encodeURIComponent(email)}`);
        if(res.ok) {
            const userData = await res.json();
            if(userData && userData.email) {
                document.getElementById('settingName').value = userData.name || fallbackName || '';
                document.getElementById('settingPhone').value = userData.phone || '';
                document.getElementById('settingAddress').value = userData.address || '';
            }
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
}

document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSaveProfile');
    btn.innerText = 'Saving...';
    btn.disabled = true;

    const email = document.getElementById('settingEmail').value;
    const payload = {
        name: document.getElementById('settingName').value,
        phone: document.getElementById('settingPhone').value,
        address: document.getElementById('settingAddress').value
    };

    try {
        const res = await fetch(`${BACKEND_URL}/users/${encodeURIComponent(email)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if(res.ok) {
            alert('Profile saved successfully!');
        } else {
            alert('Failed to save profile.');
        }
    } catch (error) {
        console.error("Error saving profile:", error);
        alert('Error saving profile.');
    } finally {
        btn.innerText = 'Save Profile';
        btn.disabled = false;
    }
});

function escapeHTML(str) {
    return str ? str.toString().replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag)) : '';
}
