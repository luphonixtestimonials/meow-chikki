/* ==========================================================================
   CHIKKI'S KINGDOM - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let soundEnabled = true;
  let totalPets = parseInt(localStorage.getItem('chikki_pets') || '0');
  let totalTreats = parseInt(localStorage.getItem('chikki_treats') || '0');
  let audioCtx = null;

  // Initialize Audio Context lazily on user gesture
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Synthesize Cute Cat Meow Sound using Web Audio API
  function playSynthesizedMeow(pitch = 1) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      
      const now = ctx.currentTime;
      // Meow pitch contour: starts at ~550Hz, sweeps up to ~750Hz, then gently slides down to ~400Hz
      osc.frequency.setValueAtTime(550 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(780 * pitch, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(420 * pitch, now + 0.45);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    } catch (e) {
      console.log('Audio playback prevented or unsupported');
    }
  }

  // Synthesize Purr Sound
  function playSynthesizedPurr() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Low frequency rumble for purr
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin(i / 15);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 180;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {}
  }

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playSynthesizedMeow(1.2);
  });

  // UI Counters Update
  const petCounterBadge = document.getElementById('pet-counter-badge');
  const treatsGivenStat = document.getElementById('treats-given-stat');

  function updateCountersUI() {
    petCounterBadge.textContent = `${totalPets} Pets 💖`;
    treatsGivenStat.textContent = totalTreats.toString();
    localStorage.setItem('chikki_pets', totalPets);
    localStorage.setItem('chikki_treats', totalTreats);
  }
  updateCountersUI();

  // Floating Hearts Effect Generator
  function createFloatingHeart(x, y, emoji = '💖') {
    const container = document.getElementById('heart-particles');
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = emoji;

    // Random slight offset
    const offsetX = (Math.random() - 0.5) * 40;
    heart.style.left = `${x + offsetX}px`;
    heart.style.top = `${y}px`;

    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 3800);
  }

  // Petting Action Handler
  function handlePetting(e) {
    totalPets++;
    updateCountersUI();
    playSynthesizedMeow(1.1 + Math.random() * 0.2);

    const clientX = e.clientX || window.innerWidth / 2;
    const clientY = e.clientY || window.innerHeight / 2;
    
    const emojis = ['💖', '🐾', '😻', '✨', '🌸'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    createFloatingHeart(clientX, clientY, randomEmoji);

    // Update petting simulator meter if in simulator
    increasePettingHappiness(10);
  }

  const petChikkiBtn = document.getElementById('pet-chikki-btn');
  const chikkiHeroImg = document.getElementById('chikki-hero-img');

  petChikkiBtn.addEventListener('click', handlePetting);
  chikkiHeroImg.parentElement.addEventListener('click', handlePetting);

  // Quick Treat Button
  const quickTreatBtn = document.getElementById('quick-treat-btn');
  quickTreatBtn.addEventListener('click', (e) => {
    totalTreats++;
    updateCountersUI();
    playSynthesizedMeow(1.4); // Excited meow
    createFloatingHeart(e.clientX, e.clientY, '🐟');

    // Add bot chat message if user is near chat
    addChatMessage('bot', 'OMNOMNOM! 🐟 Delicious treat! You are officially my favorite human today!');
  });

  /* ==========================================================================
     GUILT METER INTERACTIVITY
     ========================================================================== */
  const guiltSlider = document.getElementById('guilt-slider');
  const guiltPercent = document.getElementById('guilt-percent');
  const reactionEmoji = document.getElementById('reaction-emoji');
  const reactionTitle = document.getElementById('reaction-title');
  const reactionText = document.getElementById('reaction-text');
  const fixGuiltBtn = document.getElementById('fix-guilt-btn');

  const guiltReactions = [
    {
      max: 15,
      emoji: '😸',
      title: 'Chikki is Purring Happily!',
      text: '"Good job! You gave me belly rubs and acknowledged my royal presence. You may pass."'
    },
    {
      max: 45,
      emoji: '😼',
      title: 'Chikki is Slightly Suspicious...',
      text: '"You walked past me to go to class. I will allow it, but only if you bring a chicken bite back."'
    },
    {
      max: 75,
      emoji: '😾',
      title: 'Chikki is Offended!',
      text: '"How dare you ignore my adorable green eyes? I am planning to sit on your open laptop while you type."'
    },
    {
      max: 100,
      emoji: '🙀💥',
      title: 'MAXIMUM GUILT - Hostile Cat Level!',
      text: '"UNACCEPTABLE! You ignored me completely! I am knocking your water bottle off your desk RIGHT NOW!"'
    }
  ];

  function updateGuiltMeter() {
    const val = parseInt(guiltSlider.value);
    guiltPercent.textContent = `${val}%`;

    const reaction = guiltReactions.find(r => val <= r.max) || guiltReactions[guiltReactions.length - 1];
    reactionEmoji.textContent = reaction.emoji;
    reactionTitle.textContent = reaction.title;
    reactionText.textContent = reaction.text;
  }

  guiltSlider.addEventListener('input', updateGuiltMeter);
  fixGuiltBtn.addEventListener('click', () => {
    guiltSlider.value = 0;
    updateGuiltMeter();
    totalTreats++;
    updateCountersUI();
    playSynthesizedMeow(1.3);
    createFloatingHeart(window.innerWidth / 2, window.innerHeight / 2, '🍗');
  });

  /* ==========================================================================
     SASSY QUOTES GENERATOR
     ========================================================================== */
  const sassyQuotes = [
    "You walked past me without saying pspsps. I am deducting 15 points from your GPA.",
    "Your assignment deadline is temporary, but my hunger is eternal.",
    "I don't need your approval, I need your hostel mess chicken.",
    "If I fit, I sit. If I don't fit... I still sit.",
    "I crash 8 AM lectures just to demonstrate superior sleep form.",
    "I am not begging for food, I am reminding you of your duty.",
    "That open textbook on your desk looks like a great sleeping pillow.",
    "If you stare at me for more than 5 seconds, you owe me 2 treatos."
  ];

  const quoteDisplayText = document.getElementById('quote-display-text');
  const generateQuoteBtn = document.getElementById('generate-quote-btn');

  generateQuoteBtn.addEventListener('click', (e) => {
    const randomIndex = Math.floor(Math.random() * sassyQuotes.length);
    quoteDisplayText.style.opacity = '0';
    playSynthesizedMeow(0.9);

    setTimeout(() => {
      quoteDisplayText.textContent = `"${sassyQuotes[randomIndex]}"`;
      quoteDisplayText.style.opacity = '1';
    }, 200);

    createFloatingHeart(e.clientX, e.clientY, '✨');
  });

  /* ==========================================================================
     CHIKKI AI CHATBOT SYSTEM
     ========================================================================== */
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const clearChatBtn = document.getElementById('clear-chat-btn');
  const chipBtns = document.querySelectorAll('.chip-btn');

  function addChatMessage(sender, text) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}-bubble`;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (sender === 'bot') {
      bubble.innerHTML = `
        <div class="bubble-avatar">
          <img src="chikki.jpg" alt="Chikki">
        </div>
        <div class="bubble-content">
          <p>${text}</p>
          <span class="chat-timestamp">${timeStr}</span>
        </div>
      `;
    } else {
      bubble.innerHTML = `
        <div class="bubble-avatar user-avatar">
          👤
        </div>
        <div class="bubble-content">
          <p>${text}</p>
          <span class="chat-timestamp">${timeStr}</span>
        </div>
      `;
    }

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Generate Sassy Hostel Cat Bot Responses
  function getChikkiBotResponse(userMsg) {
    const msg = userMsg.toLowerCase();

    if (msg.includes('ignore') || msg.includes('cute') || msg.includes('why')) {
      return "Look how cute I am! 🥺 You walked right past me! You owe me 3 belly rubs and a piece of chicken immediately!";
    }
    if (msg.includes('treat') || msg.includes('food') || msg.includes('fish') || msg.includes('chicken') || msg.includes('eat')) {
      totalTreats++;
      updateCountersUI();
      return "MEOW! 🐟 Did somebody say TREATS?! Give them to me right now and I will let you pet my ears!";
    }
    if (msg.includes('gossip') || msg.includes('hostel') || msg.includes('room')) {
      return "Hostel gossip? 🤫 Room 302 hides the best cat snacks, and Room 104 forgets to close their door at night so I sleep on their beanbag!";
    }
    if (msg.includes('love') || msg.includes('cute') || msg.includes('like')) {
      return "I love you 90% if you have treats, and 20% if you don't. Keep the chicken coming and we remain best friends! 💖";
    }
    if (msg.includes('psps') || msg.includes('meow') || msg.includes('hi') || msg.includes('hello')) {
      return "Meow meow meow! 🐾 Welcome to my corridor! Are you here to pet me or pay the chicken tax?";
    }
    if (msg.includes('exam') || msg.includes('study') || msg.includes('gpa')) {
      return "Stop studying for exams! Sit on the floor and pet me instead. My purrs guarantee +10 bonus marks! 🎓";
    }

    const genericResponses = [
      "Meow! 🐾 I am listening, but only if it involves food.",
      "Purrrrrr... Excuse me, I need to nap on someone's warm keyboard now.",
      "Did you know I own every chair in this hostel? Pay rent in cat treats!",
      "I am looking at you with my big green eyes. Why aren't you petting me right now? 🥺"
    ];

    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    addChatMessage('user', text);
    chatInput.value = '';

    // Simulate typing delay & sound
    setTimeout(() => {
      playSynthesizedMeow(1.2);
      const botReply = getChikkiBotResponse(text);
      addChatMessage('bot', botReply);
    }, 600);
  });

  chipBtns.forEach(chip => {
    chip.addEventListener('click', () => {
      const msg = chip.getAttribute('data-msg');
      chatInput.value = msg;
      chatForm.dispatchEvent(new Event('submit'));
    });
  });

  clearChatBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    addChatMessage('bot', 'Chat cleared! Meow! What do you want to tell Chikki now? 🐾');
  });

  /* ==========================================================================
     CAT MINI-GAMES HUB
     ========================================================================== */
  // Game Tab Navigation
  const tabBtns = document.querySelectorAll('.tab-btn');
  const gamePanels = document.querySelectorAll('.game-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      gamePanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const gameId = btn.getAttribute('data-game');
      document.getElementById(`${gameId}-container`).classList.add('active');
    });
  });

  /* --- GAME 1: Treat Catcher Arcade Canvas --- */
  const canvas = document.getElementById('treat-canvas');
  const ctx = canvas.getContext('2d');
  const startGameBtn = document.getElementById('start-game-btn');
  const gameOverlay = document.getElementById('game-overlay');
  const treatGameScoreEl = document.getElementById('treat-game-score');
  const treatGameHighScoreEl = document.getElementById('treat-game-highscore');
  const treatGameLivesEl = document.getElementById('treat-game-lives');

  let gameRunning = false;
  let gameScore = 0;
  let highScore = parseInt(localStorage.getItem('chikki_game_highscore') || '0');
  let gameLives = 3;
  let animationFrameId = null;

  treatGameHighScoreEl.textContent = highScore.toString();

  // Player Basket (Chikki Bowl)
  const player = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 50,
    width: 80,
    height: 35,
    speed: 8
  };

  let fallingItems = [];

  const itemTypes = [
    { type: 'fish', emoji: '🐟', score: 10, isBad: false },
    { type: 'chicken', emoji: '🍗', score: 20, isBad: false },
    { type: 'milk', emoji: '🥛', score: 15, isBad: false },
    { type: 'heart', emoji: '💖', score: 30, isBad: false },
    { type: 'spray', emoji: '🚿', score: 0, isBad: true },
    { type: 'broccoli', emoji: '🥦', score: -10, isBad: false }
  ];

  function spawnFallingItem() {
    const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    fallingItems.push({
      x: Math.random() * (canvas.width - 40) + 20,
      y: -30,
      speed: 2 + Math.random() * 3.5,
      ...randomItem
    });
  }

  // Keyboard state
  const keys = { Left: false, Right: false };
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.Left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.Right = true;
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.Left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.Right = false;
  });

  // Mouse / Touch Controls for Canvas
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    player.x = (e.clientX - rect.left) * scaleX - player.width / 2;
  });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      player.x = (e.touches[0].clientX - rect.left) * scaleX - player.width / 2;
    }
  }, { passive: true });

  function updateGameLoop() {
    if (!gameRunning) return;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player Movement via Keys
    if (keys.Left && player.x > 0) player.x -= player.speed;
    if (keys.Right && player.x < canvas.width - player.width) player.x += player.speed;

    // Keep Player bounded
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

    // Draw Chikki Bowl / Paw Player
    ctx.fillStyle = '#ff3377';
    ctx.beginPath();
    ctx.roundRect(player.x, player.y, player.width, player.height, 16);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Fredoka, sans-serif';
    ctx.fillText('🐾 Chikki', player.x + 8, player.y + 24);

    // Spawn items periodically
    if (Math.random() < 0.04) {
      spawnFallingItem();
    }

    // Update & Draw Items
    for (let i = fallingItems.length - 1; i >= 0; i--) {
      const item = fallingItems[i];
      item.y += item.speed;

      // Draw Emoji
      ctx.font = '26px sans-serif';
      ctx.fillText(item.emoji, item.x - 13, item.y);

      // Collision Check with Player
      if (
        item.y >= player.y &&
        item.y <= player.y + player.height &&
        item.x >= player.x - 10 &&
        item.x <= player.x + player.width + 10
      ) {
        // Caught item!
        if (item.isBad) {
          gameLives--;
          playSynthesizedMeow(0.6); // Sad meow
          updateLivesUI();
          if (gameLives <= 0) {
            endTreatGame();
            return;
          }
        } else {
          gameScore += item.score;
          if (gameScore < 0) gameScore = 0;
          treatGameScoreEl.textContent = gameScore.toString();
          playSynthesizedMeow(1.3);
        }

        fallingItems.splice(i, 1);
        continue;
      }

      // Offscreen Check
      if (item.y > canvas.height + 30) {
        fallingItems.splice(i, 1);
      }
    }

    animationFrameId = requestAnimationFrame(updateGameLoop);
  }

  function updateLivesUI() {
    let hearts = '';
    for (let i = 0; i < gameLives; i++) hearts += '❤️';
    treatGameLivesEl.textContent = hearts || '💀';
  }

  function startTreatGame() {
    gameScore = 0;
    gameLives = 3;
    fallingItems = [];
    gameRunning = true;
    treatGameScoreEl.textContent = '0';
    updateLivesUI();
    gameOverlay.style.display = 'none';

    updateGameLoop();
  }

  function endTreatGame() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);

    if (gameScore > highScore) {
      highScore = gameScore;
      localStorage.setItem('chikki_game_highscore', highScore);
      treatGameHighScoreEl.textContent = highScore.toString();
    }

    document.getElementById('overlay-title').textContent = 'Game Over! 🐾';
    document.getElementById('overlay-desc').innerHTML = `You collected <strong>${gameScore} points</strong> for Chikki!<br>High Score: <strong>${highScore}</strong>`;
    startGameBtn.textContent = 'Play Again 🚀';
    gameOverlay.style.display = 'flex';
  }

  startGameBtn.addEventListener('click', startTreatGame);

  /* --- GAME 2: Laser Pointer Chase --- */
  const laserArena = document.getElementById('laser-arena');
  const laserDot = document.getElementById('laser-dot');
  const catPawTarget = document.getElementById('cat-paw-target');
  const laserPounceScoreEl = document.getElementById('laser-pounce-score');
  const laserComboScoreEl = document.getElementById('laser-combo-score');

  let pounceCount = 0;
  let comboCount = 0;

  laserArena.addEventListener('click', (e) => {
    const rect = laserArena.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Move Laser Dot
    laserDot.style.left = `${x}px`;
    laserDot.style.top = `${y}px`;

    // Move Cat Paw after slight delay
    setTimeout(() => {
      catPawTarget.style.left = `${x}px`;
      catPawTarget.style.top = `${y}px`;
      
      pounceCount++;
      comboCount++;
      laserPounceScoreEl.textContent = pounceCount.toString();
      laserComboScoreEl.textContent = `${comboCount}x`;

      playSynthesizedMeow(1.2 + (comboCount % 5) * 0.1);
      createFloatingHeart(e.clientX, e.clientY, '🔴');
    }, 180);
  });

  /* --- GAME 3: Petting & Purr Simulator --- */
  const petInteractiveTarget = document.getElementById('pet-interactive-target');
  const happinessFill = document.getElementById('happiness-fill');
  const happinessText = document.getElementById('happiness-text');
  const relationshipTitle = document.getElementById('relationship-title');
  const giveCatnipBtn = document.getElementById('give-catnip-btn');

  let currentHappiness = 20;

  function increasePettingHappiness(amount) {
    currentHappiness += amount;
    if (currentHappiness > 100) currentHappiness = 100;

    happinessFill.style.width = `${currentHappiness}%`;
    
    if (currentHappiness < 40) {
      happinessText.textContent = `${currentHappiness}% - Slightly Content`;
      relationshipTitle.textContent = "Chikki's Casual Acquaintance 🐾";
    } else if (currentHappiness < 75) {
      happinessText.textContent = `${currentHappiness}% - Purring Happily!`;
      relationshipTitle.textContent = "Chief Treat Dispenser & Friend 🍖";
    } else {
      happinessText.textContent = `${currentHappiness}% - MAX LOVE! Purring Machine!`;
      relationshipTitle.textContent = "Chikki's Favorite Hostelmate 👑💖";
    }
  }

  petInteractiveTarget.addEventListener('click', (e) => {
    increasePettingHappiness(8);
    playSynthesizedPurr();
    createFloatingHeart(e.clientX, e.clientY, '💖');
  });

  giveCatnipBtn.addEventListener('click', (e) => {
    increasePettingHappiness(30);
    playSynthesizedMeow(1.5);
    createFloatingHeart(e.clientX, e.clientY, '🌿');
  });

  /* ==========================================================================
     FOOTER SURPRISE HEART EXPLOSION
     ========================================================================== */
  const surpriseBtn = document.getElementById('surprise-btn');
  surpriseBtn.addEventListener('click', () => {
    playSynthesizedMeow(1.4);
    for (let i = 0; i < 35; i++) {
      setTimeout(() => {
        const randomX = Math.random() * window.innerWidth;
        const randomY = window.innerHeight - 50;
        const emojis = ['💖', '🐾', '✨', '😻', '🌸', '🍗', '👑'];
        createFloatingHeart(randomX, randomY, emojis[Math.floor(Math.random() * emojis.length)]);
      }, i * 70);
    }
  });
});
