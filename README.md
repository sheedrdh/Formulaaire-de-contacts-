
🎨 Dynamic Contact Form
<img scr ="https://img.shields.io/badge/HTML5-Structure-orange"  alt="HTML5" />
<img src="https://img.shields.io/badge/CSS3-Styling-blue" alt="CSS3" />
<img src="https://img.shields.io/badge/CSS3-Styling-blue" alt="CSS3" />
<img src="https://img.shields.io/badge/JavaScript-Interactive-yellow" alt="JavaScript" />
<img src="https://img.shields.io/badge/Design-Responsive-success" alt="Responsive" />
<img src="https://img.shields.io/badge/Status-Production--Ready-brightgreen" alt="Status" />
A modern and responsive contact form built with HTML5, CSS3, and Vanilla JavaScript, featuring a dynamic RGB / HSL background that reacts smoothly to mouse movement.

✨ Features

🎨 Dynamic background based on mouse X & Y position
🌈 Smooth RGB / HSL gradient transitions
⚡ Optimized animation using requestAnimationFrame
📱 Fully responsive layout
💎 Modern UI design
🖱️ Interactive hover effects
✅ Client - side form validation


📂 Project Structure
dynamic - contact - form /          
│
├── index.html
├── style.css
└── script.js

🧱 Technologies Used
Copier le tableau


Technology
Purpose



HTML5
Semantic structure


CSS3
Styling & animations


JavaScript(ES6)
Interactivity & dynamic effects



🖥️ Preview
The background dynamically changes based on:

Mouse X position → Hue
Mouse Y position → Lightness
Smooth animated updates
Real - time gradient transformation


🎯 Dynamic Background Logic
The animation maps the mouse position to HSL color values:
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animate() {
    const x = mouseX / window.innerWidth;
    const y = mouseY / window.innerHeight;

    const hue = x * 360;
    const lightness = 40 + y * 40;

    document.body.style.background =
        `hsl(${hue}, 70%, ${lightness}%)`;

    requestAnimationFrame(animate);
}

animate();

🎨 CSS Highlights

Smooth transitions(0.3s ease)
Hover effects on inputs & button
Modern shadows
Flexible layout(Flexbox)
Mobile - first responsive design


📱 Responsive Design
The form adapts seamlessly to:

✅ Desktop
✅ Tablet
✅ Mobile


🚀 Getting Started

Clone the repository:

git clone https://github.com/sheedrdh/Formulaaire-de-contacts-.git

Open index.html in your browser.

No build tools required.No dependencies.Pure HTML, CSS & JavaScript.

🔥 Performance Optimization

Uses requestAnimationFrame for smooth rendering
Lightweight(no frameworks)
Hardware - accelerated CSS transitions


📌 Browser Support

Chrome ✅
Firefox ✅
Edge ✅
Safari ✅