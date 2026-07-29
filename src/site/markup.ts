// Auto-generated from the Claude Design export "Sami Kiias.dc.html".
// Faithful markup port: the design's vanilla-JS runtime (support.js) is
// re-implemented as a React hook in ./effects.ts. The original `style-hover`
// attributes are renamed to `data-hover` and wired up by wireHover().
// NAV_HTML/SECTIONS_HTML were converted to functions of `lang`, interpolating
// from the bilingual copy dict in ./copy.ts.

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
      <a href="/blog" style="text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55);transition:color .25s;" data-hover="color:#f2f3f4;" class="navlink">${c.navBlog}</a>
      <a href="#yhteys" style="text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#0a0b0d;background:#f2f3f4;padding:9px 16px;border-radius:8px;font-weight:500;white-space:nowrap;transition:transform .2s,background .2s;" data-hover="transform:translateY(-1px);background:#fff;">${c.navCta}</a>
      <a id="lang-switch" href="#" style="text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55);transition:color .25s;" data-hover="color:#f2f3f4;" class="navlink">${c.navLangSwitch}</a>
    </div>
  </nav>`
}

export function sectionsHtml(lang: Lang): string {
  const c = homeCopy[lang]
  return `<!-- HERO -->
  <header id="top" style="position:relative;min-height:100vh;display:flex;align-items:center;padding:120px clamp(20px,5vw,56px) 60px;overflow:hidden;">
    <!-- bg layers -->
    <canvas id="hero-canvas" style="position:absolute;inset:0;width:100%;height:100%;z-index:0;"></canvas>
    <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:56px 56px;animation:gridDrift 6s linear infinite;mask-image:radial-gradient(ellipse 90% 70% at 50% 35%,#000 25%,transparent 75%);-webkit-mask-image:radial-gradient(ellipse 90% 70% at 50% 35%,#000 25%,transparent 75%);"></div>
    <div style="position:absolute;top:-30%;left:50%;transform:translateX(-50%);width:90vw;height:80vh;background:radial-gradient(ellipse at center,rgba(255,255,255,.08),transparent 60%);filter:blur(20px);animation:glowPulse 7s ease-in-out infinite;pointer-events:none;"></div>
    <div id="spotlight" style="position:absolute;inset:0;background:radial-gradient(420px circle at 50% 40%,rgba(255,255,255,.06),transparent 60%);pointer-events:none;transition:background .2s ease;"></div>
    <div style="position:absolute;left:0;right:0;height:140px;background:linear-gradient(rgba(255,255,255,.07),transparent);animation:scanSweep 9s linear infinite;pointer-events:none;"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,#0a0b0d 100%);pointer-events:none;"></div>

    <div style="position:relative;z-index:2;width:100%;max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(32px,5vw,72px);align-items:center;">
      <!-- left -->
      <div>
        <div data-reveal data-delay="0" style="display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.14);border-radius:100px;padding:7px 14px 7px 12px;margin-bottom:30px;background:rgba(255,255,255,.02);">
          <span style="position:relative;display:inline-flex;width:8px;height:8px;">
            <span style="position:absolute;inset:0;border-radius:50%;background:#f2f3f4;animation:ping 2.2s cubic-bezier(0,0,.2,1) infinite;"></span>
            <span style="position:relative;width:8px;height:8px;border-radius:50%;background:#f2f3f4;"></span>
          </span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.75);">${c.heroBadge}</span>
        </div>

        <h1 data-reveal data-delay="80" style="margin:0;font-weight:600;font-size:clamp(3rem,7.4vw,6.8rem);line-height:.94;letter-spacing:-.035em;">
          <span style="display:block;color:rgba(255,255,255,.42);">${c.heroTitleA}</span>
          <span style="display:block;color:#f7f8f9;">${c.heroTitleB}</span>
        </h1>

        <p data-reveal data-delay="160" style="margin:26px 0 0;font-size:clamp(1.05rem,1.4vw,1.32rem);font-weight:500;color:rgba(255,255,255,.66);">${c.heroTitleC}</p>

        <p data-reveal data-delay="220" style="margin:14px 0 0;font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:.04em;color:rgba(255,255,255,.5);">${c.heroSub}</p>

        <p data-reveal data-delay="280" style="margin:28px 0 0;max-width:540px;font-size:16.5px;line-height:1.62;color:rgba(255,255,255,.56);">${c.heroBody}</p>

        <div data-reveal data-delay="340" style="display:flex;flex-wrap:wrap;gap:14px;margin-top:34px;">
          <a href="#yhteys" style="display:inline-flex;align-items:center;gap:10px;text-decoration:none;background:#f2f3f4;color:#0a0b0d;font-weight:600;font-size:15px;padding:14px 22px;border-radius:10px;transition:transform .2s,box-shadow .2s;" data-hover="transform:translateY(-2px);box-shadow:0 12px 30px rgba(255,255,255,.12);">${c.heroCta1} <span style="font-family:'JetBrains Mono',monospace;">→</span></a>
          <a href="#projektit" style="display:inline-flex;align-items:center;gap:10px;text-decoration:none;border:1px solid rgba(255,255,255,.18);color:#e9eaec;font-weight:500;font-size:15px;padding:14px 22px;border-radius:10px;transition:border-color .2s,background .2s;" data-hover="border-color:rgba(255,255,255,.4);background:rgba(255,255,255,.04);">${c.heroCta2}</a>
        </div>

        <div data-reveal data-delay="420" style="display:flex;flex-wrap:wrap;gap:clamp(24px,4vw,52px);margin-top:48px;">
          <div>
            <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:clamp(1.9rem,3vw,2.6rem);color:#f7f8f9;letter-spacing:-.02em;">${c.heroStat1v}</div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.42);margin-top:4px;">${c.heroStat1l}</div>
          </div>
          <div>
            <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:clamp(1.9rem,3vw,2.6rem);color:#f7f8f9;letter-spacing:-.02em;">${c.heroStat2v}</div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.42);margin-top:4px;">${c.heroStat2l}</div>
          </div>
          <div>
            <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:clamp(1.9rem,3vw,2.6rem);color:#f7f8f9;letter-spacing:-.02em;">${c.heroStat3v}</div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.42);margin-top:4px;">${c.heroStat3l}</div>
          </div>
        </div>
      </div>

      <!-- right: terminal -->
      <div data-reveal data-delay="240" style="position:relative;animation:floatY 8s ease-in-out infinite;">
        <div style="position:absolute;inset:-1px;border-radius:16px;background:linear-gradient(160deg,rgba(255,255,255,.18),transparent 50%);"></div>
        <div style="position:relative;border:1px solid rgba(255,255,255,.1);border-radius:15px;background:rgba(14,16,19,.85);backdrop-filter:blur(8px);box-shadow:0 30px 80px rgba(0,0,0,.6);overflow:hidden;">
          <div style="display:flex;align-items:center;gap:8px;padding:13px 16px;border-bottom:1px solid rgba(255,255,255,.07);">
            <span style="width:11px;height:11px;border-radius:50%;background:rgba(255,255,255,.18);"></span>
            <span style="width:11px;height:11px;border-radius:50%;background:rgba(255,255,255,.12);"></span>
            <span style="width:11px;height:11px;border-radius:50%;background:rgba(255,255,255,.08);"></span>
            <span style="margin-left:10px;font-family:'JetBrains Mono',monospace;font-size:11.5px;color:rgba(255,255,255,.4);">${c.heroTerminalTitle}</span>
          </div>
          <div style="padding:20px 18px 22px;min-height:268px;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.85;">
            <div style="color:rgba(255,255,255,.4);">samikiias@rascal:~$ <span style="color:rgba(255,255,255,.85);">./status</span></div>
            <div id="term-output"></div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- TECH MARQUEE -->
  <div style="position:relative;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);padding:22px 0;overflow:hidden;background:#0c0d10;">
    <div style="display:flex;width:max-content;animation:marquee 32s linear infinite;will-change:transform;">
      <div style="display:flex;align-items:center;gap:44px;padding-right:44px;font-family:'JetBrains Mono',monospace;font-size:14px;letter-spacing:.06em;color:rgba(255,255,255,.4);text-transform:uppercase;">
        <span>n8n</span><span style="opacity:.3;">/</span><span>Supabase</span><span style="opacity:.3;">/</span><span>React</span><span style="opacity:.3;">/</span><span>Voice AI</span><span style="opacity:.3;">/</span><span>RAG</span><span style="opacity:.3;">/</span><span>Multi-tenant</span><span style="opacity:.3;">/</span><span>Claude</span><span style="opacity:.3;">/</span><span>TypeScript</span><span style="opacity:.3;">/</span><span>VAPI</span><span style="opacity:.3;">/</span><span>Vercel</span><span style="opacity:.3;">/</span><span>pgvector</span><span style="opacity:.3;">/</span>
      </div>
      <div style="display:flex;align-items:center;gap:44px;padding-right:44px;font-family:'JetBrains Mono',monospace;font-size:14px;letter-spacing:.06em;color:rgba(255,255,255,.4);text-transform:uppercase;">
        <span>n8n</span><span style="opacity:.3;">/</span><span>Supabase</span><span style="opacity:.3;">/</span><span>React</span><span style="opacity:.3;">/</span><span>Voice AI</span><span style="opacity:.3;">/</span><span>RAG</span><span style="opacity:.3;">/</span><span>Multi-tenant</span><span style="opacity:.3;">/</span><span>Claude</span><span style="opacity:.3;">/</span><span>TypeScript</span><span style="opacity:.3;">/</span><span>VAPI</span><span style="opacity:.3;">/</span><span>Vercel</span><span style="opacity:.3;">/</span><span>pgvector</span><span style="opacity:.3;">/</span>
      </div>
    </div>
  </div>

  <!-- LIVE KONEISTO -->
  <section id="live" style="position:relative;border-top:1px solid rgba(255,255,255,.06);background:#0a0b0d;">
    <div style="max-width:1280px;margin:0 auto;padding:clamp(70px,9vh,110px) clamp(20px,5vw,56px);">
      <div data-reveal style="display:flex;align-items:flex-end;justify-content:space-between;gap:28px;flex-wrap:wrap;margin-bottom:42px;">
        <div>
          <div style="display:inline-flex;align-items:center;gap:9px;margin-bottom:18px;">
            <span style="position:relative;display:inline-flex;width:8px;height:8px;">
              <span style="position:absolute;inset:0;border-radius:50%;background:#f2f3f4;animation:ping 2.2s cubic-bezier(0,0,.2,1) infinite;"></span>
              <span style="position:relative;width:8px;height:8px;border-radius:50%;background:#f2f3f4;"></span>
            </span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.55);">${c.koneistoLive}</span>
          </div>
          <h2 style="margin:0;font-weight:600;font-size:clamp(1.9rem,3.8vw,3.2rem);letter-spacing:-.025em;line-height:1.04;">${c.koneistoTitleA}<br>${c.koneistoTitleB}</h2>
        </div>
        <p style="margin:0;max-width:380px;font-size:15.5px;line-height:1.6;color:rgba(255,255,255,.5);">${c.koneistoLead}</p>
      </div>

      <div data-reveal data-delay="80" style="border:1px solid rgba(255,255,255,.1);border-radius:18px;background:rgba(255,255,255,.012);overflow:hidden;">
        <div id="live-pipe" style="position:relative;padding:clamp(30px,4vw,48px) clamp(18px,3vw,40px) clamp(24px,3vw,38px);border-bottom:1px solid rgba(255,255,255,.07);overflow-x:auto;">
          <div style="position:absolute;left:9%;right:9%;top:calc(clamp(30px,4vw,48px) + 27px);height:1px;background:rgba(255,255,255,.1);z-index:1;"></div>
          <div id="live-packet" style="position:absolute;left:0;top:0;width:12px;height:12px;border-radius:50%;background:#f2f3f4;box-shadow:0 0 14px 3px rgba(255,255,255,.6);transform:translate(-50%,-50%);transition:left .55s cubic-bezier(.5,0,.2,1),top .55s cubic-bezier(.5,0,.2,1),opacity .3s;opacity:0;z-index:3;"></div>
          <div style="position:relative;display:flex;justify-content:space-between;gap:clamp(6px,1vw,14px);z-index:2;min-width:560px;">
            <div data-node="0" style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;text-align:center;border:1px solid rgba(255,255,255,.1);border-radius:13px;background:rgba(255,255,255,.015);padding:0 6px 16px;transition:border-color .4s,background .4s;">
              <div class="nic" style="width:54px;height:54px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:#0c0d10;font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(255,255,255,.4);transition:color .4s,background .4s,border-color .4s;">01</div>
              <div style="margin-top:13px;font-weight:600;font-size:13px;color:#e9eaec;">${c.kStep1t}</div>
              <div style="margin-top:4px;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:rgba(255,255,255,.4);">${c.kStep1s}</div>
              <div class="ndot" style="margin-top:11px;width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.2);transition:background .4s,box-shadow .4s;"></div>
            </div>
            <div data-node="1" style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;text-align:center;border:1px solid rgba(255,255,255,.1);border-radius:13px;background:rgba(255,255,255,.015);padding:0 6px 16px;transition:border-color .4s,background .4s;">
              <div class="nic" style="width:54px;height:54px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:#0c0d10;font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(255,255,255,.4);transition:color .4s,background .4s,border-color .4s;">02</div>
              <div style="margin-top:13px;font-weight:600;font-size:13px;color:#e9eaec;">${c.kStep2t}</div>
              <div style="margin-top:4px;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:rgba(255,255,255,.4);">${c.kStep2s}</div>
              <div class="ndot" style="margin-top:11px;width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.2);transition:background .4s,box-shadow .4s;"></div>
            </div>
            <div data-node="2" style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;text-align:center;border:1px solid rgba(255,255,255,.1);border-radius:13px;background:rgba(255,255,255,.015);padding:0 6px 16px;transition:border-color .4s,background .4s;">
              <div class="nic" style="width:54px;height:54px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:#0c0d10;font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(255,255,255,.4);transition:color .4s,background .4s,border-color .4s;">03</div>
              <div style="margin-top:13px;font-weight:600;font-size:13px;color:#e9eaec;">${c.kStep3t}</div>
              <div style="margin-top:4px;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:rgba(255,255,255,.4);">${c.kStep3s}</div>
              <div class="ndot" style="margin-top:11px;width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.2);transition:background .4s,box-shadow .4s;"></div>
            </div>
            <div data-node="3" style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;text-align:center;border:1px solid rgba(255,255,255,.1);border-radius:13px;background:rgba(255,255,255,.015);padding:0 6px 16px;transition:border-color .4s,background .4s;">
              <div class="nic" style="width:54px;height:54px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:#0c0d10;font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(255,255,255,.4);transition:color .4s,background .4s,border-color .4s;">04</div>
              <div style="margin-top:13px;font-weight:600;font-size:13px;color:#e9eaec;">${c.kStep4t}</div>
              <div style="margin-top:4px;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:rgba(255,255,255,.4);">${c.kStep4s}</div>
              <div class="ndot" style="margin-top:11px;width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.2);transition:background .4s,box-shadow .4s;"></div>
            </div>
            <div data-node="4" style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;text-align:center;border:1px solid rgba(255,255,255,.1);border-radius:13px;background:rgba(255,255,255,.015);padding:0 6px 16px;transition:border-color .4s,background .4s;">
              <div class="nic" style="width:54px;height:54px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:#0c0d10;font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(255,255,255,.4);transition:color .4s,background .4s,border-color .4s;">05</div>
              <div style="margin-top:13px;font-weight:600;font-size:13px;color:#e9eaec;">${c.kStep5t}</div>
              <div style="margin-top:4px;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:rgba(255,255,255,.4);">${c.kStep5s}</div>
              <div class="ndot" style="margin-top:11px;width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.2);transition:background .4s,box-shadow .4s;"></div>
            </div>
            <div data-node="5" style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;text-align:center;border:1px solid rgba(255,255,255,.1);border-radius:13px;background:rgba(255,255,255,.015);padding:0 6px 16px;transition:border-color .4s,background .4s;">
              <div class="nic" style="width:54px;height:54px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:#0c0d10;font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(255,255,255,.4);transition:color .4s,background .4s,border-color .4s;">06</div>
              <div style="margin-top:13px;font-weight:600;font-size:13px;color:#e9eaec;">${c.kStep6t}</div>
              <div style="margin-top:4px;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:rgba(255,255,255,.4);">${c.kStep6s}</div>
              <div class="ndot" style="margin-top:11px;width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.2);transition:background .4s,box-shadow .4s;"></div>
            </div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:0;">
          <div style="padding:22px clamp(20px,3vw,32px);border-right:1px solid rgba(255,255,255,.07);min-height:184px;">
            <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.32);margin-bottom:14px;">${c.koneistoLogTitle}</div>
            <div id="live-log" style="font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.95;"></div>
          </div>
          <div style="padding:22px clamp(20px,3vw,32px);display:flex;flex-direction:column;justify-content:center;gap:16px;">
            <p style="margin:0;font-size:13.5px;line-height:1.6;color:rgba(255,255,255,.5);">${c.koneistoFootnote}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- MANIFESTI -->
  <section id="manifesti" style="position:relative;max-width:1280px;margin:0 auto;padding:clamp(90px,12vh,150px) clamp(20px,5vw,56px);">
    <div data-reveal style="font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:26px;">${c.manEyebrow}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,72px);align-items:start;">
      <div data-reveal style="position:sticky;top:120px;">
        <h2 style="margin:0;font-weight:600;font-size:clamp(2.2rem,4.4vw,3.8rem);line-height:1.02;letter-spacing:-.025em;">${c.manTitleA}<br><span style="color:rgba(255,255,255,.42);">${c.manTitleB}</span></h2>
        <p style="margin:24px 0 0;max-width:420px;font-size:16.5px;line-height:1.62;color:rgba(255,255,255,.56);">${c.manIntro}</p>
      </div>
      <div style="display:flex;flex-direction:column;">
        <div data-reveal data-delay="0" style="display:flex;gap:22px;padding:26px 0;border-top:1px solid rgba(255,255,255,.09);">
          <span style="font-family:'JetBrains Mono',monospace;font-size:14px;color:rgba(255,255,255,.32);padding-top:3px;">01</span>
          <p style="margin:0;font-size:16.5px;line-height:1.6;color:rgba(255,255,255,.72);">${c.man1}</p>
        </div>
        <div data-reveal data-delay="60" style="display:flex;gap:22px;padding:26px 0;border-top:1px solid rgba(255,255,255,.09);">
          <span style="font-family:'JetBrains Mono',monospace;font-size:14px;color:rgba(255,255,255,.32);padding-top:3px;">02</span>
          <p style="margin:0;font-size:16.5px;line-height:1.6;color:rgba(255,255,255,.72);">${c.man2}</p>
        </div>
        <div data-reveal data-delay="120" style="display:flex;gap:22px;padding:26px 0;border-top:1px solid rgba(255,255,255,.09);">
          <span style="font-family:'JetBrains Mono',monospace;font-size:14px;color:rgba(255,255,255,.32);padding-top:3px;">03</span>
          <p style="margin:0;font-size:16.5px;line-height:1.6;color:rgba(255,255,255,.72);">${c.man3}</p>
        </div>
        <div data-reveal data-delay="0" style="display:flex;gap:22px;padding:26px 0;border-top:1px solid rgba(255,255,255,.09);">
          <span style="font-family:'JetBrains Mono',monospace;font-size:14px;color:rgba(255,255,255,.32);padding-top:3px;">04</span>
          <p style="margin:0;font-size:16.5px;line-height:1.6;color:rgba(255,255,255,.72);">${c.man4}</p>
        </div>
        <div data-reveal data-delay="60" style="display:flex;gap:22px;padding:26px 0;border-top:1px solid rgba(255,255,255,.09);">
          <span style="font-family:'JetBrains Mono',monospace;font-size:14px;color:rgba(255,255,255,.32);padding-top:3px;">05</span>
          <p style="margin:0;font-size:16.5px;line-height:1.6;color:rgba(255,255,255,.72);">${c.man5}</p>
        </div>
        <div data-reveal data-delay="120" style="display:flex;gap:22px;padding:26px 0;border-top:1px solid rgba(255,255,255,.09);border-bottom:1px solid rgba(255,255,255,.09);">
          <span style="font-family:'JetBrains Mono',monospace;font-size:14px;color:rgba(255,255,255,.32);padding-top:3px;">06</span>
          <p style="margin:0;font-size:16.5px;line-height:1.6;color:rgba(255,255,255,.72);">${c.man6}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- PROJEKTIT -->

  <!-- TECH / KONEISTO -->
  <section id="tech" style="position:relative;max-width:1280px;margin:0 auto;padding:clamp(90px,12vh,150px) clamp(20px,5vw,56px);">
    <div data-reveal style="max-width:680px;margin-bottom:56px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:18px;">${c.techEyebrow}</div>
      <h2 style="margin:0 0 22px;font-weight:600;font-size:clamp(2rem,4vw,3.4rem);letter-spacing:-.025em;">${c.techTitle}</h2>
      <p style="margin:0;font-size:16.5px;line-height:1.62;color:rgba(255,255,255,.56);">${c.techIntro}</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;">
      <div data-reveal data-delay="0" style="background:#0a0b0d;padding:30px 26px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,.32);margin-bottom:16px;">01</div>
        <h3 style="margin:0 0 10px;font-weight:600;font-size:1.2rem;">${c.techL1n}</h3>
        <p style="margin:0 0 18px;font-size:14.5px;line-height:1.55;color:rgba(255,255,255,.52);">${c.techL1d}</p>
        <div style="display:flex;flex-wrap:wrap;gap:7px;">
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Claude</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">OpenAI</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Gemini</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Mistral</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Perplexity</span>
        </div>
      </div>
      <div data-reveal data-delay="60" style="background:#0a0b0d;padding:30px 26px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,.32);margin-bottom:16px;">02</div>
        <h3 style="margin:0 0 10px;font-weight:600;font-size:1.2rem;">${c.techL2n}</h3>
        <p style="margin:0 0 18px;font-size:14.5px;line-height:1.55;color:rgba(255,255,255,.52);">${c.techL2d}</p>
        <div style="display:flex;flex-wrap:wrap;gap:7px;">
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Claude Code</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">MCP</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Cursor</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Mistral CLI</span>
        </div>
      </div>
      <div data-reveal data-delay="120" style="background:#0a0b0d;padding:30px 26px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,.32);margin-bottom:16px;">03</div>
        <h3 style="margin:0 0 10px;font-weight:600;font-size:1.2rem;">${c.techL3n}</h3>
        <p style="margin:0 0 18px;font-size:14.5px;line-height:1.55;color:rgba(255,255,255,.52);">${c.techL3d}</p>
        <div style="display:flex;flex-wrap:wrap;gap:7px;">
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Supabase</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">React &amp; Vite</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Next.js</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">TypeScript</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Vercel</span>
        </div>
      </div>
      <div data-reveal data-delay="0" style="background:#0a0b0d;padding:30px 26px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,.32);margin-bottom:16px;">04</div>
        <h3 style="margin:0 0 10px;font-weight:600;font-size:1.2rem;">${c.techL4n}</h3>
        <p style="margin:0 0 18px;font-size:14.5px;line-height:1.55;color:rgba(255,255,255,.52);">${c.techL4d}</p>
        <div style="display:flex;flex-wrap:wrap;gap:7px;">
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">n8n</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Make.com</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">GitHub Actions</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Nango</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Airtable</span>
        </div>
      </div>
      <div data-reveal data-delay="60" style="background:#0a0b0d;padding:30px 26px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,.32);margin-bottom:16px;">05</div>
        <h3 style="margin:0 0 10px;font-weight:600;font-size:1.2rem;">${c.techL5n}</h3>
        <p style="margin:0 0 18px;font-size:14.5px;line-height:1.55;color:rgba(255,255,255,.52);">${c.techL5d}</p>
        <div style="display:flex;flex-wrap:wrap;gap:7px;">
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">ElevenLabs</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Leonardo.ai</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Veo 2</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Sora</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);padding:3px 8px;border-radius:6px;">Hedra</span>
        </div>
      </div>
    </div>

    <div data-reveal style="margin-top:16px;border:1px solid rgba(255,255,255,.09);border-radius:14px;padding:20px clamp(16px,3vw,26px);background:rgba(255,255,255,.015);">
      <canvas id="stack-canvas" style="width:100%;height:190px;display:block;"></canvas>
    </div>

    <div data-reveal style="margin-top:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
      <div style="border:1px solid rgba(255,255,255,.09);border-radius:14px;padding:22px;background:rgba(255,255,255,.015);">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.36);margin-bottom:8px;">${c.techP1t}</div>
        <p style="margin:0;font-size:13.5px;line-height:1.5;color:rgba(255,255,255,.6);">${c.techP1b}</p>
      </div>
      <div style="border:1px solid rgba(255,255,255,.09);border-radius:14px;padding:22px;background:rgba(255,255,255,.015);">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.36);margin-bottom:8px;">${c.techP2t}</div>
        <p style="margin:0;font-size:13.5px;line-height:1.5;color:rgba(255,255,255,.6);">${c.techP2b}</p>
      </div>
      <div style="border:1px solid rgba(255,255,255,.09);border-radius:14px;padding:22px;background:rgba(255,255,255,.015);">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.36);margin-bottom:8px;">${c.techP3t}</div>
        <p style="margin:0;font-size:13.5px;line-height:1.5;color:rgba(255,255,255,.6);">${c.techP3b}</p>
      </div>
    </div>
  </section>

  <!-- BUILD IN PUBLIC -->
  <section id="build" style="position:relative;background:#0c0d10;border-top:1px solid rgba(255,255,255,.06);">
    <div style="max-width:1280px;margin:0 auto;padding:clamp(90px,12vh,150px) clamp(20px,5vw,56px);">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,64px);align-items:start;">
        <div data-reveal>
          <div style="font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:18px;">${c.bipEyebrow}</div>
          <h2 style="margin:0 0 22px;font-weight:600;font-size:clamp(2rem,4vw,3.4rem);letter-spacing:-.025em;">${c.bipTitle}</h2>
          <p style="margin:0 0 28px;font-size:16.5px;line-height:1.62;color:rgba(255,255,255,.56);max-width:460px;">${c.bipIntro}</p>
          <div style="border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:24px;background:rgba(255,255,255,.015);max-width:420px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px;">
              <div style="display:flex;align-items:center;gap:12px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:10px;border:1px solid rgba(255,255,255,.16);font-family:'JetBrains Mono',monospace;font-weight:700;">SK</span>
                <div>
                  <div style="font-weight:600;font-size:15px;">@samikiias</div>
                  <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,.45);">AI &amp; Automaatio</div>
                </div>
              </div>
            </div>
            <a href="#yhteys" style="display:flex;align-items:center;justify-content:center;text-decoration:none;background:#f2f3f4;color:#0a0b0d;font-weight:600;font-size:14px;padding:12px;border-radius:9px;transition:transform .2s;" data-hover="transform:translateY(-2px);">Tilaa kanava →</a>
          </div>
        </div>
        <div data-reveal data-delay="80" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div style="border:1px solid rgba(255,255,255,.09);border-radius:13px;padding:22px;background:rgba(255,255,255,.015);">
            <div style="font-weight:600;font-size:15.5px;margin-bottom:8px;">n8n-automaatiot</div>
            <p style="margin:0;font-size:13.5px;line-height:1.5;color:rgba(255,255,255,.52);">Workflow-automaatioiden rakentaminen alusta loppuun.</p>
          </div>
          <div style="border:1px solid rgba(255,255,255,.09);border-radius:13px;padding:22px;background:rgba(255,255,255,.015);">
            <div style="font-weight:600;font-size:15.5px;margin-bottom:8px;">Supabase &amp; RAG</div>
            <p style="margin:0;font-size:13.5px;line-height:1.5;color:rgba(255,255,255,.52);">Vektoritietokannat ja semanttinen haku.</p>
          </div>
          <div style="border:1px solid rgba(255,255,255,.09);border-radius:13px;padding:22px;background:rgba(255,255,255,.015);">
            <div style="font-weight:600;font-size:15.5px;margin-bottom:8px;">Voice AI</div>
            <p style="margin:0;font-size:13.5px;line-height:1.5;color:rgba(255,255,255,.52);">AI-puhelinpalveluiden toteutus ja integraatiot.</p>
          </div>
          <div style="border:1px solid rgba(255,255,255,.09);border-radius:13px;padding:22px;background:rgba(255,255,255,.015);">
            <div style="font-weight:600;font-size:15.5px;margin-bottom:8px;">Build in Public</div>
            <p style="margin:0;font-size:13.5px;line-height:1.5;color:rgba(255,255,255,.52);">Startup-rakentamisen dokumentointi reaaliajassa.</p>
          </div>
          <div style="grid-column:1 / -1;border:1px dashed rgba(255,255,255,.12);border-radius:13px;padding:20px;">
            <p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.5);"><span style="color:rgba(255,255,255,.75);">Miksi seurata?</span> Jaan käytännön kokemuksia oikeista projekteista — ei teorioita vaan toimivia ratkaisuja, joita voit hyödyntää omissa projekteissasi.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- TARINA -->
  <section id="tarina" style="position:relative;max-width:1280px;margin:0 auto;padding:clamp(90px,12vh,150px) clamp(20px,5vw,56px);">
    <div data-reveal style="margin-bottom:56px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:18px;">${c.storyEyebrow}</div>
      <h2 style="margin:0 0 18px;font-weight:600;font-size:clamp(2rem,4vw,3.4rem);letter-spacing:-.025em;">${c.storyTitle}</h2>
      <p style="margin:0;max-width:560px;font-size:16.5px;line-height:1.62;color:rgba(255,255,255,.56);">${c.storyIntro}</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:56px;">
      <div data-reveal data-delay="0" style="border-top:1px solid rgba(255,255,255,.14);padding-top:22px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:13px;color:#f2f3f4;margin-bottom:14px;">${c.story1y}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:8px;">${c.story1r}</div>
        <div style="font-weight:600;font-size:15px;margin-bottom:10px;">${c.story1o}</div>
        <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(255,255,255,.52);">${c.story1b}</p>
      </div>
      <div data-reveal data-delay="60" style="border-top:1px solid rgba(255,255,255,.14);padding-top:22px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:13px;color:#f2f3f4;margin-bottom:14px;">${c.story2y}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:8px;">${c.story2r}</div>
        <div style="font-weight:600;font-size:15px;margin-bottom:10px;">${c.story2o}</div>
        <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(255,255,255,.52);">${c.story2b}</p>
      </div>
      <div data-reveal data-delay="120" style="border-top:1px solid rgba(255,255,255,.14);padding-top:22px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:13px;color:#f2f3f4;margin-bottom:14px;">${c.story3y}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:8px;">${c.story3r}</div>
        <div style="font-weight:600;font-size:15px;margin-bottom:10px;">${c.story3o}</div>
        <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(255,255,255,.52);">${c.story3b}</p>
      </div>
      <div data-reveal data-delay="180" style="border-top:1px solid #f2f3f4;padding-top:22px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:13px;color:#f2f3f4;margin-bottom:14px;">${c.story4y}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:8px;">${c.story4r}</div>
        <div style="font-weight:600;font-size:15px;margin-bottom:10px;">${c.story4o}</div>
        <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(255,255,255,.52);">${c.story4b}</p>
      </div>
    </div>

    <div data-reveal style="border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:clamp(28px,4vw,48px);background:rgba(255,255,255,.015);display:grid;grid-template-columns:1.4fr 1fr;gap:clamp(28px,4vw,56px);align-items:center;">
      <div>
        <p style="margin:0 0 26px;font-size:clamp(1.3rem,2.2vw,1.8rem);line-height:1.4;font-weight:500;letter-spacing:-.01em;color:#f2f3f4;">${c.storyQuote}</p>
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;border:1px solid rgba(255,255,255,.16);font-family:'JetBrains Mono',monospace;font-weight:700;font-size:14px;">SK</span>
          <div>
            <div style="font-weight:600;font-size:14.5px;">${c.storyName}</div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,.45);">${c.storyRole}</div>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:clamp(20px,3vw,40px);border-left:1px solid rgba(255,255,255,.09);padding-left:clamp(20px,3vw,40px);">
        <div>
          <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:clamp(1.6rem,2.4vw,2.2rem);"><span data-count-to="${c.storyStat1v}">${c.storyStat1v}</span></div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-top:5px;">${c.storyStat1l}</div>
        </div>
        <div>
          <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:clamp(1.6rem,2.4vw,2.2rem);"><span data-count-to="${c.storyStat2v}">${c.storyStat2v}</span></div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-top:5px;">${c.storyStat2l}</div>
        </div>
        <div>
          <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:clamp(1.6rem,2.4vw,2.2rem);"><span data-count-to="${c.storyStat3v}">${c.storyStat3v}</span></div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-top:5px;">${c.storyStat3l}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- YHTEYS -->
  <!-- Rendered as the YhteysSection React island (src/components/YhteysSection.tsx);
       the lead-capture form needs to sit inside the two-column grid alongside
       React-rendered <ContactForm>, which dangerouslySetInnerHTML fragments can't do. -->`
}

export const FOOTER_HTML = "<footer style=\"border-top:1px solid rgba(255,255,255,.08);background:#0a0b0d;\">\n    <div style=\"max-width:1280px;margin:0 auto;padding:54px clamp(20px,5vw,56px);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:28px;\">\n      <div>\n        <div style=\"display:flex;align-items:center;gap:12px;margin-bottom:10px;\">\n          <span style=\"display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:1px solid rgba(255,255,255,.2);border-radius:8px;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px;\">SK</span>\n          <span style=\"font-weight:600;font-size:15px;\">Sami Kiias</span>\n        </div>\n        <p style=\"margin:0;font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(255,255,255,.42);\">Automaatio on uusi lukutaito.</p>\n      </div>\n      <div style=\"display:flex;gap:24px;\">\n        <a href=\"#\" style=\"text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.08em;color:rgba(255,255,255,.5);transition:color .2s;\" data-hover=\"color:#f2f3f4;\">Blog</a>\n        <a href=\"#\" style=\"text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.08em;color:rgba(255,255,255,.5);transition:color .2s;\" data-hover=\"color:#f2f3f4;\">LinkedIn</a>\n        <a href=\"#\" style=\"text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.08em;color:rgba(255,255,255,.5);transition:color .2s;\" data-hover=\"color:#f2f3f4;\">GitHub</a>\n        <a href=\"#\" style=\"text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.08em;color:rgba(255,255,255,.5);transition:color .2s;\" data-hover=\"color:#f2f3f4;\">YouTube</a>\n      </div>\n    </div>\n    <div style=\"border-top:1px solid rgba(255,255,255,.06);padding:20px clamp(20px,5vw,56px);max-width:1280px;margin:0 auto;\">\n      <p style=\"margin:0;font-family:'JetBrains Mono',monospace;font-size:11.5px;color:rgba(255,255,255,.32);\">© 2026 Sami Kiias. Kaikki oikeudet pidätetään.</p>\n    </div>\n  </footer>";
