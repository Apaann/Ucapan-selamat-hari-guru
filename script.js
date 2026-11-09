const templates = [
  "Terima kasih telah menyalakan cahaya ilmu di hati kami. Setiap kesabaran itu adalah hadiah yang tak ternilai.\n\nSelamat Hari Guru, semoga setiap hari dipenuhi kebahagiaan.",
  "Dari setiap nasihat dan senyum, kami belajar arti tumbuh dengan penuh kasih. Terima kasih sudah percaya pada kami.\n\nSelamat Hari Guru, guru hebat yang selalu kami kenang.",
  "Semoga setiap langkah dipenuhi cinta dan keberkahan. Terima kasih telah menjadi guru terbaik bagi kami.\n\nSelamat Hari Guru! Semoga hari ini penuh senyum dan bunga.",
  "Terima kasih untuk sabar yang tak pernah habis dan kasih yang tak pernah berhenti. Kami bersyukur memiliki guru sebaik Anda.\n\nSelamat Hari Guru, semoga cinta selalu menyertai setiap hari."
];

const petals = ["🌸", "🌷"];
const LETTER_LIFT = 110; // harus sama dengan translateY di .envelope.open .letter (style.css)

const intro = document.getElementById("intro");
const introBtn = document.getElementById("introBtn");
const page = document.getElementById("page");
const head = document.getElementById("head");
const envelope = document.getElementById("envelope");
const letter = document.getElementById("letter");
const actionBtn = document.getElementById("openBtn");
const salamEl = document.getElementById("salam");
const messageEl = document.getElementById("message");

let isOpen = false;
let busy = false;
let typing = false;
let headLifted = false;
let pageIndex = 0;
let fullText = "";
let typingTimer = null;
let startTimer = null;

function setSalam() {
  salamEl.textContent = "Untuk Guru Tercinta,";
}

// Label tombol mengikuti posisi pesan
function setButtonLabel() {
  if (!isOpen) {
    actionBtn.textContent = "Buka Surat";
  } else if (pageIndex === templates.length - 1) {
    actionBtn.textContent = "Tutup Surat";
  } else {
    actionBtn.textContent = "Selanjutnya";
  }
}

// Naikkan judul agar berada di atas surat yang akan keluar
function liftHead() {
  if (headLifted) return;
  const headRect = head.getBoundingClientRect();
  const envRect = envelope.getBoundingClientRect();
  const letterTop = envRect.top + letter.offsetTop - LETTER_LIFT;
  let shift = headRect.bottom - (letterTop - 18);
  shift = Math.min(shift, headRect.top - 6);
  if (shift > 0) head.style.transform = "translateY(" + (-shift) + "px)";
  headLifted = true;
}

function burst(count) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "fall";
    el.textContent = petals[Math.floor(Math.random() * petals.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = 3 + Math.random() * 3 + "s";
    el.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

function typeMessage(text, onDone) {
  clearInterval(typingTimer);
  messageEl.textContent = "";
  let n = 0;
  typingTimer = setInterval(() => {
    n++;
    messageEl.textContent = text.slice(0, n);
    if (n >= text.length) {
      clearInterval(typingTimer);
      typingTimer = null;
      onDone();
    }
  }, 24);
}

// Tampilkan pesan ke-i dengan efek mengetik
function showPage(i) {
  pageIndex = i;
  fullText = templates[i];
  typing = true;
  actionBtn.disabled = false;
  typeMessage(fullText, () => {
    typing = false;
    setButtonLabel();
  });
  burst(8);
}

// Jika pesan masih mengetik, klik tombol akan langsung menampilkan semuanya
function finishTyping() {
  clearTimeout(startTimer);
  clearInterval(typingTimer);
  typingTimer = null;
  messageEl.textContent = fullText;
  typing = false;
  setButtonLabel();
}

function openLetter() {
  if (isOpen || busy) return;
  isOpen = true;
  typing = true;
  pageIndex = 0;
  fullText = templates[0];
  liftHead();
  envelope.classList.add("open");
  setSalam();
  startTimer = setTimeout(() => showPage(0), 650);
}

function closeLetter() {
  if (!isOpen || busy) return;
  isOpen = false;
  busy = true;
  typing = false;
  clearTimeout(startTimer);
  clearInterval(typingTimer);
  typingTimer = null;
  envelope.classList.remove("open");
  head.style.transform = "";
  headLifted = false;
  setButtonLabel();
  setTimeout(() => {
    messageEl.textContent = "";
    pageIndex = 0;
  }, 700);
  setTimeout(() => { busy = false; }, 900);
}

function onActionClick() {
  if (!isOpen) {
    openLetter();
    return;
  }
  if (typing) {
    finishTyping();
    return;
  }
  if (pageIndex < templates.length - 1) {
    showPage(pageIndex + 1);
    setButtonLabel();
  } else {
    closeLetter();
  }
}

introBtn.addEventListener("click", () => {
  intro.classList.add("leave");
  page.hidden = false;
  setTimeout(() => { intro.hidden = true; }, 650);
});

envelope.addEventListener("click", () => {
  if (!isOpen) openLetter();
});

envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (!isOpen) openLetter();
  }
});

actionBtn.addEventListener("click", onActionClick);

setSalam();
setButtonLabel();