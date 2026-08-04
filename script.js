// Mobile nav toggle
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.getElementById("mobile-nav");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Signup form (front-end only demo)
const signupForm = document.getElementById("signup");

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();

    if (!email) return;

    let successMsg = signupForm.querySelector(".form-success");
    if (!successMsg) {
      successMsg = document.createElement("p");
      successMsg.className = "form-success";
      signupForm.after(successMsg);
    }
    successMsg.textContent = `Thanks! We'll be in touch at ${email}.`;
    successMsg.classList.add("visible");
    signupForm.reset();
  });
}

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
