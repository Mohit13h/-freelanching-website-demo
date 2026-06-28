/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Freelanching Demo Teen Redesign - Main Script
 */

const RATES = {
  coding: {
    beginner: 150,
    intermediate: 350,
    expert: 700,
    insight: "💡 Coding is the highest paying teen skill! That is enough to pay for standard college tuition or buy advanced software development kits."
  },
  writing: {
    beginner: 100,
    intermediate: 220,
    expert: 450,
    insight: "💡 Excellent choice! This earning capacity easily covers premium books, online writing workshops, and academic courses."
  },
  design: {
    beginner: 120,
    intermediate: 280,
    expert: 550,
    insight: "💡 Creative genius! In just 3 months, you can purchase an advanced digital drawing tablet and formal Adobe CC subscriptions."
  },
  social: {
    beginner: 90,
    intermediate: 200,
    expert: 400,
    insight: "💡 Super viral! This monthly income can fund your personal tech gadget upgrades, audio gear, and social marketing audits."
  },
  video: {
    beginner: 130,
    intermediate: 300,
    expert: 600,
    insight: "💡 Cinematic power! You can buy a professional camera or dual monitor editing desk setups inside your first semester of work."
  },
  research: {
    beginner: 80,
    intermediate: 160,
    expert: 320,
    insight: "💡 Professional analyst! A perfect initial step to build business management skills and fund high school tutoring guides."
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle
  const toggleBtnDesktop = document.getElementById("theme-toggle-desktop");
  const toggleBtnMobile = document.getElementById("theme-toggle-mobile");

  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add("dark");
  }

  const handleToggle = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  if (toggleBtnDesktop) toggleBtnDesktop.addEventListener("click", handleToggle);
  if (toggleBtnMobile) toggleBtnMobile.addEventListener("click", handleToggle);

  // Mobile Menu
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeIcon = document.getElementById("close-icon");

  if (menuBtn && mobileMenu && hamburgerIcon && closeIcon) {
    menuBtn.addEventListener("click", () => {
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
    });
  }

  // Earnings Calculator
  const selectCategory = document.getElementById("calc-category");
  const inputHours = document.getElementById("calc-hours");
  const spanHoursVal = document.getElementById("calc-hours-val");
  
  const btnBeg = document.getElementById("btn-tier-beg");
  const btnInt = document.getElementById("btn-tier-int");
  const btnExp = document.getElementById("btn-tier-exp");
  
  const outMonthly = document.getElementById("calc-monthly-val");
  const outHourly = document.getElementById("calc-hourly-rate");
  const outAnnual = document.getElementById("calc-annual-val");
  const outInsight = document.getElementById("calc-insight");

  if (selectCategory && inputHours && spanHoursVal && outMonthly && outHourly && outAnnual && outInsight) {
    let activeTier = "beginner";

    const updateButtons = () => {
      const activeClasses = ["bg-white", "text-brand-indigo", "shadow"];
      const inactiveClasses = ["bg-white/10", "hover:bg-white/25", "text-white"];

      if (btnBeg && btnInt && btnExp) {
        [btnBeg, btnInt, btnExp].forEach(btn => {
          btn.classList.remove(...activeClasses);
          btn.classList.add(...inactiveClasses);
        });

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
      const weekly = hours * rate;
      const monthly = weekly * 4;
      const annual = monthly * 12;

      outMonthly.innerHTML = `₹ ${monthly.toLocaleString("en-IN")} <span class="text-base font-normal text-white/85">/ month</span>`;
      outHourly.textContent = `₹ ${rate}/hr`;
      outAnnual.textContent = `₹ ${annual.toLocaleString("en-IN")}`;
      outInsight.textContent = ratesObj.insight;
    };

    if (btnBeg) btnBeg.addEventListener("click", () => { activeTier = "beginner"; updateButtons(); calculate(); });
    if (btnInt) btnInt.addEventListener("click", () => { activeTier = "intermediate"; updateButtons(); calculate(); });
    if (btnExp) btnExp.addEventListener("click", () => { activeTier = "expert"; updateButtons(); calculate(); });

    selectCategory.addEventListener("change", calculate);
    inputHours.addEventListener("input", calculate);
    calculate();
  }

  // FAQ Accordion
  [1, 2, 3, 4].forEach(id => {
    const btn = document.getElementById(`faq-btn-${id}`);
    const body = document.getElementById(`faq-body-${id}`);
    const icon = document.getElementById(`faq-icon-${id}`);

    if (btn && body && icon) {
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
    }
  });
});
