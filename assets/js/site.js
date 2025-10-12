// Dragon Bones & Wizards Hats - Site JS

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.site-nav');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

// Auto-update footer year
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Update footer links with teal theme + Work With Me
const footer = document.querySelector('.site-footer p');
if (footer) {
  footer.innerHTML = `
    © <span id="year">${new Date().getFullYear()}</span> dragonbonesandwizardshats •
    <a href="/work-with-me.html" style="color:#00bfa5;">Work With Me</a> •
    <a href="/terms-of-use.html" style="color:#00bfa5;">Terms</a> •
    <a href="/privacy-policy.html" style="color:#00bfa5;">Privacy</a> •
    <a href="/contact.html" style="color:#00bfa5;">Contact</a>
  `;
}
