/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Interface for Category Rate Tiers
interface CategoryRates {
  [key: string]: {
    beginner: number;
    intermediate: number;
    expert: number;
    label: string;
    insight: string;
  };
}

// Hourly Rate Configurations for Teens in INR (₹)
const RATES: CategoryRates = {
  coding: {
    beginner: 150,
    intermediate: 350,
    expert: 700,
    label: "Web & App Development",
    insight: "💡 Coding is the highest paying teen skill! That is enough to pay for standard college tuition or buy advanced software development kits."
  },
  writing: {
    beginner: 100,
    intermediate: 220,
    expert: 450,
    label: "Content & Copywriting",
    insight: "💡 Excellent choice! This earning capacity easily covers premium books, online writing workshops, and academic courses."
  },
  design: {
    beginner: 120,
    intermediate: 280,
    expert: 550,
    label: "Graphic & UI Design",
    insight: "💡 Creative genius! In just 3 months, you can purchase an advanced digital drawing tablet and formal Adobe CC subscriptions."
  },
  social: {
    beginner: 90,
    intermediate: 200,
    expert: 400,
    label: "Social Media & Marketing",
    insight: "💡 Super viral! This monthly income can fund your personal tech gadget upgrades, audio gear, and social marketing audits."
  },
  video: {
    beginner: 130,
    intermediate: 300,
    expert: 600,
    label: "Video Editing & Animation",
    insight: "💡 Cinematic power! You can buy a professional camera or dual monitor editing desk setups inside your first semester of work."
  },
  research: {
    beginner: 80,
    intermediate: 160,
    expert: 320,
    label: "Market Research & Admin",
    insight: "💡 Professional analyst! A perfect initial step to build business management skills and fund high school tutoring guides."
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  initCalculator();
  initFAQ();
});

/* ==========================================
   1. Theme Management (Light / Dark Mode)
   ========================================== */
function initTheme() {
  const toggleBtnDesktop = document.getElementById("theme-toggle-desktop") as HTMLButtonElement | null;
  const toggleBtnMobile = document.getElementById("theme-toggle-mobile") as HTMLButtonElement | null;

  // Read saved theme or check system prefers-color-scheme
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  const handleToggle = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  if (toggleBtnDesktop) {
    toggleBtnDesktop.addEventListener("click", handleToggle);
  }
  if (toggleBtnMobile) {
    toggleBtnMobile.addEventListener("click", handleToggle);
  }
}

/* ==========================================
   2. Mobile Hamburger Navigation Menu
   ========================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn") as HTMLButtonElement | null;
  const mobileMenu = document.getElementById("mobile-menu") as HTMLDivElement | null;
  const hamburgerIcon = document.getElementById("hamburger-icon") as HTMLElement | null;
  const closeIcon = document.getElementById("close-icon") as HTMLElement | null;

  if (!menuBtn || !mobileMenu || !hamburgerIcon || !closeIcon) return;

  const toggleMenu = () => {
    const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!isExpanded));
    mobileMenu.classList.toggle("hidden");
    
    if (isExpanded) {
      hamburgerIcon.classList.remove("hidden");
      hamburgerIcon.classList.add("block");
      closeIcon.classList.remove("block");
      closeIcon.classList.add("hidden");
    } else {
      hamburgerIcon.classList.remove("block");
      hamburgerIcon.classList.add("hidden");
      closeIcon.classList.remove("hidden");
      closeIcon.classList.add("block");
    }
  };

  menuBtn.addEventListener("click", toggleMenu);

  // Close menu when clicking navigation links
  const links = mobileMenu.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      menuBtn.setAttribute("aria-expanded", "false");
      mobileMenu.classList.add("hidden");
      hamburgerIcon.classList.remove("hidden");
      hamburgerIcon.classList.add("block");
      closeIcon.classList.remove("block");
      closeIcon.classList.add("hidden");
    });
  });
}

/* ==========================================
   3. Interactive Earnings Calculator
   ========================================== */
function initCalculator() {
  const selectCategory = document.getElementById("calc-category") as HTMLSelectElement | null;
  const inputHours = document.getElementById("calc-hours") as HTMLInputElement | null;
  const spanHoursVal = document.getElementById("calc-hours-val") as HTMLSpanElement | null;
  
  const btnBeg = document.getElementById("btn-tier-beg") as HTMLButtonElement | null;
  const btnInt = document.getElementById("btn-tier-int") as HTMLButtonElement | null;
  const btnExp = document.getElementById("btn-tier-exp") as HTMLButtonElement | null;
  
  const outMonthly = document.getElementById("calc-monthly-val") as HTMLDivElement | null;
  const outHourly = document.getElementById("calc-hourly-rate") as HTMLSpanElement | null;
  const outAnnual = document.getElementById("calc-annual-val") as HTMLSpanElement | null;
  const outInsight = document.getElementById("calc-insight") as HTMLParagraphElement | null;

  if (!selectCategory || !inputHours || !spanHoursVal || !outMonthly || !outHourly || !outAnnual || !outInsight) return;

  let activeTier: "beginner" | "intermediate" | "expert" = "beginner";

  const updateTierButtons = () => {
    const activeClasses = ["bg-white", "text-brand-indigo", "shadow"];
    const inactiveClasses = ["bg-white/10", "hover:bg-white/25", "text-white"];

    if (btnBeg && btnInt && btnExp) {
      // Clear
      [btnBeg, btnInt, btnExp].forEach(btn => {
        btn.classList.remove(...activeClasses);
        btn.classList.add(...inactiveClasses);
      });

      // Apply
      if (activeTier === "beginner") {
        btnBeg.classList.remove(...inactiveClasses);
        btnBeg.classList.add(...activeClasses);
      } else if (activeTier === "intermediate") {
        btnInt.classList.remove(...inactiveClasses);
        btnInt.classList.add(...activeClasses);
      } else {
        btnExp.classList.remove(...inactiveClasses);
        btnExp.classList.add(...activeClasses);
      }
    }
  };

  const calculate = () => {
    const category = selectCategory.value;
    const hours = parseInt(inputHours.value, 10);
    spanHoursVal.textContent = `${hours} Hours`;

    const ratesObj = RATES[category];
    if (!ratesObj) return;

    const rate = ratesObj[activeTier];
    
    // Weekly = hours * rate; Monthly = Weekly * 4 weeks
    const weeklyEarnings = hours * rate;
    const monthlyEarnings = weeklyEarnings * 4;
    const annualSavings = monthlyEarnings * 12;

    // Format currency to Indian standards if possible or standard readable
    outMonthly.innerHTML = `₹ ${monthlyEarnings.toLocaleString("en-IN")} <span class="text-base font-normal text-white/85">/ month</span>`;
    outHourly.textContent = `₹ ${rate}/hr`;
    outAnnual.textContent = `₹ ${annualSavings.toLocaleString("en-IN")}`;
    
    // Insight matching rates
    outInsight.textContent = ratesObj.insight;
  };

  // Add click listeners to buttons
  if (btnBeg) {
    btnBeg.addEventListener("click", () => {
      activeTier = "beginner";
      updateTierButtons();
      calculate();
    });
  }
  if (btnInt) {
    btnInt.addEventListener("click", () => {
      activeTier = "intermediate";
      updateTierButtons();
      calculate();
    });
  }
  if (btnExp) {
    btnExp.addEventListener("click", () => {
      activeTier = "expert";
      updateTierButtons();
      calculate();
    });
  }

  // Add change listeners
  selectCategory.addEventListener("change", calculate);
  inputHours.addEventListener("input", calculate);

  // Initial Calculation
  calculate();
}

/* ==========================================
   4. Collapsible Accordion (FAQ Section)
   ========================================== */
function initFAQ() {
  const faqItems = [1, 2, 3, 4];
  
  faqItems.forEach(id => {
    const btn = document.getElementById(`faq-btn-${id}`) as HTMLButtonElement | null;
    const body = document.getElementById(`faq-body-${id}`) as HTMLDivElement | null;
    const icon = document.getElementById(`faq-icon-${id}`) as HTMLSpanElement | null;

    if (!btn || !body || !icon) return;

    btn.addEventListener("click", () => {
      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!isExpanded));
      
      if (isExpanded) {
        body.classList.add("hidden");
        icon.innerHTML = `<svg class="w-6 h-6 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;
      } else {
        body.classList.remove("hidden");
        icon.innerHTML = `<svg class="w-6 h-6 transform rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;
      }
    });
  });
}
