/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

document.addEventListener("DOMContentLoaded", () => {
  initDashboardTheme();
  initMobileSidebar();
  initTabNavigation();
  initProjectFilters();
  initChatSystem();
  initLiveDate();
});

/* ==========================================
   1. Theme Management (Dashboard Settings)
   ========================================== */
function initDashboardTheme() {
  const themeToggle = document.getElementById("theme-toggle-dashboard") as HTMLButtonElement | null;
  const toggleDot = themeToggle?.querySelector("span");

  const updateToggleUI = (isDark: boolean) => {
    if (themeToggle && toggleDot) {
      if (isDark) {
        themeToggle.classList.remove("bg-slate-200");
        themeToggle.classList.add("bg-brand-indigo");
        toggleDot.classList.remove("left-0.5");
        toggleDot.classList.add("left-5");
      } else {
        themeToggle.classList.remove("bg-brand-indigo");
        themeToggle.classList.add("bg-slate-200");
        toggleDot.classList.remove("left-5");
        toggleDot.classList.add("left-0.5");
      }
    }
  };

  // Onload check
  const isCurrentlyDark = document.documentElement.classList.contains("dark");
  updateToggleUI(isCurrentlyDark);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDarkNow = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDarkNow ? "dark" : "light");
      updateToggleUI(isDarkNow);
    });
  }
}

/* ==========================================
   2. Mobile Sidebar Drawer Toggle
   ========================================== */
function initMobileSidebar() {
  const toggleBtn = document.getElementById("mobile-sidebar-toggle") as HTMLButtonElement | null;
  const closeBtn = document.getElementById("mobile-sidebar-close") as HTMLButtonElement | null;
  const sidebar = document.getElementById("sidebar") as HTMLElement | null;
  const overlay = document.getElementById("sidebar-overlay") as HTMLDivElement | null;

  if (!toggleBtn || !sidebar || !overlay) return;

  const openSidebar = () => {
    sidebar.classList.remove("-translate-x-full");
    overlay.classList.remove("hidden");
  };

  const closeSidebar = () => {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  };

  toggleBtn.addEventListener("click", openSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);
}

/* ==========================================
   3. Tab Navigation System (Dashboard Tabs)
   ========================================== */
function initTabNavigation() {
  const sidebarItems = document.querySelectorAll(".sidebar-item") as NodeListOf<HTMLButtonElement>;
  const tabContents = document.querySelectorAll(".tab-content") as NodeListOf<HTMLElement>;
  const sidebar = document.getElementById("sidebar") as HTMLElement | null;
  const overlay = document.getElementById("sidebar-overlay") as HTMLDivElement | null;
  const welcomeMsg = document.getElementById("welcome-message") as HTMLHeadingElement | null;

  const switchTab = (tabId: string) => {
    // Hide all tab content
    tabContents.forEach(content => {
      content.classList.remove("active");
    });

    // Show selected tab content
    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) {
      targetTab.classList.add("active");
    }

    // Update sidebar items state styling
    sidebarItems.forEach(item => {
      const dataTab = item.getAttribute("data-tab");
      if (dataTab === tabId) {
        item.classList.add("sidebar-active");
      } else {
        item.classList.remove("sidebar-active");
      }
    });

    // Dynamic header welcoming change
    if (welcomeMsg) {
      if (tabId === "overview") {
        welcomeMsg.textContent = "Hello, Aarav!";
      } else if (tabId === "projects") {
        welcomeMsg.textContent = "Active Project Board";
      } else if (tabId === "earnings") {
        welcomeMsg.textContent = "Earning Statement";
      } else if (tabId === "certificates") {
        welcomeMsg.textContent = "My Credentials";
      } else if (tabId === "messages") {
        welcomeMsg.textContent = "Communication Hub";
      } else if (tabId === "profile") {
        welcomeMsg.textContent = "Professional Portfolio";
      } else if (tabId === "settings") {
        welcomeMsg.textContent = "Preferences & Settings";
      }
    }

    // Close mobile drawer if open
    if (sidebar && overlay && window.innerWidth < 768) {
      sidebar.classList.add("-translate-x-full");
      overlay.classList.add("hidden");
    }

    // Scroll to top of window smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  sidebarItems.forEach(item => {
    item.addEventListener("click", () => {
      const tabId = item.getAttribute("data-tab");
      if (tabId) {
        switchTab(tabId);
      }
    });
  });

  // Enable dashboard edit profile trigger
  const profileTrigger = document.querySelector('[data-tab="profile"]') as HTMLButtonElement | null;
  const headerEditBtn = document.querySelector('button[data-tab="profile"]') as HTMLButtonElement | null;
  if (headerEditBtn) {
    headerEditBtn.addEventListener("click", () => {
      switchTab("profile");
    });
  }

  // Check URL query parameters to load specific tabs (e.g. ?tab=settings)
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get("tab");
  const validTabs = ["overview", "projects", "earnings", "certificates", "messages", "profile", "settings"];
  
  if (initialTab && validTabs.includes(initialTab)) {
    switchTab(initialTab);
  }
}

/* ==========================================
   4. Projects Filter Management
   ========================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll("#project-filters button") as NodeListOf<HTMLButtonElement>;
  const projectRows = document.querySelectorAll(".project-row") as NodeListOf<HTMLTableRowElement>;

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      // Reset button styles
      filterButtons.forEach(b => {
        b.className = "px-4 py-1.5 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-lg whitespace-nowrap dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300";
      });

      // Highlight active button
      btn.className = "px-4 py-1.5 bg-brand-indigo text-white text-xs font-bold rounded-lg whitespace-nowrap shadow-sm shadow-brand-indigo/15";

      // Filter rows
      projectRows.forEach(row => {
        const rowStatus = row.getAttribute("data-status");
        if (filter === "all" || rowStatus === filter) {
          row.style.display = "table-row";
        } else {
          row.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================
   5. Interactive Live Chat System
   ========================================== */
function initChatSystem() {
  const chatForm = document.getElementById("chat-form") as HTMLFormElement | null;
  const chatInput = document.getElementById("chat-input") as HTMLInputElement | null;
  const messagesStream = document.getElementById("chat-messages-stream") as HTMLDivElement | null;
  const chatTitle = document.getElementById("chat-title") as HTMLHeadingElement | null;
  
  const convoShopify = document.getElementById("convo-shopify") as HTMLButtonElement | null;
  const convoSwiggy = document.getElementById("convo-swiggy") as HTMLButtonElement | null;

  if (!chatForm || !chatInput || !messagesStream) return;

  let activeConvo: "shopify" | "swiggy" = "shopify";

  // Mock messages lists for both clients
  const shopifyMessages = `
    <div class="flex items-start gap-2.5 max-w-sm">
      <div class="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
        <p>Hi Aarav, thanks for sending over the initially drafted designs for our store banner redesign! They look incredibly fresh and fits the teenage audience beautifully.</p>
        <span class="block text-[9px] text-slate-400 font-semibold text-right mt-1.5 font-mono">10:45 AM</span>
      </div>
    </div>
    <div class="flex items-start gap-2.5 max-w-sm ml-auto">
      <div class="p-3 bg-brand-indigo text-white rounded-2xl rounded-tr-none ml-auto shadow shadow-brand-indigo/10">
        <p>Thank you! I am glad you liked the initial layouts. I kept the illustrations vibrant and high-contrast to catch eyes.</p>
        <span class="block text-[9px] text-indigo-200 text-right mt-1.5 font-mono">10:52 AM</span>
      </div>
    </div>
    <div class="flex items-start gap-2.5 max-w-sm">
      <div class="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
        <p>Awesome. Can you adjust the font tracking slightly on the final header sketch? Once that is done, submit it on the panel and I will approve the payout instantly!</p>
        <span class="block text-[9px] text-slate-400 font-semibold text-right mt-1.5 font-mono">11:05 AM</span>
      </div>
    </div>
  `;

  const swiggyMessages = `
    <div class="flex items-start gap-2.5 max-w-sm">
      <div class="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
        <p>Hey Aarav! Our social team reviewed your Instagram grid creative briefs. They loved the foodie color palette!</p>
        <span class="block text-[9px] text-slate-400 font-semibold text-right mt-1.5 font-mono">Yesterday • 2:10 PM</span>
      </div>
    </div>
    <div class="flex items-start gap-2.5 max-w-sm ml-auto">
      <div class="p-3 bg-brand-indigo text-white rounded-2xl rounded-tr-none ml-auto shadow shadow-brand-indigo/10">
        <p>Thanks a lot! I made sure they match the Swiggy typography guidelines exactly.</p>
        <span class="block text-[9px] text-indigo-200 text-right mt-1.5 font-mono">Yesterday • 3:00 PM</span>
      </div>
    </div>
    <div class="flex items-start gap-2.5 max-w-sm">
      <div class="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
        <p>Excellent work! Earning approved and sent to wallet. The work completion certificate is also available now.</p>
        <span class="block text-[9px] text-slate-400 font-semibold text-right mt-1.5 font-mono">Yesterday • 4:32 PM</span>
      </div>
    </div>
  `;

  // Switching conversations
  const setConvo = (convo: "shopify" | "swiggy") => {
    activeConvo = convo;
    
    if (convo === "shopify") {
      messagesStream.innerHTML = shopifyMessages;
      if (chatTitle) chatTitle.textContent = "Shopify India Support";
      convoShopify?.classList.add("bg-slate-100/70", "dark:bg-slate-700/50");
      convoSwiggy?.classList.remove("bg-slate-100/70", "dark:bg-slate-700/50");
    } else {
      messagesStream.innerHTML = swiggyMessages;
      if (chatTitle) chatTitle.textContent = "Swiggy Campaign Team";
      convoSwiggy?.classList.add("bg-slate-100/70", "dark:bg-slate-700/50");
      convoShopify?.classList.remove("bg-slate-100/70", "dark:bg-slate-700/50");
    }
    
    // Auto scroll stream to bottom
    messagesStream.scrollTop = messagesStream.scrollHeight;
  };

  convoShopify?.addEventListener("click", () => setConvo("shopify"));
  convoSwiggy?.addEventListener("click", () => setConvo("swiggy"));

  // Form submit (sending a chat)
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append outgoing bubble
    const userBubble = document.createElement("div");
    userBubble.className = "flex items-start gap-2.5 max-w-sm ml-auto";
    userBubble.innerHTML = `
      <div class="p-3 bg-brand-indigo text-white rounded-2xl rounded-tr-none ml-auto shadow shadow-brand-indigo/10">
        <p>${escapeHtml(text)}</p>
        <span class="block text-[9px] text-indigo-200 text-right mt-1.5 font-mono">${timeStr}</span>
      </div>
    `;
    messagesStream.appendChild(userBubble);
    chatInput.value = "";
    
    // Auto scroll bottom
    messagesStream.scrollTop = messagesStream.scrollHeight;

    // Simulate smart delayed automated response matching client personality
    setTimeout(() => {
      const incomingBubble = document.createElement("div");
      incomingBubble.className = "flex items-start gap-2.5 max-w-sm";
      
      let clientText = "Thank you for the message! We will get back to you shortly.";
      if (activeConvo === "shopify") {
        clientText = "Perfect, thank you Aarav! I have received this and will pass it on to our creative lead for final approval. Great job!";
      } else {
        clientText = "Thanks for the heads up, Aarav! We will review any pending assets soon.";
      }

      incomingBubble.innerHTML = `
        <div class="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
          <p>${clientText}</p>
          <span class="block text-[9px] text-slate-400 font-semibold text-right mt-1.5 font-mono">${timeStr}</span>
        </div>
      `;
      messagesStream.appendChild(incomingBubble);
      
      // Scroll bottom
      messagesStream.scrollTop = messagesStream.scrollHeight;
    }, 1500);

  });

  // Helper function to prevent HTML injections in mock messaging
  function escapeHtml(str: string) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

/* ==========================================
   6. Live Calendar Date display
   ========================================== */
function initLiveDate() {
  const dateSpan = document.getElementById("live-date") as HTMLSpanElement | null;
  if (!dateSpan) return;

  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  
  // Format matching Indian english standard or general
  dateSpan.textContent = now.toLocaleDateString("en-IN", options);
}
