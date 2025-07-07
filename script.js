class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.lapTimes = [];
        this.lapCounter = 1;

        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.millisecondsDisplay = document.getElementById('milliseconds');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.lapList = document.getElementById('lapList');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());

        // Add ripple effect to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', this.createRipple);
        });
    }

    createRipple(event) {
        const button = event.currentTarget;
        const ripple = button.querySelector('.btn-ripple');
        
        // Reset ripple
        ripple.style.width = '0';
        ripple.style.height = '0';
        
        // Trigger ripple animation
        setTimeout(() => {
            ripple.style.width = '300px';
            ripple.style.height = '300px';
        }, 10);
    }

    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => this.updateTimer(), 10);
            this.isRunning = true;
            
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.lapBtn.disabled = false;
            
            // Add animation class to time display
            this.timeDisplay.style.animation = 'none';
            setTimeout(() => {
                this.timeDisplay.style.animation = 'pulse 1s ease-in-out infinite';
            }, 10);
        }
    }

    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.lapBtn.disabled = true;
            
            // Remove pulse animation
            this.timeDisplay.style.animation = 'none';
        }
    }

    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.elapsedTime = 0;
        this.lapTimes = [];
        this.lapCounter = 1;
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.lapBtn.disabled = true;
        
        this.updateDisplay();
        this.updateLapDisplay();
        
        // Remove pulse animation
        this.timeDisplay.style.animation = 'pulse 2s ease-in-out infinite';
        
        // Add reset animation
        this.timeDisplay.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.timeDisplay.style.transform = 'scale(1)';
        }, 200);
    }

    updateTimer() {
        this.elapsedTime = Date.now() - this.startTime;
        this.updateDisplay();
    }

    updateDisplay() {
        const time = this.formatTime(this.elapsedTime);
        this.timeDisplay.textContent = time.main;
        this.millisecondsDisplay.textContent = time.milliseconds;
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10);

        return {
            main: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            milliseconds: ms.toString().padStart(2, '0') + '0'
        };
    }

    recordLap() {
        if (this.isRunning) {
            const lapTime = this.elapsedTime;
            this.lapTimes.push({
                number: this.lapCounter++,
                time: lapTime,
                formattedTime: this.formatTime(lapTime)
            });
            
            this.updateLapDisplay();
            
            // Add visual feedback
            this.lapBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.lapBtn.style.transform = 'scale(1)';
            }, 150);
        }
    }

    updateLapDisplay() {
        if (this.lapTimes.length === 0) {
            this.lapList.innerHTML = '<div class="no-laps">No lap times recorded</div>';
            return;
        }

        const lapHTML = this.lapTimes
            .slice()
            .reverse()
            .map(lap => `
                <div class="lap-item">
                    <span class="lap-number">Lap ${lap.number}</span>
                    <span class="lap-time">${lap.formattedTime.main}:${lap.formattedTime.milliseconds}</span>
                </div>
            `)
            .join('');

        this.lapList.innerHTML = lapHTML;
    }
}

// Initialize the stopwatch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Stopwatch();
    
    // Add some extra visual effects
    addVisualEffects();
});

function addVisualEffects() {
    // Add floating animation to buttons on hover
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });

    // Add parallax effect to floating shapes
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.shape');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 50;
            const y = (mouseY - 0.5) * speed * 50;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                const startBtn = document.getElementById('startBtn');
                const pauseBtn = document.getElementById('pauseBtn');
                
                if (!startBtn.disabled) {
                    startBtn.click();
                } else if (!pauseBtn.disabled) {
                    pauseBtn.click();
                }
                break;
            case 'KeyR':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    document.getElementById('resetBtn').click();
                }
                break;
            case 'KeyL':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    const lapBtn = document.getElementById('lapBtn');
                    if (!lapBtn.disabled) {
                        lapBtn.click();
                    }
                }
                break;
        }
    });
}

// Add performance optimization for animations
function optimizeAnimations() {
    // Reduce animations on low-performance devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.documentElement.style.setProperty('--animation-duration', '0.5s');
    }
    
    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        const shapes = document.querySelectorAll('.shape');
        if (document.hidden) {
            shapes.forEach(shape => {
                shape.style.animationPlayState = 'paused';
            });
        } else {
            shapes.forEach(shape => {
                shape.style.animationPlayState = 'running';
            });
        }
    });
}

// Initialize performance optimizations
optimizeAnimations();