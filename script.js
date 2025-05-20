// DOM Elements
const registerBtn = document.getElementById('register-btn');
const formContainer = document.querySelector('.form-container');
const form = document.getElementById('registration-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const termsCheckbox = document.getElementById('terms');
const submitBtn = document.getElementById('submit-btn');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.getElementById('strength-text');
const successMessage = document.getElementById('success-message');

// Event Listeners
// 1. Show/Hide form on button hover
registerBtn.addEventListener('mouseenter', showForm);
registerBtn.addEventListener('mouseleave', hideForm);
formContainer.addEventListener('mouseenter', showForm);
formContainer.addEventListener('mouseleave', hideForm);

// 2. Form validation on submit
form.addEventListener('submit', validateForm);

// 3. Real-time password strength meter
passwordInput.addEventListener('input', checkPasswordStrength);

// 4. Real-time validation on input blur
usernameInput.addEventListener('blur', validateUsername);
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);
confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

// Functions
let formTimeout;

function showForm() {
    clearTimeout(formTimeout);
    formContainer.classList.add('show');
}

function hideForm() {
    formTimeout = setTimeout(() => {
        // Only hide if we're not focusing on any form element
        if (!isFormFocused()) {
            formContainer.classList.remove('show');
        }
    }, 500);
}

function isFormFocused() {
    const focusedElement = document.activeElement;
    return form.contains(focusedElement);
}

// Form validation functions
function validateForm(e) {
    e.preventDefault();
    
    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const isTermsChecked = validateTerms();
    
    if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isTermsChecked) {
        // Show success message with animation
        successMessage.style.display = 'block';
        submitBtn.disabled = true;
        
        // Simulate form submission and redirect
        setTimeout(() => {
            form.reset();
            // In a real application, you would submit the form data to a server here
            successMessage.style.display = 'none';
            submitBtn.disabled = false;
            formContainer.classList.remove('show');
        }, 3000);
    }
}

function validateUsername() {
    const username = usernameInput.value.trim();
    const errorElement = usernameInput.nextElementSibling;
    
    if (username === '') {
        showError(usernameInput, errorElement, 'Username cannot be empty');
        return false;
    } else if (username.length < 3) {
        showError(usernameInput, errorElement, 'Username must be at least 3 characters');
        return false;
    } else {
        clearError(usernameInput, errorElement);
        return true;
    }
}

function validateEmail() {
    const email = emailInput.value.trim();
    const errorElement = emailInput.nextElementSibling;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email === '') {
        showError(emailInput, errorElement, 'Email cannot be empty');
        return false;
    } else if (!emailRegex.test(email)) {
        showError(emailInput, errorElement, 'Please enter a valid email');
        return false;
    } else {
        clearError(emailInput, errorElement);
        return true;
    }
}

function validatePassword() {
    const password = passwordInput.value;
    const errorElement = passwordInput.nextElementSibling;
    
    if (password === '') {
        showError(passwordInput, errorElement, 'Password cannot be empty');
        return false;
    } else if (password.length < 8) {
        showError(passwordInput, errorElement, 'Password must be at least 8 characters');
        return false;
    } else {
        clearError(passwordInput, errorElement);
        return true;
    }
}

function validateConfirmPassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const errorElement = confirmPasswordInput.nextElementSibling;
    
    if (confirmPassword === '') {
        showError(confirmPasswordInput, errorElement, 'Please confirm your password');
        return false;
    } else if (confirmPassword !== password) {
        showError(confirmPasswordInput, errorElement, 'Passwords do not match');
        return false;
    } else {
        clearError(confirmPasswordInput, errorElement);
        return true;
    }
}

function validateTerms() {
    const errorElement = termsCheckbox.parentElement.querySelector('.error-message');
    
    if (!termsCheckbox.checked) {
        showError(termsCheckbox, errorElement, 'You must accept the terms and conditions');
        return false;
    } else {
        clearError(termsCheckbox, errorElement);
        return true;
    }
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
}

function clearError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
}

// Password strength meter
function checkPasswordStrength() {
    const password = passwordInput.value;
    let strength = 0;
    
    // Clear existing classes
    strengthBar.className = 'strength-bar';
    
    if (password.length === 0) {
        strengthText.textContent = 'None';
        return;
    }
    
    // Check length
    if (password.length >= 8) strength += 1;
    
    // Check for mixed case
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
    
    // Check for numbers
    if (password.match(/\d/)) strength += 1;
    
    // Check for special characters
    if (password.match(/[^a-zA-Z\d]/)) strength += 1;
    
    // Set strength meter styles and text based on score
    switch (strength) {
        case 0:
        case 1:
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Weak';
            break;
        case 2:
        case 3:
            strengthBar.classList.add('medium');
            strengthText.textContent = 'Medium';
            break;
        case 4:
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Strong';
            break;
    }
}

// Prevent closing form when interacting with form elements
form.addEventListener('mouseenter', () => {
    clearTimeout(formTimeout);
});

// Ensure form stays visible when focused
form.addEventListener('focusin', showForm);

// Add interactive ripple effect on buttons
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('click', createRippleEffect);
});

function createRippleEffect(e) {
    const button = e.currentTarget;
    
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - diameter / 2}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - diameter / 2}px`;
    circle.classList.add('ripple');
    
    // Remove existing ripples
    const ripple = button.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
    
    // Remove ripple after animation
    setTimeout(() => {
        circle.remove();
    }, 600);
}

// Add this CSS for the ripple effect
const style = document.createElement('style');
style.textContent = `
    button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);