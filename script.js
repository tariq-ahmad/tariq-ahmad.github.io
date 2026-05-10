document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Functionality (Dark / Light Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        let theme = 'light';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark';
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        localStorage.setItem('theme', theme);
    });


    // 2. Dynamic Tech Ticker - Architectural Principles
    const techPrinciples = [
        { term: "Microservices", desc: "Isolate failure domains and scale independently, don't just split code." },
        { term: "Event-Driven", desc: "Embrace eventual consistency to decouple services and survive outages." },
        { term: "Agentic AI", desc: "Keep tool execution deterministic, even when the orchestration is probabilistic." },
        { term: "Cloud Native", desc: "Architect for ephemeral infrastructure; treat servers as cattle, not pets." },
        { term: "System Design", desc: "Optimize for maintainability and observability first; scale second." },
        { term: "Zero Trust", desc: "Never trust the network perimeter; authenticate and authorize every request." }
    ];

    const tickerContainer = document.getElementById('tech-ticker');
    const termElement = document.getElementById('ticker-term');
    const descElement = document.getElementById('ticker-desc');
    let currentTickerIndex = 0;

    function updateTechTicker() {
        // Fade out
        tickerContainer.classList.add('ticker-fade');
        
        setTimeout(() => {
            // Update content
            const currentItem = techPrinciples[currentTickerIndex];
            termElement.textContent = currentItem.term;
            descElement.textContent = currentItem.desc;
            
            // Increment index
            currentTickerIndex = (currentTickerIndex + 1) % techPrinciples.length;
            
            // Fade in
            tickerContainer.classList.remove('ticker-fade');
        }, 500); 
    }

    // Initial load
    updateTechTicker();
    
    // Cycle every 6 seconds
    setInterval(updateTechTicker, 6000);

    // 3. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
