document.addEventListener('DOMContentLoaded', () => {
    // Inject WhatsApp Button and Booking Modal into body
    const body = document.querySelector('body');
    if (body) {
        // WhatsApp Float
        const waBtn = document.createElement('a');
        waBtn.href = "https://wa.me/919594063034?text=Hi%2C%20I%20am%20looking%20for%20a%20property%20in%20Mumbai.";
        waBtn.className = "whatsapp-float";
        waBtn.target = "_blank";
        waBtn.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`;
        body.appendChild(waBtn);

        // Booking Modal
        const modalHTML = `
            <div class="modal-overlay" id="bookingModal">
                <div class="booking-modal">
                    <div class="modal-close" onclick="closeModal()">×</div>
                    
                    <!-- Step 1: Details -->
                    <div class="modal-step active" id="modalStep1">
                        <div class="modal-title">Book Free Site Visit</div>
                        <p style="color: var(--text-muted); margin-bottom: 20px;">Schedule an online presentation or physical visit.</p>
                        
                        <label style="font-size: 13px; font-weight: 600;">Project / Location</label>
                        <input type="text" class="booking-input" id="modalProjectInput" placeholder="E.g. Godrej Nurture" readonly>
                        
                        <label style="font-size: 13px; font-weight: 600;">Date & Time</label>
                        <input type="datetime-local" class="booking-input" id="mDate" required>
                        
                        <label style="font-size: 13px; font-weight: 600; display: block; margin-top: 10px;">Visit Type</label>
                        <div style="display: flex; gap: 15px; margin-bottom: 20px; margin-top: 5px;">
                            <label><input type="radio" name="visitType" id="mVirtual" checked> Virtual Tour</label>
                            <label><input type="radio" name="visitType" id="mInPerson"> Site Visit</label>
                        </div>

                        <input type="text" class="booking-input" id="mName" placeholder="Full Name" required>
                        <input type="tel" class="booking-input" id="mPhone" placeholder="Phone Number (+91...)" required>
                        <input type="email" class="booking-input" id="mEmail" placeholder="Email Address">
                        
                        <button class="btn btn-primary btn-full" onclick="window.startAuthFlow('modal')">Verify & Continue</button>
                    </div>
                    
                    <!-- Step 2: Auth -->
                    <div class="modal-step" id="modalStepAuth" style="text-align: center;">
                        <div class="modal-title" style="color: var(--primary-color);">Verify Identity</div>
                        <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 13px;">Please authenticate to submit your secure request.</p>
                        
                        <button class="btn btn-outline btn-full" onclick="window.loginWithGoogle()" style="margin-bottom: 15px;">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" style="width: 18px; margin-right: 8px;"> Sign in with Google
                        </button>
                        <div style="margin-bottom: 15px; font-size: 12px; color: #999;">OR</div>
                        <div id="modal-recaptcha-container" style="margin-bottom: 15px; display: flex; justify-content: center;"></div>
                        <button class="btn btn-primary btn-full" onclick="window.sendPhoneOTP()">Send OTP to Phone</button>
                    </div>

                    <!-- Step 3: OTP -->
                    <div class="modal-step" id="modalStepOTP" style="text-align: center;">
                        <div class="modal-title" style="color: var(--primary-color);">Enter OTP</div>
                        <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 13px;">We sent a code to your phone.</p>
                        
                        <input type="text" class="booking-input" id="mOtpCode" placeholder="6-digit code" style="text-align: center; letter-spacing: 2px; font-weight: bold;">
                        <button class="btn btn-primary btn-full" onclick="window.verifyPhoneOTP()">Verify & Submit</button>
                    </div>

                    <!-- Step 4: Success -->
                    <div class="modal-step" id="modalStepSuccess" style="text-align: center; padding: 20px 0;">
                        <div style="font-size: 40px; margin-bottom: 15px;">✅</div>
                        <div class="modal-title" style="color: green; margin-bottom: 10px;">Booking Confirmed!</div>
                        <p style="color: var(--text-muted); font-size: 14px;">We have securely received your details. Our advisor will reach out shortly.</p>
                    </div>
                </div>
            </div>
        `;
        body.insertAdjacentHTML('beforeend', modalHTML);

        // Download Modal
        const downloadModalHTML = `
            <div class="modal-overlay" id="downloadModal">
                <div class="booking-modal" style="max-width: 400px;">
                    <div class="modal-close" onclick="closeDownloadModal()">×</div>
                    <div class="modal-title" style="color: var(--primary-color);">Download Brochure</div>
                    <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 13px;">Please enter your details to unlock the project brochure.</p>
                    
                    <input type="hidden" id="dProjName">
                    <input type="text" class="booking-input" id="dName" placeholder="Full Name" required>
                    <input type="tel" class="booking-input" id="dPhone" placeholder="Phone Number (+91...)" required>
                    <input type="email" class="booking-input" id="dEmail" placeholder="Email Address (Optional)">
                    
                    <button class="btn btn-primary btn-full" onclick="submitDownloadRequest()">Get Brochure</button>
                    
                    <div id="dSuccess" style="display:none; color: green; margin-top: 15px; font-size: 14px; text-align: center;">
                        <p>Success! Your download is starting...</p>
                        <a href="#" id="dLink" style="display: block; margin-top: 10px; color: var(--primary-dark); font-weight: bold; text-decoration: underline;">Click here if it doesn't start automatically</a>
                    </div>
                </div>
            </div>
        `;
        body.insertAdjacentHTML('beforeend', downloadModalHTML);
    }

    // Search Tabs Logic
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const typeSelect = document.querySelector('select');
            if (typeSelect) {
                if(tab.dataset.tab === 'commercial') {
                    typeSelect.innerHTML = `
                        <option value="">Select Type</option>
                        <option value="office">Office Space</option>
                        <option value="shop">Shop</option>
                        <option value="warehouse">Warehouse</option>
                    `;
                } else {
                    typeSelect.innerHTML = `
                        <option value="">Select Type</option>
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="plot">Plot</option>
                        <option value="penthouse">Penthouse</option>
                    `;
                }
            }
        });
    });

    // Autocomplete Logic for Location Search
    const locationInput = document.getElementById('locationInput');
    const autocompleteList = document.getElementById('autocomplete-list');
    
    const localities = [
        // Real Mumbai/Navi Mumbai Localities
        "Andheri", "Bandra", "BKC", "Borivali", "Chembur", "Dadar", "Ghatkopar", 
        "Goregaon", "Juhu", "Kandivali", "Kanjurmarg", "Kharghar", "Kurla", "Lower Parel", 
        "Malad", "Matunga", "Majiwada", "Mulund", "Navi Mumbai", "Panvel", "Parel", "Powai", 
        "Santacruz", "Sewri", "Sion", "South Mumbai", "Thane", "Vikhroli", "Vile Parle", "Wadala", "Worli",
        
        // Extracted Housiey Projects
        "Dosti 604", "Raymond The Address", "Birla Taranya", "Purva Estrella", 
        "Sattva Sumera", "Shapoorji Pallonji Nine Arcs", "Godrej Varanya", 
        "Adani Codename LIT", "Rustomjee La Familia"
    ];

    if (locationInput && autocompleteList) {
        locationInput.addEventListener('input', function() {
            const val = this.value;
            autocompleteList.innerHTML = '';
            
            if (!val) {
                return false;
            }
            
            localities.forEach(locality => {
                if (locality.toLowerCase().includes(val.toLowerCase())) {
                    const item = document.createElement('div');
                    const regex = new RegExp(`(${val})`, "gi");
                    item.innerHTML = locality.replace(regex, "<strong>$1</strong>");
                    
                    item.addEventListener('click', function() {
                        locationInput.value = locality;
                        autocompleteList.innerHTML = '';
                    });
                    autocompleteList.appendChild(item);
                }
            });
        });

        document.addEventListener('click', function(e) {
            if (e.target !== locationInput) {
                autocompleteList.innerHTML = '';
            }
        });
    }

    // Admin Login
    const adminLoginBtn = document.querySelector('a[href="#admin"]');
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Admin Login Portal\n\nOnly authorized CrestHive administrators can access this section to manage listings.');
        });
    }

    // Contact Scroll
    const contactBtns = document.querySelectorAll('a[href="#contact"]');
    contactBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const footer = document.querySelector('.footer');
            if(footer) footer.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Property Data (Will be fetched from MongoDB Backend)
    let properties = [];

    const propertyGrid = document.getElementById('propertyGrid');

    let baseProperties = [];
    const currentPath = window.location.pathname;

    function filterByPage() {
        if (currentPath.includes('buy.html')) {
            baseProperties = properties.filter(p => p.type === 'buy');
        } else if (currentPath.includes('rent.html')) {
            baseProperties = properties.filter(p => p.type === 'rent');
        } else if (currentPath.includes('projects.html')) {
            baseProperties = properties.filter(p => p.type === 'project');
        } else {
            baseProperties = properties;
        }
    }

    function renderProperties(propsToShow) {
        if (!propertyGrid) return;
        propertyGrid.innerHTML = '';
        
        if (propsToShow.length === 0) {
            propertyGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666; font-size: 18px;">No projects found for this search criteria.</p>';
            return;
        }

        propsToShow.forEach(prop => {
            const card = document.createElement('div');
            card.className = 'property-card';
            card.innerHTML = `
                <div class="property-image-container">
                    <span class="property-badge">${prop.status}</span>
                    <img src="${prop.image}" alt="${prop.title}" class="property-image" onerror="this.src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
                </div>
                <div class="property-content">
                    <div class="property-price">${prop.price}</div>
                    <h3 class="property-title" title="${prop.title}">${prop.title}</h3>
                    <div class="property-location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        ${prop.location}
                    </div>
                    <div class="property-meta">
                        <div class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            ${prop.bhk} BHK
                        </div>
                        <div class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                            ${prop.sqft}
                        </div>
                    </div>
                </div>
                <div class="property-actions">
                    <a href="https://wa.me/919594063034?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(prop.title)}" target="_blank" class="btn-live-chat" onclick="event.stopPropagation()">Live Chat</a>
                    <button class="btn-enquire" onclick="openModal('${prop.title}'); event.stopPropagation()">Enquire Now</button>
                    <button class="btn-outline" style="padding: 8px 15px; font-size: 13px;" onclick="openDownloadModal('${prop.title}'); event.stopPropagation()">Brochure</button>
                </div>
            `;
            
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.location.href = 'property.html';
            });
            
            propertyGrid.appendChild(card);
        });
    }

    const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000/api' : '/api';
    
    // Fetch from MongoDB via API
    if (propertyGrid) {
        propertyGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Loading properties from database...</p>';
        fetch(BACKEND_URL + '/projects')
            .then(res => res.json())
            .then(data => {
                properties = data;
                filterByPage();
                renderProperties(baseProperties);
            })
            .catch(err => {
                console.error("Error fetching projects:", err);
                propertyGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: red;">Failed to connect to backend server.</p>';
            });
    }

    // Interactive Buttons Logic (Search Form)
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const locationInputEl = document.getElementById('locationInput');
            const locationVal = locationInputEl ? locationInputEl.value.toLowerCase().trim() : '';
            
            const bhkInput = document.getElementById('bhkInput');
            const budgetInput = document.getElementById('budgetInput');
            
            let filteredProps = baseProperties;
            
            if (locationVal) {
                filteredProps = filteredProps.filter(p => 
                    p.location.toLowerCase().includes(locationVal) || 
                    p.title.toLowerCase().includes(locationVal)
                );
            }
            
            if (bhkInput && bhkInput.value) {
                filteredProps = filteredProps.filter(p => p.bhk.includes(bhkInput.value));
            }
            
            renderProperties(filteredProps);
            
            const projectsSec = document.getElementById('projects');
            if(projectsSec) projectsSec.scrollIntoView({ behavior: 'smooth' });
            
            const secH2 = document.querySelector('#projects .section-header h2');
            if(secH2) secH2.innerText = locationVal ? 'Search Results for "' + locationInputEl.value + '"' : 'Search Results';
        });
    }

    // Dynamic background for index.html hero
    const heroSection = document.querySelector('.hero');
    if (heroSection && !heroSection.classList.contains('hero-sm')) {
        const img = new Image();
        img.src = 'assets/hero_bg_1778980915665.png';
        img.onerror = () => {
            heroSection.style.backgroundImage = "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')";
        };
    }
});

// Global Modal Functions
window.openModal = function(projectName) {
    const modalProjectInput = document.getElementById('modalProjectInput');
    if (modalProjectInput) modalProjectInput.value = projectName || '';
    document.getElementById('bookingModal').classList.add('active');
    
    // Reset to step 1
    document.getElementById('modalStep1').classList.add('active');
    document.getElementById('modalStepAuth').classList.remove('active');
    document.getElementById('modalStepOTP').classList.remove('active');
    document.getElementById('modalStepSuccess').classList.remove('active');
};
window.closeModal = function() {
    document.getElementById('bookingModal').classList.remove('active');
};

window.openDownloadModal = function(projectName) {
    document.getElementById('dProjName').value = projectName || '';
    document.getElementById('dSuccess').style.display = 'none';
    document.getElementById('downloadModal').classList.add('active');
};

window.closeDownloadModal = function() {
    document.getElementById('downloadModal').classList.remove('active');
};

window.submitDownloadRequest = async function() {
    const name = document.getElementById('dName').value;
    const phone = document.getElementById('dPhone').value;
    const email = document.getElementById('dEmail').value || 'guest@cresthive.com';
    const projName = document.getElementById('dProjName').value;
    
    if(!name || !phone) {
        alert("Please enter Name and Phone number.");
        return;
    }
    
    const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000/api' : '/api';
    try {
        await fetch(BACKEND_URL + '/users/' + encodeURIComponent(email) + '/downloads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, projectName: projName })
        });
        
        document.getElementById('dSuccess').style.display = 'block';
        
        // Simulate a PDF download since we don't have actual brochure files.
        const dummyPdfContent = "data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCgkJICAgID4+CiAgPj4KICAvQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCgo0IDAgb2JqCjw8CiAgL1R5cGUgL0ZvbnQKICAvU3VidHlwZSAvVHlwZTUKICAvQmFzZUZvbnQgL1RpbWVzLVJvbWFuCj4+CmVuZG9iagoKNSAwIG9iago8PAogIC9MZW5ndGggMzAKPj4Kc3RyZWFtCkJUCi9GMSAxOCBUZgoyMCA4MCBUZAooQnJvY2h1cmUgRG93bmxvYWQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMDYwIDAwMDAwIG4gCjAwMDAwMDAxNTcgMDAwMDAgbiAKMDAwMDAwMDI1MyAwMDAwMCBuIAowMDAwMDAwMzQxIDAwMDAwIG4gCnRyYWlsZXIKPDwKICAvU2l6ZSA2CiAgL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQyMwolJUVPRgo=";
        const link = document.getElementById('dLink');
        link.href = dummyPdfContent;
        link.download = projName + "_Brochure.pdf";
        
        // Auto trigger download
        setTimeout(() => link.click(), 1000);
        
    } catch(err) {
        alert("Failed to process download request.");
    }
};
