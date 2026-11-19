// Nav + footer markup, split out of ./markup.ts so the client-side Nav and
// Footer components don't pull the (server-rendered) homepage sections into
// the browser bundle.

import type { Lang } from '../lib/parsePost'
import { homeCopy } from './copy'

export function navHtml(lang: Lang): string {
  const c = homeCopy[lang]
  return `<nav id="nav" style="position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:18px clamp(20px,5vw,56px);transition:background .4s ease,border-color .4s ease,backdrop-filter .4s ease;border-bottom:1px solid transparent;">
    <a href="/" style="display:flex;align-items:center;gap:12px;text-decoration:none;color:#f2f3f4;">
      <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border:1px solid rgba(255,255,255,.22);border-radius:8px;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:14px;letter-spacing:.04em;">SK</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.7);">Sami Kiias</span>
    </a>
    <button id="nav-toggle" type="button" aria-label="Avaa valikko" aria-expanded="false" aria-controls="nav-links" style="display:none;flex-direction:column;justify-content:center;gap:5px;width:42px;height:42px;padding:0;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.14);border-radius:9px;cursor:pointer;">
      <span style="display:block;width:18px;height:1.5px;background:#f2f3f4;margin:0 auto;transition:transform .25s,opacity .25s;"></span>
      <span style="display:block;width:18px;height:1.5px;background:#f2f3f4;margin:0 auto;transition:transform .25s,opacity .25s;"></span>
      <span style="display:block;width:18px;height:1.5px;background:#f2f3f4;margin:0 auto;transition:transform .25s,opacity .25s;"></span>
    </button>
    <div id="nav-links" style="display:flex;align-items:center;gap:clamp(16px,2.4vw,34px);">
      <a href="#manifesti" style="display:none;text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55);transition:color .25s;" data-hover="color:#f2f3f4;" class="navlink">${c.navManifesto}</a>
      <a href="#projektit" style="text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55);transition:color .25s;" data-hover="color:#f2f3f4;" class="navlink">${c.navProjects}</a>
      <a href="#tech" style="text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55);transition:color .25s;" data-hover="color:#f2f3f4;" class="navlink">${c.navTech}</a>
      <a href="#tarina" style="text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55);transition:color .25s;" data-hover="color:#f2f3f4;" class="navlink">${c.navStory}</a>
      ${`<a href="${lang === 'fi' ? '/mvp-kehitys' : '/en/mvp-development'}" style="text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55);transition:color .25s;" data-hover="color:#f2f3f4;" class="navlink">${c.navServices}</a>`}
      <a href="/blog" style="text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55);transition:color .25s;" data-hover="color:#f2f3f4;" class="navlink">${c.navBlog}</a>
      <a href="#yhteys" style="text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#0a0b0d;background:#f2f3f4;padding:9px 16px;border-radius:8px;font-weight:500;white-space:nowrap;transition:transform .2s,background .2s;" data-hover="transform:translateY(-1px);background:#fff;">${c.navCta}</a>
      <a id="lang-switch" href="#" style="text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55);transition:color .25s;" data-hover="color:#f2f3f4;" class="navlink">${c.navLangSwitch}</a>
    </div>
  </nav>`
}

export const FOOTER_HTML = "<footer style=\"border-top:1px solid rgba(255,255,255,.08);background:#0a0b0d;\">\n    <div style=\"max-width:1280px;margin:0 auto;padding:54px clamp(20px,5vw,56px);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:28px;\">\n      <div>\n        <div style=\"display:flex;align-items:center;gap:12px;margin-bottom:10px;\">\n          <span style=\"display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:1px solid rgba(255,255,255,.2);border-radius:8px;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px;\">SK</span>\n          <span style=\"font-weight:600;font-size:15px;\">Sami Kiias</span>\n        </div>\n        <p style=\"margin:0;font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(255,255,255,.6);\">Tuotantojärjestelmiä, ei demoja.</p>\n      </div>\n      <div style=\"display:flex;gap:24px;\">\n        <a href=\"#\" style=\"text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.08em;color:rgba(255,255,255,.5);transition:color .2s;\" data-hover=\"color:#f2f3f4;\">Blog</a>\n        <a href=\"#\" style=\"text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.08em;color:rgba(255,255,255,.5);transition:color .2s;\" data-hover=\"color:#f2f3f4;\">LinkedIn</a>\n        <a href=\"#\" style=\"text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.08em;color:rgba(255,255,255,.5);transition:color .2s;\" data-hover=\"color:#f2f3f4;\">GitHub</a>\n        <a href=\"#\" style=\"text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.08em;color:rgba(255,255,255,.5);transition:color .2s;\" data-hover=\"color:#f2f3f4;\">YouTube</a>\n      </div>\n    </div>\n    <div style=\"border-top:1px solid rgba(255,255,255,.06);padding:20px clamp(20px,5vw,56px);max-width:1280px;margin:0 auto;\">\n      <p style=\"margin:0;font-family:'JetBrains Mono',monospace;font-size:11.5px;color:rgba(255,255,255,.55);\">© 2026 Sami Kiias. Kaikki oikeudet pidätetään.</p>\n    </div>\n  </footer>";
