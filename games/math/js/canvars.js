const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas on window resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Array of math symbols
const symbols = [
  "+", "-", "×", "÷", "=", "≠", "≈", ">", "<", "≥", "≤", "±", "‰", "%", 
  "√", "∛", "∜", "∫", "∬", "∭", "∂", "∇", "∞", "∑", "∏", "∆", "∝", "∠", "∥", "⊥", "°", 
  "α", "β", "γ", "δ", "ε", "θ", "λ", "μ", "π", "σ", "φ", "ω", 
  "∈", "∉", "⊂", "⊃", "∪", "∩", "∅", "∀", "∃", "∴", "∵", 
  "≅", "∼", "′", "″", 
  "∫", "∮", "d", "lim", "∂", "∇", 
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ",", "e", "i", 
  "∧", "∨", "¬", "→", "↔", "⊕", 
  "!", "| |", "≡", "≪", "≫", "♾️",
  "()","<","[]","{}",">"
];

// Mouse position for interaction
const mouse = {
    x: null,
    y: null
};

// Track mouse movement
window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Particle class
class Particle {
    constructor(x, y, size, color, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedY = speedY;
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        this.alpha = 1;
    }

    draw() {
        ctx.globalAlpha = this.alpha; // Apply fading effect
        ctx.font = `${this.size}px "Courier New", monospace`;
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y);
        ctx.globalAlpha = 1; // Reset alpha
    }

    update() {
        this.y += this.speedY;
        this.alpha -= 0.005; // Gradual fade effect

        // Reset particle
        if (this.y > canvas.height + 20 || this.alpha <= 0) {
            this.y = 0 - this.size;
            this.x = Math.random() * canvas.width;
            this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
            this.alpha = 1;
        }

        // Interactive effect: repel from mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
            this.x += dx * 0.02; // Slight push effect
            this.y += dy * 0.02;
        }
    }
}

// Generate particles
let particlesArray = [];
function initParticles() {
    particlesArray = [];
    const numParticles = 100; // More particles
    for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 30 + 10;
        const color = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`; // Random white transparency
        const speedY = Math.random() * 2 + 1;
        particlesArray.push(new Particle(x, y, size, color, speedY));
    }
}

// Create background gradient
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#000");
    gradient.addColorStop(1, "#222");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Animation loop
function animate() {
    drawBackground();
    particlesArray.forEach((particle) => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animate);
}

// Initialize and start animation
initParticles();
animate();