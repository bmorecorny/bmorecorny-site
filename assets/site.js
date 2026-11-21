
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function isSafeHref(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  return !/^\s*(javascript|data|vbscript):/i.test(value.trim());
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  }
}

function setHref(id, url) {
  const element = document.getElementById(id);
  if (element && isSafeHref(url)) {
    element.href = url.trim();
  }
}

function setLink(id, label, url) {
  const element = document.getElementById(id);
  if (!element) return;

  if (label !== undefined && label !== null) {
    const arrow = element.querySelector("span");
    const textNode = Array.from(element.childNodes).find(
      node => node.nodeType === Node.TEXT_NODE
    );

    if (textNode) {
      textNode.nodeValue = label + " ";
    } else {
      element.insertBefore(document.createTextNode(label + " "), arrow || null);
    }
  }

  if (isSafeHref(url)) element.href = url.trim();
}

function setButtonLabel(id, label) {
  const element = document.getElementById(id);
  if (!element || label === undefined || label === null) return;

  const arrow = element.querySelector("span");
  const textNode = Array.from(element.childNodes).find(
    node => node.nodeType === Node.TEXT_NODE
  );

  if (textNode) {
    textNode.nodeValue = label + " ";
  } else {
    element.insertBefore(document.createTextNode(label + " "), arrow || null);
  }
}

async function loadSiteContent() {
  try {
    const response = await fetch("content/site.json", { cache: "no-store" });

    if (!response.ok) throw new Error("Content file unavailable");

    const content = await response.json();

    setText("announcement", content.announcement);
    setText("eyebrow", content.eyebrow);

    const headline = document.getElementById("headline");

    if (headline && content.headline) {
      const lines = content.headline.split("\n");

      headline.innerHTML = lines
        .map((line, index) => {
          const safeLine = escapeHtml(line);
          return index === lines.length - 1
            ? `<span>${safeLine}</span>`
            : safeLine;
        })
        .join("<br>");
    }

    setText("intro", content.intro);
    setLink("primaryCta", content.primaryCtaLabel, content.primaryCtaUrl);
    setLink("secondaryCta", content.secondaryCtaLabel, content.secondaryCtaUrl);

    setText("challengeLabel", content.challengeLabel);
    setText("challengeTitle", content.challengeTitle);
    setText("challengeText", content.challengeText);
    setButtonLabel("challengeCta", content.challengeCtaLabel);

    setText("causeTitle", content.causeTitle);
    setText("causeText", content.causeText);
    setText("experienceTitle", content.experienceTitle);
    setText("experienceText", content.experienceText);
    setText("footerLine", content.footerLine);

    const email = document.getElementById("emailLink");

    if (email && content.email) {
      email.href = "mailto:" + content.email;
      setLink("emailLink", content.email, null);
    }

    setHref("instagramLink", content.instagramUrl);
    setHref("facebookLink", content.facebookUrl);

  } catch (error) {
    console.warn("Using built-in BmoreCorny preview content.", error);
  }
}

function setupFooterSignup() {
  const form = document.getElementById("footerSignupForm");
  if (!form) return;

  const emailInput = document.getElementById("footerSignupEmail");
  const consentInput = document.getElementById("footerSignupConsent");
  const honeypot = document.getElementById("footerSignupWebsite");
  const button = document.getElementById("challengeCta");
  const message = document.getElementById("footerSignupMessage");

  if (!emailInput || !consentInput || !button || !message) {
    console.error("100-Footer signup form is missing a required element.");
    return;
  }

  const originalButtonHTML = button.innerHTML;

  function showMessage(text, type) {
    message.textContent = text;
    message.className = "footer-signup-message show " + type;
  }

  function clearMessage() {
    message.textContent = "";
    message.className = "footer-signup-message";
  }

  function setBusy(isBusy) {
    button.disabled = isBusy;
    button.setAttribute("aria-busy", String(isBusy));

    if (isBusy) {
      button.textContent = "ADDING YOU...";
    } else {
      button.innerHTML = originalButtonHTML;
    }
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    clearMessage();

    const email = emailInput.value.trim().toLowerCase();

    if (!emailInput.checkValidity()) {
      emailInput.reportValidity();
      showMessage("Please enter a valid email address.", "error");
      emailInput.focus();
      return;
    }

    if (!consentInput.checked) {
      showMessage(
        "Please check the box to confirm you want to receive 100-Footer email updates.",
        "error"
      );
      consentInput.focus();
      return;
    }

    // Quietly ignore automated submissions that fill the hidden field.
    if (honeypot && honeypot.value.trim()) {
      showMessage(
        "Thanks! You're on our radar for 100-Footer updates.",
        "success"
      );
      form.reset();
      return;
    }

    const config = window.BMORECORNY_CONFIG;

    if (
      !config ||
      !config.SUPABASE_URL ||
      !config.SUPABASE_ANON_KEY ||
      !window.supabase ||
      typeof window.supabase.createClient !== "function"
    ) {
      console.error("Signup configuration or Supabase client is unavailable.", {
        configFound: Boolean(config),
        urlFound: Boolean(config?.SUPABASE_URL),
        keyFound: Boolean(config?.SUPABASE_ANON_KEY),
        clientFound: Boolean(window.supabase?.createClient)
      });

      showMessage(
        "Our signup connection isn't ready right now. Please try again shortly.",
        "error"
      );
      return;
    }

    setBusy(true);
    showMessage("Connecting securely and adding you to the list...", "pending");

    try {
      const client = window.supabase.createClient(
        config.SUPABASE_URL,
        config.SUPABASE_ANON_KEY
      );

      const { data, error } = await client.rpc(
        "subscribe_100_footer",
        { _email: email }
      );

      if (error) {
        console.error("Supabase signup returned an error:", error);
        throw error;
      }

      if (data?.success && data?.already_subscribed) {
        showMessage(
          "You're already on the list! We'll keep you in the loop.",
          "success"
        );
      } else if (data?.success) {
        showMessage(
          "You're on the list! Your email has been added successfully.",
          "success"
        );
      } else {
        throw new Error("The signup service did not confirm your submission.");
      }

      form.reset();

    } catch (error) {
      console.error("100-Footer signup failed:", error);

      const errorText = String(
        error?.message || error?.details || error || ""
      ).toLowerCase();

      if (
        errorText.includes("subscribe_100_footer") &&
        (errorText.includes("not found") || errorText.includes("schema cache"))
      ) {
        showMessage(
          "The signup service hasn't been activated yet. Please try again soon.",
          "error"
        );
      } else if (errorText.includes("valid email")) {
        showMessage("Please enter a valid email address.", "error");
      } else if (
        errorText.includes("failed to fetch") ||
        errorText.includes("network")
      ) {
        showMessage(
          "We couldn't reach the signup service. Check your connection and try again.",
          "error"
        );
      } else {
        showMessage(
          "We couldn't complete your signup. Please try again. If the problem continues, contact hello@bmorecorny.com.",
          "error"
        );
      }

    } finally {
      setBusy(false);
    }
  });
}

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

loadSiteContent();
setupFooterSignup();
