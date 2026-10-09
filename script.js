// Mobile nav
const navLinks = document.getElementById("navLinks");
document.getElementById("navToggle").addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("open")));

document.getElementById("year").textContent = new Date().getFullYear();

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("is-visible"), io.unobserve(e.target))),
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Hero chat demo (loops)
const chatBody = document.getElementById("chatBody");
const script = [
  { role: "user", text: "How many days of annual leave do new employees get?" },
  { role: "bot", text: "New full-time employees get 12 days of paid annual leave, plus 1 extra day for every 5 years of service.", cites: ["HR Handbook §4.2", "Leave Policy 2026.pdf"] },
  { role: "user", text: "Great — submit 3 days off for me, Oct 20–22." },
  { role: "tool", text: "→ hr.create_leave_request(start=2026-10-20, days=3)" },
  { role: "bot", text: "Done ✅ Request #LV-1042 was sent to your manager for approval." },
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function addMsg({ role, cites }) {
  const el = document.createElement("div");
  el.className = `msg msg--${role}`;
  const span = document.createElement("span");
  el.appendChild(span);
  if (cites) {
    const wrap = document.createElement("div");
    wrap.hidden = true;
    cites.forEach((c) => {
      const tag = document.createElement("span");
      tag.className = "cite";
      tag.textContent = c;
      wrap.appendChild(tag);
    });
    el.appendChild(wrap);
  }
  chatBody.appendChild(el);
  return { el, span };
}

async function typeInto(span, text) {
  span.classList.add("typing");
  for (const ch of text) {
    span.textContent += ch;
    await sleep(14);
  }
  span.classList.remove("typing");
}

async function runChat() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  while (true) {
    chatBody.innerHTML = "";
    for (const m of script) {
      await sleep(m.role === "user" ? 700 : 500);
      const { el, span } = addMsg(m);
      if (m.role === "bot" && !reduced) await typeInto(span, m.text);
      else span.textContent = m.text;
      const cites = el.querySelector("div");
      if (cites) cites.hidden = false;
    }
    if (reduced) return;
    await sleep(4000);
  }
}
runChat();

// Contact form → opens mail client (no backend needed)
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const subject = encodeURIComponent(`Demo request — ${data.get("company") || "tranhuuhuy"}`);
  const body = encodeURIComponent(`Email: ${data.get("email")}\nCompany: ${data.get("company")}\n\nI'd like a demo of tranhuuhuy.`);
  window.location.href = `mailto:tranhuuhuy297@gmail.com?subject=${subject}&body=${body}`;
  document.getElementById("formNote").textContent = "Thanks! Your email app should open now.";
});
