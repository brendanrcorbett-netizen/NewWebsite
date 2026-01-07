---

## js/main.js
```javascript
// ==========================================
// BlueLine Emergency Plumbing - JavaScript
// ==========================================

// CONFIGURATION - Update these values for production
const CONFIG = {
    businessEmail: 'service@bluelineplumbingdemo.com',
    businessPhone: '(555) 284-7721',
    // EmailJS Configuration (Sign up at https://www.emailjs.com/)
    // Replace these with your actual EmailJS credentials
    emailJsServiceId: 'YOUR_SERVICE_ID',
    emailJsTemplateId: 'YOUR_TEMPLATE_ID',
    emailJsPublicKey: 'YOUR_PUBLIC_KEY'
};

// ==========================================
// Mobile Navigation Toggle
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Initialize page-specific functionality
    initializeEstimatesPage();
    initializeScheduleForm();
    initializeContactForm();
});

// ==========================================
// Service Booking from Homepage
// ==========================================
function bookService(serviceName) {
    // Store service in localStorage for estimates page
    localStorage.setItem('selectedService', serviceName);
    // Redirect to estimates page
    window.location.href = `estimates.html?service=${encodeURIComponent(serviceName)}`;
}

// ==========================================
// Estimates Page - Service Detection
// ==========================================
function initializeEstimatesPage() {
    if (!window.location.pathname.includes('estimates.html')) return;

    const urlParams = new URLSearchParams(window.location.search);
    const selectedService = urlParams.get('service') || localStorage.getItem('selectedService');

    if (selectedService) {
        // Show selected service banner
        const banner = document.getElementById('selectedServiceBanner');
        const serviceName = document.getElementById('selectedServiceName');
        
        if (banner && serviceName) {
            serviceName.textContent = selectedService;
            banner.style.display = 'block';
            
            // Highlight the selected service card
            const cards = document.querySelectorAll('.pricing-card');
            cards.forEach(card => {
                if (card.dataset.service === selectedService) {
                    card.style.border = '3px solid var(--primary-blue)';
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }

        // Clear localStorage
        localStorage.removeItem('selectedService');
    }
}

// ==========================================
// Schedule Form Handler
// ==========================================
function initializeScheduleForm() {
    const scheduleForm = document.getElementById('scheduleForm');
    if (!scheduleForm) return;

    // Pre-fill service if coming from estimates
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
        const serviceSelect = document.getElementById('serviceType');
        if (serviceSelect) {
            serviceSelect.value = serviceParam;
        }
    }

    // Form submission handler
    scheduleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            serviceType: document.getElementById('serviceType').value,
            contactMethod: document.querySelector('input[name="contactMethod"]:checked').value,
            preferredDate: document.getElementById('preferredDate').value,
            message: document.getElementById('message').value
        };

        // Display summary
        displayScheduleSummary(formData);

        // IMPORTANT: Email functionality requires EmailJS setup
        // To enable email sending:
        // 1. Sign up at https://www.emailjs.com/
        // 2. Create an email service and template
        // 3. Replace the CONFIG values at the top of this file
        // 4. Uncomment the sendEmail function below

        // await sendEmail(formData, 'schedule');

        // Hide form and show success message
        scheduleForm.style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';

        // Scroll to success message
        document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });
    });
}

// ==========================================
// Contact Form Handler
// ==========================================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form data
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value || 'Not provided',
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };

        // IMPORTANT: Email functionality requires EmailJS setup
        // await sendEmail(formData, 'contact');

        // Hide form and show success message
        contactForm.style.display = 'none';
        document.getElementById('contactSuccess').style.display = 'block';

        // Scroll to success message
        document.getElementById('contactSuccess').scrollIntoView({ behavior: 'smooth' });
    });
}

// ==========================================
// Display Schedule Form Summary
// ==========================================
function displayScheduleSummary(data) {
    const summaryDiv = document.getElementById('summaryDetails');
    if (!summaryDiv) return;

    const formattedDate = new Date(data.preferredDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    summaryDiv.innerHTML = `
        <h3>Your Request Details:</h3>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Service:</strong> ${data.serviceType}</p>
        <p><strong>Preferred Contact:</strong> ${data.contactMethod}</p>
        <p><strong>Preferred Date:</strong> ${formattedDate}</p>
        <p><strong>Message:</strong> ${data.message}</p>
    `;
}

// ==========================================
// Email Sending Function (EmailJS)
// ==========================================
// IMPORTANT: This function requires EmailJS configuration
// To enable email functionality:
// 1. Sign up at https://www.emailjs.com/
// 2. Add your email service (Gmail, Outlook, etc.)
// 3. Create an email template with variables matching the formData
// 4. Update the CONFIG object at the top of this file
// 5. Include the EmailJS SDK in your HTML:
//    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
// 6. Initialize EmailJS with: emailjs.init(CONFIG.emailJsPublicKey);

async function sendEmail(formData, formType) {
    // Check if EmailJS is configured
    if (CONFIG.emailJsServiceId === 'YOUR_SERVICE_ID') {
        console.log('EmailJS not configured. Form data:', formData);
        console.log('To enable email: Update CONFIG values and include EmailJS SDK');
        return;
    }

    try {
        // Initialize EmailJS (do this once on page load in production)
        if (typeof emailjs !== 'undefined') {
            emailjs.init(CONFIG.emailJsPublicKey);

            // Prepare template parameters based on form type
            let templateParams = {};
            
            if (formType === 'schedule') {
                templateParams = {
                    to_email: CONFIG.businessEmail,
                    from_name: formData.fullName,
                    from_email: formData.email,
                    phone: formData.phone,
                    service_type: formData.serviceType,
                    contact_method: formData.contactMethod,
                    preferred_date: formData.preferredDate,
                    message: formData.message
                };
            } else if (formType === 'contact') {
                templateParams = {
                    to_email: CONFIG.businessEmail,
                    from_name: formData.name,
                    from_email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    message: formData.message
                };
            }

            // Send email via EmailJS
            const response = await emailjs.send(
                CONFIG.emailJsServiceId,
                CONFIG.emailJsTemplateId,
                templateParams
            );

            console.log('Email sent successfully:', response);
        }
    } catch (error) {
        console.error('Email sending failed:', error);
        // In production, you might want to show an error message to the user
        // or log this to a monitoring service
    }
}

// ==========================================
// Reset Forms
// ==========================================
function resetForm() {
    document.getElementById('scheduleForm').reset();
    document.getElementById('scheduleForm').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetContactForm() {
    document.getElementById('contactForm').reset();
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('contactSuccess').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// Set Minimum Date for Date Inputs
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
});
```

