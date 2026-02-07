function openGame(file) {
            // Updated path structure
            window.location.href = "games/" + file + "/index.html";
        }

        document.addEventListener('DOMContentLoaded', function() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 30;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                const size = Math.random() * 25 + 5;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                
                const colors = ['#6c5ce7', '#00cec9', '#fd79a8', '#ffeaa7', '#55efc4'];
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                const duration = Math.random() * 20 + 10;
                particle.style.animationDuration = `${duration}s`;
                particle.style.animationDelay = `${Math.random() * 5}s`;
                
                particlesContainer.appendChild(particle);
            }
            
            // Hover icons effect
            const gameCards = document.querySelectorAll('.game-card');
            gameCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    const icon = this.querySelector('.game-icon i');
                    if(icon) icon.style.transform = 'scale(1.2)';
                });
                
                card.addEventListener('mouseleave', function() {
                    const icon = this.querySelector('.game-icon i');
                    if(icon) icon.style.transform = 'scale(1)';
                });
            });
        })
