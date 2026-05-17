import { auth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from './firebase-config.js';

const ADMIN_EMAIL = 'kamdarh143@gmail.com';
const SECONDARY_ADMIN = 'cresthiveconsultancy@gmail.com';
const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000/api' : '/api';

const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const btnAdminLogin = document.getElementById('btnAdminLogin');
const btnLogout = document.getElementById('btnLogout');
const loginError = document.getElementById('loginError');
const adminName = document.getElementById('adminName');

// Tabs
const tabLeads = document.getElementById('tabLeads');
const tabProjects = document.getElementById('tabProjects');
const sectionLeads = document.getElementById('sectionLeads');
const sectionProjects = document.getElementById('sectionProjects');

tabLeads.onclick = () => {
    tabLeads.classList.add('active'); tabProjects.classList.remove('active');
    sectionLeads.style.display = 'block'; sectionProjects.style.display = 'none';
};
tabProjects.onclick = () => {
    tabProjects.classList.add('active'); tabLeads.classList.remove('active');
    sectionProjects.style.display = 'block'; sectionLeads.style.display = 'none';
};

// Check Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.email === ADMIN_EMAIL || user.email === SECONDARY_ADMIN) {
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            btnLogout.style.display = 'block';
            adminName.innerText = user.displayName || user.email;
            fetchLeads();
            fetchProjects();
        } else {
            loginError.style.display = 'block';
            loginError.innerText = `Access Denied: The account (${user.email}) does not have administrator privileges.`;
            signOut(auth);
        }
    } else {
        loginSection.style.display = 'block';
        dashboardSection.style.display = 'none';
        btnLogout.style.display = 'none';
    }
});

btnAdminLogin.addEventListener('click', async () => {
    loginError.style.display = 'none';
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login Failed", error);
        loginError.style.display = 'block';
        loginError.innerText = error.message;
    }
});

btnLogout.addEventListener('click', async () => await signOut(auth));

// ==========================
// LEADS LOGIC
// ==========================
document.getElementById('btnRefreshLeads').onclick = fetchLeads;

async function fetchLeads() {
    const tbody = document.getElementById('leadsTableBody');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">Loading leads data...</td></tr>';
    try {
        const res = await fetch(`${BACKEND_URL}/leads`);
        const leads = await res.json();
        
        if (leads.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">No leads found.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        leads.forEach(data => {
            const dateStr = new Date(data.createdAt || data.date).toLocaleString();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td><strong>${escapeHTML(data.name || 'N/A')}</strong></td>
                <td>${escapeHTML(data.phone || 'N/A')}</td>
                <td>${escapeHTML(data.email || 'N/A')}</td>
                <td><span class="status-badge">${escapeHTML(data.project || 'N/A')}</span></td>
                <td>${escapeHTML(data.visitType || 'N/A')}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: red;">Error connecting to Node backend.</td></tr>`;
    }
}

document.getElementById('btnExportCSV').onclick = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/leads`);
        const leads = await res.json();
        
        if (leads.length === 0) {
            alert("No leads to export.");
            return;
        }

        // CSV Header
        let csvContent = "Date,Name,Phone,Email,Project,VisitType\n";
        
        leads.forEach(data => {
            const dateStr = new Date(data.createdAt || data.date).toLocaleString().replace(/,/g, '');
            const name = (data.name || 'N/A').replace(/,/g, '');
            const phone = (data.phone || 'N/A').replace(/,/g, '');
            const email = (data.email || 'N/A').replace(/,/g, '');
            const project = (data.project || 'N/A').replace(/,/g, '');
            const visitType = (data.visitType || 'N/A').replace(/,/g, '');
            
            csvContent += `${dateStr},${name},${phone},${email},${project},${visitType}\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "cresthive_leads.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch(err) {
        alert("Failed to export leads.");
    }
};

// ==========================
// PROJECTS LOGIC
// ==========================
document.getElementById('btnRefreshProjects').onclick = fetchProjects;

async function fetchProjects() {
    const tbody = document.getElementById('projectsTableBody');
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">Loading projects...</td></tr>';
    try {
        const res = await fetch(`${BACKEND_URL}/projects`);
        const projects = await res.json();
        
        if (projects.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">No projects found.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        projects.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${p.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" onerror="this.src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=50'"></td>
                <td><strong>${escapeHTML(p.title)}</strong></td>
                <td>${escapeHTML(p.price)}</td>
                <td>${escapeHTML(p.location)}</td>
                <td>${escapeHTML(p.type)}</td>
                <td><span class="status-badge">${escapeHTML(p.status)}</span></td>
                <td>
                    <button class="btn-edit" onclick="window.editProject('${p._id}')">Edit</button>
                    <button class="btn-danger" onclick="window.deleteProject('${p._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 30px; color: red;">Error connecting to Node backend.</td></tr>`;
    }
}

// Modal Logic
const modal = document.getElementById('projectModal');
document.getElementById('btnAddProject').onclick = () => {
    document.getElementById('projectForm').reset();
    document.getElementById('projId').value = '';
    document.getElementById('modalTitle').innerText = 'Add New Project';
    modal.style.display = 'flex';
};
document.getElementById('btnCancelModal').onclick = () => {
    modal.style.display = 'none';
};

document.getElementById('projectForm').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('projId').value;
    
    const payload = {
        title: document.getElementById('projTitle').value,
        price: document.getElementById('projPrice').value,
        location: document.getElementById('projLocation').value,
        image: document.getElementById('projImage').value,
        bhk: document.getElementById('projBhk').value,
        sqft: document.getElementById('projSqft').value,
        status: document.getElementById('projStatus').value,
        type: document.getElementById('projType').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${BACKEND_URL}/projects/${id}` : `${BACKEND_URL}/projects`;

    try {
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        modal.style.display = 'none';
        fetchProjects();
    } catch (error) {
        alert("Failed to save project.");
    }
};

window.editProject = async (id) => {
    try {
        const res = await fetch(`${BACKEND_URL}/projects`);
        const projects = await res.json();
        const p = projects.find(x => x._id === id);
        if(p) {
            document.getElementById('projId').value = p._id;
            document.getElementById('projTitle').value = p.title;
            document.getElementById('projPrice').value = p.price;
            document.getElementById('projLocation').value = p.location;
            document.getElementById('projImage').value = p.image;
            document.getElementById('projBhk').value = p.bhk;
            document.getElementById('projSqft').value = p.sqft;
            document.getElementById('projStatus').value = p.status;
            document.getElementById('projType').value = p.type;
            
            document.getElementById('modalTitle').innerText = 'Edit Project';
            modal.style.display = 'flex';
        }
    } catch(e) {}
};

window.deleteProject = async (id) => {
    if(confirm("Are you sure you want to delete this property?")) {
        try {
            await fetch(`${BACKEND_URL}/projects/${id}`, { method: 'DELETE' });
            fetchProjects();
        } catch(e) {
            alert("Failed to delete project.");
        }
    }
};

function escapeHTML(str) {
    return str ? str.toString().replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag)) : '';
}
