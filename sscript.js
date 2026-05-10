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


    // 2. LIVE Wikipedia API Data Fetching for Tech Ticker
    // List of Wikipedia article titles related to your expertise
    const wikiTerms = [
        'Microservices', 
        'Distributed_computing', 
        'Event-driven_architecture', 
        'Cloud_native_computing', 
        'Software_architecture', 
        'Machine_learning',
        'API_First',
        'Representational_state_transfer',
        'Fault_tolerance',
        'Scalability'
    ];

    const tickerContainer = document.getElementById('tech-ticker');
    const termElement = document.getElementById('ticker-term');
    const descElement = document.getElementById('ticker-desc');

    async function fetchTechTerm() {
        // Fade out
        tickerContainer.classList.add('ticker-fade');
        
        // Pick a random term
        const randomTerm = wikiTerms[Math.floor(Math.random() * wikiTerms.length)];
        let displayTitle = randomTerm.replace(/_/g, ' ');
        let displayDesc = "Architecting for scale, high availability, and fault tolerance.";

        try {
            // Fetch live summary from Wikipedia REST API
            const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${randomTerm}`);
            
            if (response.ok) {
                const data = await response.json();
                displayTitle = data.title;
                
                // Extract just the first sentence of the Wikipedia summary
                const firstSentence = data.extract.split('. ')[0] + '.';
                
                // Truncate if it's unusually long
                displayDesc = firstSentence.length > 130 ? firstSentence.substring(0, 127) + '...' : firstSentence;
            }
        } catch (error) {
            console.log("Using fallback term due to fetch error.");
        }

        // Wait for CSS fade out, update text, then fade in
        setTimeout(() => {
            termElement.textContent = displayTitle;
            descElement.textContent = displayDesc;
            tickerContainer.classList.remove('ticker-fade');
        }, 500); 
    }

    // Initial fetch immediately on load
    fetchTechTerm();
    
    // Fetch a new live definition every 9 seconds
    setInterval(fetchTechTerm, 9000);


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
