
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

    setLink(
      "challengeCta",
      content.challengeCtaLabel,
      content.challengeCtaUrl
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

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

loadSiteContent();
