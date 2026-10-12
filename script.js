'use strict';

const settings = window.BIRTHDAY || {};
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const recipientName = settings.name || 'Anu';

document.querySelectorAll('[data-name]').forEach(element => { element.textContent = recipientName; });
document.title = `Happy Birthday, ${recipientName} ♡`;
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('sender-name').textContent = settings.sender || 'Your favourite person ♡';
document.getElementById('letter-signoff').textContent = settings.signoff || 'With all my love,';

if (Array.isArray(settings.letter) && settings.letter.length) {
  const paragraphs = settings.letter.map(text => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
  });
  document.getElementById('letter-body').replaceChildren(...paragraphs);
}

// The site is readable even if animations or IntersectionObserver are unavailable.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  document.body.classList.add('motion-ready');
}

// Native dialogs provide keyboard focus trapping and Escape-to-close.
const letterDialog = document.getElementById('letter-dialog');
const photoDialog = document.getElementById('photo-dialog');

function openDialog(dialog) {
  dialog.showModal();
  document.body.classList.add('dialog-open');
  dialog.scrollTop = 0;
}

document.getElementById('open-letter').addEventListener('click', () => openDialog(letterDialog));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      dialog.close();
    }
  });
});

// Try common formats without ever showing a broken-image icon to the recipient.
document.querySelectorAll('[data-photo]').forEach((button, index) => {
  const photo = settings.photos?.[index] || {};
  const image = button.querySelector('img');
  const caption = document.querySelector(`[data-caption="${index}"]`);
  if (photo.caption) caption.textContent = photo.caption;
  const preferred = photo.file || `photos/${index + 1}.jpg`;
  const base = preferred.replace(/\.[^/.]+$/, '');
  const candidates = [...new Set([preferred, ...['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP'].map(extension => `${base}.${extension}`)])];
  let attempt = 0;
  image.style.objectPosition = photo.position || 'center';
  image.alt = photo.caption || caption.textContent;
  image.addEventListener('load', () => {
    image.hidden = false;
    button.querySelector('.photo-placeholder').hidden = true;
    button.disabled = false;
    button.setAttribute('aria-label', `View photo: ${caption.textContent}`);
  });
  image.addEventListener('error', () => {
    attempt += 1;
    if (attempt < candidates.length) image.src = candidates[attempt];
  });
  image.src = candidates[attempt];
  button.addEventListener('click', () => {
    if (image.hidden) return;
    const largeImage = document.getElementById('large-photo');
    largeImage.src = image.src;
    largeImage.alt = image.alt;
    document.getElementById('photo-dialog-caption').textContent = caption.textContent;
    openDialog(photoDialog);
  });
});

let confettiTimer;
function celebrate() {
  if (reducedMotion.matches) return;
  const container = document.getElementById('confetti');
  clearTimeout(confettiTimer);
  container.replaceChildren();
  const colors = ['#b86a50', '#abb68c', '#e4be65', '#b1a5c3', '#dea698'];
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 72; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.setProperty('--left', `${Math.random() * 100}%`);
    piece.style.setProperty('--color', colors[index % colors.length]);
    piece.style.setProperty('--duration', `${3 + Math.random() * 2}s`);
    piece.style.setProperty('--delay', `${Math.random() * .7}s`);
    piece.style.setProperty('--drift', `${Math.random() * 200 - 100}px`);
    piece.style.setProperty('--spin', `${Math.random() * 1000 - 500}deg`);
    if (index % 3 === 0) piece.style.borderRadius = '50%';
    fragment.append(piece);
  }
  container.append(fragment);
  confettiTimer = setTimeout(() => container.replaceChildren(), 6000);
}

let wishMade = false;
document.getElementById('wish-button').addEventListener('click', event => {
  if (!wishMade) {
    document.querySelector('.wish-cake').classList.add('is-blown');
    document.getElementById('wish-result').textContent = settings.wishMessage || 'May your wish find its way to you. Happy birthday! ♡';
    event.currentTarget.textContent = 'A little more birthday magic ♡';
    wishMade = true;
  }
  celebrate();
});

// A soft, original pentatonic music-box loop. Audio starts only on a deliberate tap.
const musicButton = document.getElementById('music-button');
const musicLabel = document.getElementById('music-label');
let audioContext;
let audioMaster;
let musicTimer;
let musicPlaying = false;
let musicPending = false;
let nextNoteTime = 0;
let noteIndex = 0;
const melody = [72, 76, 79, 83, 81, 79, 76, null, 74, 79, 81, 86, 83, 79, 76, null, 72, 76, 81, 79, 76, 74, 72, null];

function scheduleNotes() {
  while (nextNoteTime < audioContext.currentTime + .8) {
    const note = melody[noteIndex % melody.length];
    if (note !== null) {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 440 * Math.pow(2, (note - 69) / 12);
      gain.gain.setValueAtTime(0, nextNoteTime);
      gain.gain.linearRampToValueAtTime(.12, nextNoteTime + .02);
      gain.gain.exponentialRampToValueAtTime(.001, nextNoteTime + 1.65);
      oscillator.connect(gain);
      gain.connect(audioMaster);
      oscillator.start(nextNoteTime);
      oscillator.stop(nextNoteTime + 1.7);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    }
    nextNoteTime += .48;
    noteIndex += 1;
  }
}

function updateMusicButton() {
  musicButton.setAttribute('aria-pressed', String(musicPlaying));
  musicButton.setAttribute('aria-label', musicPlaying ? 'Pause gentle birthday music' : 'Play gentle birthday music');
  musicLabel.textContent = musicPlaying ? 'Sound on' : 'Sound off';
}

async function stopMusic() {
  clearInterval(musicTimer);
  musicPlaying = false;
  updateMusicButton();
  if (audioContext && audioContext.state === 'running') await audioContext.suspend();
}

musicButton.addEventListener('click', async () => {
  if (musicPending) return;
  musicPending = true;
  try {
    if (musicPlaying) {
      await stopMusic();
    } else {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('Audio is unavailable');
      if (!audioContext) {
        audioContext = new AudioContextClass();
        audioMaster = audioContext.createGain();
        audioMaster.gain.value = .4;
        audioMaster.connect(audioContext.destination);
      }
      await audioContext.resume();
      if (!document.hidden) {
        nextNoteTime = Math.max(nextNoteTime, audioContext.currentTime + .05);
        scheduleNotes();
        musicTimer = setInterval(scheduleNotes, 250);
        musicPlaying = true;
        updateMusicButton();
      } else {
        await audioContext.suspend();
      }
    }
  } catch {
    await stopMusic().catch(() => {});
    musicLabel.textContent = 'Sound unavailable';
    musicButton.setAttribute('aria-label', 'Sound unavailable in this browser');
  } finally {
    musicPending = false;
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && musicPlaying) stopMusic().catch(() => {});
});