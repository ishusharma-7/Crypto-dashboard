// theme.js

// Function to toggle the theme
function toggleTheme() {
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark') {
        body.classList.remove('dark');
        body.classList.add('light');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light');
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Function to initialize theme on page load
function initializeTheme() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
    } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
    }
}

// Add event listener to the button
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme(); // Set the initial theme on load
    const toggleButton = document.getElementById('modeToggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleTheme);
    }
});

function logout(){

localStorage.clear()

location="index.html"

}
