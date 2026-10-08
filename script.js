/* ==========================================================================
   CHIKKI - INTERACTIVE JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. Audio Synthesizer (Web Audio API for Meow, Purr, & Crunch FX)
    // ----------------------------------------------------------------------
    let soundEnabled = true;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Cute high pitched cat meow sound
    function playMeowSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            const now = ctx.currentTime;
            
            // Frequency modulation for cute meow
            osc.frequency.setValueAtTime(580, now);
            osc.frequency.exponentialRampToValueAtTime(850, now + 0.15);
            osc.frequency.exponentialRampToValueAtTime(420, now + 0.35);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.4);
        } catch (e) {
            console.log('Audio error:', e);
        }
    }

    // Crunchy treat crunching sound
    function playCrunchSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    const now = ctx.currentTime;
                    
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(150 + Math.random() * 80, now);
                    
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.09);
                }, i * 110);
            }
        } catch (e) {
            console.log('Audio error:', e);
        }
    }

    // Sound toggle button
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggleBtn.innerHTML = soundEnabled ? 
                '<i class="fa-solid fa-volume-high"></i>' : 
                '<i class="fa-solid fa-volume-xmark"></i>';
            soundToggleBtn.title = soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX';
            if (soundEnabled) playMeowSound();
        });
    }

    // ----------------------------------------------------------------------
    // 2. Quote Generator & Petting Station
    // ----------------------------------------------------------------------
    const petBtn = document.getElementById('petBtn');
    const treatBtn = document.getElementById('treatBtn');
    const petCountEl = document.getElementById('petCount');
    const quoteCard = document.getElementById('quoteCard');
    const quoteText = document.getElementById('quoteText');
    const newQuoteBtn = document.getElementById('newQuoteBtn');

    let petCount = 1482;

    const chikkiFunnyQuotes = [
        "Look how cute I am. Why do you ignore me? 😼",
        "Your hostel fees are basically my snack allowance! 🍗",
        "Did you bring snacks or are you just admiring me? 🐾",
        "I slept for 16 hours today and I am still ready for a nap. 💤",
        "I hear a snack packet opening from 3 floors away! 👂",
        "You may now pet my velvety soft fur. 💖",
        "I don't meow for free. My consultation fee is 1 cat treat. 🥩",
        "Your exam score: 40%. My care level: 0%. 😹",
        "I saw you pet another cat outside. Explain yourself. 😾",
        "I'm not fat, I'm just full of hostel gossip. 💬",
        "If I knock your mug off the desk, gravity did it. Not me. ☕",
        "Room inspection in 5 minutes. Hide your cheap treats! 🚨"
    ];

    let currentQuoteIdx = 0;

    function getNextFunnyQuote(e) {
        currentQuoteIdx = (currentQuoteIdx + 1) % chikkiFunnyQuotes.length;
        if (quoteText) {
            quoteText.textContent = `“${chikkiFunnyQuotes[currentQuoteIdx]}”`;
        }
        playMeowSound();
        if (e) triggerFloatingEmoji(e, ['💬', '🐾', '😼', '✨']);
    }

    if (quoteCard) {
        quoteCard.addEventListener('click', (e) => {
            getNextFunnyQuote(e);
        });
    }

    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            getNextFunnyQuote(e);
        });
    }

    function triggerFloatingEmoji(e, emojiList = ['💖', '🐾', '✨', '🌸']) {
        const x = e.clientX || (window.innerWidth / 2);
        const y = e.clientY || (window.innerHeight / 2);

        for (let i = 0; i < 4; i++) {
            const span = document.createElement('span');
            span.className = 'floating-emoji';
            const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
            span.textContent = randomEmoji;
            
            const offsetX = (Math.random() - 0.5) * 60;
            const offsetY = (Math.random() - 0.5) * 40;
            
            span.style.left = `${x + offsetX}px`;
            span.style.top = `${y + offsetY}px`;
            
            document.body.appendChild(span);
            setTimeout(() => span.remove(), 1200);
        }
    }

    if (petBtn) {
        petBtn.addEventListener('click', (e) => {
            petCount++;
            petCountEl.textContent = petCount.toLocaleString();
            playMeowSound();
            triggerFloatingEmoji(e, ['💖', '🐾', '✨', '😻']);

            if (Math.random() > 0.4) {
                getNextFunnyQuote(null);
            }
        });
    }

    if (treatBtn) {
        treatBtn.addEventListener('click', (e) => {
            playCrunchSound();
            triggerFloatingEmoji(e, ['🍗', '🥩', '🥓', '🐾']);
            
            const moodTag = document.getElementById('currentMood');
            if (moodTag) {
                moodTag.textContent = 'Happy & Well Fed 🍗';
                setTimeout(() => {
                    moodTag.textContent = 'Silent Judgement 😼';
                }, 4000);
            }

            increaseSatisfaction(10);
        });
    }

    // ----------------------------------------------------------------------
    // 3. Interactive Chatbot ("Talk to me")
    // ----------------------------------------------------------------------
    const chatDisplay = document.getElementById('chatDisplay');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatOptions = document.getElementById('chatOptions');

    const chikkiBotResponses = {
        "You are cute!": "I know! Now hand over the treats 😼✨",
        "You own this hostel!": "Finally, someone gets it! You get 5 bonus cat points 🐾",
        "Want food?": "DID SOMEONE SAY FOOD?! *runs down 3 flights of stairs* 🍗⚡",
        "Where were you?": "Napping in a box 3 times smaller than me. Don't question my cozy choices 📦💤"
    };

    function addChatMessage(sender, text) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender === 'user' ? 'user-bubble' : 'chikki-bubble'}`;
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (sender === 'chikki') {
            bubble.innerHTML = `
                <span class="chikki-avatar-mini">🐾</span>
                <div class="bubble-content">
                    <p>${text}</p>
                    <span class="timestamp">${timeStr}</span>
                </div>
            `;
        } else {
            bubble.innerHTML = `
                <div class="bubble-content">
                    <p>${text}</p>
                    <span class="timestamp">${timeStr}</span>
                </div>
            `;
        }

        chatDisplay.appendChild(bubble);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    function processChikkiReply(userText) {
        let reply = chikkiBotResponses[userText];

        if (!reply) {
            const textLower = userText.toLowerCase();
            if (textLower.includes('food') || textLower.includes('treat') || textLower.includes('snack')) {
                reply = "Snacks?! I heard that from 3 floors away. Bring it to my hallway spot immediately! 🍗";
            } else if (textLower.includes('love') || textLower.includes('cute') || textLower.includes('pretty')) {
                reply = "I accept your adoration! You may pet me for 3 seconds 💖";
            } else if (textLower.includes('bye') || textLower.includes('go')) {
                reply = "Catch you later! Time for my 4th afternoon nap 💤🐾";
            } else {
                reply = `Chikki stares at you with cute big eyes... then meows: "Bribe me with treats first!" 🐾`;
            }
        }

        setTimeout(() => {
            playMeowSound();
            addChatMessage('chikki', reply);
        }, 500);
    }

    if (chatOptions) {
        chatOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('chat-opt-btn')) {
                const msg = e.target.getAttribute('data-msg');
                addChatMessage('user', msg);
                processChikkiReply(msg);
            }
        });
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = chatInput.value.trim();
            if (!val) return;
            addChatMessage('user', val);
            chatInput.value = '';
            processChikkiReply(val);
        });
    }

    // ----------------------------------------------------------------------
    // 4. Demands Checklist & Satisfaction Bar
    // ----------------------------------------------------------------------
    const demandCheckboxes = document.querySelectorAll('.demand-chk');
    const satisfactionBar = document.getElementById('satisfactionBar');
    const satisfactionText = document.getElementById('satisfactionText');
    const fulfillDemandsBtn = document.getElementById('fulfillDemandsBtn');

    function updateSatisfaction() {
        let checkedCount = 0;
        demandCheckboxes.forEach(chk => {
            if (chk.checked) checkedCount++;
        });

        const total = demandCheckboxes.length;
        const percentage = Math.round((checkedCount / total) * 100);

        if (satisfactionBar) satisfactionBar.style.width = `${percentage}%`;
        if (satisfactionText) satisfactionText.textContent = `${percentage}%`;

        if (percentage === 100) {
            const moodTag = document.getElementById('currentMood');
            if (moodTag) moodTag.textContent = 'Super Happy 🐾';
        }
    }

    function increaseSatisfaction(amount) {
        let current = parseInt(satisfactionText ? satisfactionText.textContent : '85') || 85;
        let nextVal = Math.min(100, current + amount);
        if (satisfactionBar) satisfactionBar.style.width = `${nextVal}%`;
        if (satisfactionText) satisfactionText.textContent = `${nextVal}%`;
    }

    demandCheckboxes.forEach(chk => {
        chk.addEventListener('change', updateSatisfaction);
    });

    if (fulfillDemandsBtn) {
        fulfillDemandsBtn.addEventListener('click', (e) => {
            demandCheckboxes.forEach(chk => chk.checked = true);
            updateSatisfaction();
            playMeowSound();
            triggerFloatingEmoji(e, ['🎉', '🐾', '🍗', '✨']);
        });
    }

    // ----------------------------------------------------------------------
    // 5. Hostel Friendship Tester Quiz
    // ----------------------------------------------------------------------
    const quizQuestion = document.getElementById('quizQuestion');
    const quizResult = document.getElementById('quizResult');
    const retryQuiz = document.getElementById('retryQuiz');

    const quizQuestions = [
        {
            q: "Question 1: Chikki walks into your room at 3 AM. What do you do?",
            opts: [
                { t: "Give up your bed immediately and sleep on the floor.", s: 10 },
                { t: "Offer your snack stash quietly.", s: 8 },
                { t: "Ask her why she's there.", s: 2 }
            ]
        },
        {
            q: "Question 2: Chikki is staring at you from across the hallway. What does it mean?",
            opts: [
                { t: "I have been selected for a friendly cat visit.", s: 10 },
                { t: "She wants treats.", s: 8 },
                { t: "She lost her way.", s: 0 }
            ]
        },
        {
            q: "Question 3: How do you greet Chikki when passing by in the hostel?",
            opts: [
                { t: "A gentle bow with a respectful 'Hello, Madam'.", s: 10 },
                { t: "Psst psst psst psst!", s: 7 },
                { t: "Smile silently and walk past.", s: 4 }
            ]
        }
    ];

    let currentQIdx = 0;
    let totalScore = 0;

    function renderQuizQuestion() {
        if (currentQIdx >= quizQuestions.length) {
            showQuizResult();
            return;
        }

        const qData = quizQuestions[currentQIdx];
        quizQuestion.innerHTML = `
            <h3>${qData.q}</h3>
            <div class="quiz-options">
                ${qData.opts.map(o => `
                    <button class="quiz-btn" data-score="${o.s}">${o.t}</button>
                `).join('')}
            </div>
        `;

        const btns = quizQuestion.querySelectorAll('.quiz-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const s = parseInt(btn.getAttribute('data-score'));
                totalScore += s;
                currentQIdx++;
                renderQuizQuestion();
            });
        });
    }

    function showQuizResult() {
        quizQuestion.classList.add('hidden');
        quizResult.classList.remove('hidden');

        const title = document.getElementById('resultTitle');
        const desc = document.getElementById('resultDesc');
        const badge = document.getElementById('resultBadge');

        if (totalScore >= 25) {
            badge.textContent = '🐾💖';
            title.textContent = 'Chikki\'s Best Buddy!';
            desc.textContent = 'You passed with honors! Chikki loves hanging out outside your room and will grant you cuddle privileges anytime.';
        } else if (totalScore >= 15) {
            badge.textContent = '🍗😼';
            title.textContent = 'Friendly Snack Supplier';
            desc.textContent = 'Chikki likes you, especially if you keep a steady supply of treats handy!';
        } else {
            badge.textContent = '😿🚪';
            title.textContent = 'Work in Progress!';
            desc.textContent = 'Chikki will observe you silently from 3 floors away. Try offering a snack next time!';
        }
    }

    if (retryQuiz) {
        retryQuiz.addEventListener('click', () => {
            currentQIdx = 0;
            totalScore = 0;
            quizResult.classList.add('hidden');
            quizQuestion.classList.remove('hidden');
            renderQuizQuestion();
        });
    }

    renderQuizQuestion();

    // ----------------------------------------------------------------------
    // 6. Gallery Lightbox Modal
    // ----------------------------------------------------------------------
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const modalClose = document.getElementById('modalClose');
    const galleryCards = document.querySelectorAll('.gallery-card');

    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const fullSrc = card.getAttribute('data-full');
            modalImg.src = fullSrc;
            modal.style.display = 'flex';
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    // ----------------------------------------------------------------------
    // 7. Theme Toggle
    // ----------------------------------------------------------------------
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeToggle.innerHTML = isDark ? 
                '<i class="fa-solid fa-sun"></i>' : 
                '<i class="fa-solid fa-moon"></i>';
        });
    }

    // ----------------------------------------------------------------------
    // 8. Background Sparkles & Paw Floating Animation Canvas
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('sparkleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 100;
                this.size = Math.random() * 3 + 1;
                this.speedY = Math.random() * 0.8 + 0.3;
                this.opacity = Math.random() * 0.4 + 0.15;
                this.color = Math.random() > 0.5 ? '#ff7597' : '#ffa4ba';
            }

            update() {
                this.y -= this.speedY;
                if (this.y < -10) this.reset();
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < 35; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }
});
