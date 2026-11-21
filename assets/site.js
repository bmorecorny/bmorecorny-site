
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
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  const href = value.trim();

  return !/^\s*(javascript|data|vbscript):/i.test(href);
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
      element.insertBefore(
        document.createTextNode(label + " "),
        arrow || null
      );
    }
  }

  if (isSafeHref(url)) {
    element.href = url.trim();
  }
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
    element.insertBefore(
      document.createTextNode(label + " "),
      arrow || null
    );
  }
}

async function loadSiteContent() {
  try {
    const response = await fetch("content/site.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Content file unavailable");
    }

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

    setLink(
      "primaryCta",
      content.primaryCtaLabel,
      content.primaryCtaUrl
    );

    setLink(
      "secondaryCta",
      content.secondaryCtaLabel,
      content.secondaryCtaUrl
    );

    setText("challengeLabel", content.challengeLabel);
    setText("challengeTitle", content.challengeTitle);
    setText("challengeText", content.challengeText);

    setButtonLabel(
      "challengeCta",
      content.challengeCtaLabel
    );

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
    console.warn(
      "Using built-in BmoreCorny preview content.",
      error
    );
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

  function showMessage(text, type) {
    message.textContent = text;
    message.className = "footer-signup-message show " + type;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    // Quietly ignore automated submissions that fill the hidden field.
    if (honeypot.value.trim()) {
      showMessage(
        "Thanks! You're on our radar for 100-Footer updates.",
        "success"
      );
      form.reset();
      return;
    }

    const config = window.BMORECORNY_CONFIG;

    if (
      !config?.SUPABASE_URL ||
      !config?.SUPABASE_ANON_KEY ||
      !window.supabase?.createClient
    ) {
      showMessage(
        "The signup service is temporarily unavailable. Please try again shortly.",
        "error"
      );
      return;
    }

    const email = emailInput.value.trim().toLowerCase();

    button.disabled = true;
    button.textContent = "ADDING YOU...";

    message.className = "footer-signup-message";
    message.textContent = "";

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
        throw error;
      }

      if (data?.already_subscribed) {
        showMessage(
          "You're already on the list! We'll keep you in the loop.",
          "success"
        );
      } else if (data?.success) {
        showMessage(
          "You're on the list! Keep an eye on your inbox for 100-Footer updates.",
          "success"
        );
      } else {
        throw new Error("The signup could not be confirmed.");
      }

      form.reset();

    } catch (error) {
      console.error("100-Footer signup error:", error);

      showMessage(
        error.message?.includes("valid email")
          ? "Please enter a valid email address."
          : "We couldn't complete your signup. Please try again in a moment.",
        "error"
      );

    } finally {
      button.disabled = false;
      button.innerHTML = "GET ON THE LIST <span>↗</span>";
    }
  });
}

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

loadSiteContent();
setupFooterSignup();
