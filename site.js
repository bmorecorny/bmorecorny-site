async function loadSiteContent(){
  try{
    const response = await fetch("content/site.json", {cache:"no-store"});
    if(!response.ok) throw new Error("Content file unavailable");
    const c = await response.json();
    const setText=(id,value)=>{const el=document.getElementById(id);if(el && value!==undefined)el.textContent=value;};
    const setLink=(id,label,url)=>{const el=document.getElementById(id);if(el){el.textContent=label;el.href=url||"#";}};
    setText("announcement",c.announcement);
    setText("eyebrow",c.eyebrow);
    const h=document.getElementById("headline"); if(h && c.headline) h.innerHTML=c.headline.split("\n").map((line,i)=>i===2?`<span>${escapeHtml(line)}</span>`:escapeHtml(line)).join("<br>");
    setText("intro",c.intro);
    setLink("primaryCta",c.primaryCtaLabel,c.primaryCtaUrl);
    setLink("secondaryCta",c.secondaryCtaLabel,c.secondaryCtaUrl);
    setText("challengeLabel",c.challengeLabel);
    setText("challengeTitle",c.challengeTitle);
    setText("challengeText",c.challengeText);
    setLink("challengeCta",c.challengeCtaLabel,c.challengeCtaUrl);
    setText("causeTitle",c.causeTitle);
    setText("causeText",c.causeText);
    setText("experienceTitle",c.experienceTitle);
    setText("experienceText",c.experienceText);
    setText("footerLine",c.footerLine);
    const email=document.getElementById("emailLink"); if(email){email.textContent=c.email;email.href="mailto:"+c.email;}
    const ig=document.getElementById("instagramLink"); if(ig) ig.href=c.instagramUrl||"#";
    const fb=document.getElementById("facebookLink"); if(fb) fb.href=c.facebookUrl||"#";
  }catch(e){console.warn("Using built-in BmoreCorny preview content.",e);}
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
document.getElementById("year").textContent=new Date().getFullYear();
loadSiteContent();
