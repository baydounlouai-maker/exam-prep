// Lesson 1 video: the approved prototype's scenes (custom layouts, not templates).
// Beats are the narration; elements inside each scene animate on those beats (see assets/js/video.js).

const HTML = [
`<div class="v-abs" style="left:110px;top:140px" data-at="0" data-fx="rise"><span class="v-pill"><span style="width:14px;height:14px;border-radius:50%;background:#4F46E5;display:inline-block"></span>E-Business · Chapter 5</span></div>
          <h2 class="v-abs v-h v-h--xl" style="left:104px;top:214px;width:900px;font-size:100px" data-at="0" data-d="0.25" data-fx="rise">Digital business<br>strategy</h2>
          <div class="v-abs v-lbl" style="left:110px;top:458px;font-size:30px;color:#14142B" data-at="0" data-d="0.6" data-fx="rise">Lesson 1 · <span class="v-hl">Strategy &amp; disruption</span></div>
          <div class="v-abs" style="left:1000px;top:120px;width:200px;height:200px;border-radius:50%;border:4px solid #14142B;background:#FFB020;box-shadow:8px 8px 0 #14142B;display:flex;align-items:center;justify-content:center;font:700 124px/1 'Space Grotesk',sans-serif" data-at="0" data-d="0.4" data-fx="pop">5</div>
          <div class="v-abs" style="left:110px;top:560px;display:flex;gap:18px">
            <span class="v-chip" data-at="1" data-d="1.6" data-fx="pop">Strategy</span>
            <span class="v-chip v-tint" data-at="1" data-d="2.4" data-fx="pop">Disruption</span>
            <span class="v-chip v-sun" data-at="1" data-d="3.3" data-fx="pop">Platforms</span>
          </div>`,
`<div class="v-abs v-card" style="left:120px;top:150px;width:1040px;padding:56px 64px" data-at="0" data-fx="rise" data-out="2">
            <div class="v-lbl" style="margin-bottom:18px">Michael Porter, 2001</div>
            <div style="font:700 62px/1.15 'Space Grotesk',sans-serif;letter-spacing:-.02em">
              The question isn't <span style="position:relative;display:inline-block">whether<span class="v-abs" style="left:-6px;right:-6px;top:52%;height:8px;background:#9A3412;border-radius:4px;transform-origin:left center" data-at="0" data-d="2.6" data-fx="grow"></span></span> to use the Internet.
              <br>It's <span class="v-hl" style="display:inline-block" data-at="1" data-d="0.3" data-fx="pop">how.</span>
            </div>
          </div>
          <h2 class="v-abs v-h v-h--md" style="left:120px;top:84px" data-at="2" data-fx="rise">Four ways to define strategy</h2>
          <div class="v-abs" style="left:120px;top:206px;display:grid;grid-template-columns:repeat(4,250px);gap:20px">
            <div class="v-card" style="padding:28px;height:360px;display:flex;flex-direction:column;gap:18px" data-at="3" data-fx="pop">
              <div class="v-icon"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#14142B" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="#14142B"/></svg></div>
              <div style="font:700 32px/1.15 'Space Grotesk',sans-serif">Meets our objectives</div>
              <div style="font-size:21px;color:#4A4A63">How we'll reach our goals.</div>
            </div>
            <div class="v-card" style="padding:28px;height:360px;display:flex;flex-direction:column;gap:18px" data-at="4" data-fx="pop">
              <div class="v-icon"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#14142B" stroke-width="2.2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg></div>
              <div style="font:700 32px/1.15 'Space Grotesk',sans-serif">Allocates resources</div>
              <div style="font-size:21px;color:#4A4A63">Where money, people and time go.</div>
            </div>
            <div class="v-card" style="padding:28px;height:360px;display:flex;flex-direction:column;gap:18px" data-at="5" data-fx="pop">
              <div class="v-icon"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#14142B" stroke-width="2.2"><path d="M12 21v-8M12 13 5 6M12 13l7-7M5 6v4M5 6h4M19 6v4M19 6h-4"/></svg></div>
              <div style="font:700 32px/1.15 'Space Grotesk',sans-serif">Picks an option</div>
              <div style="font-size:21px;color:#4A4A63">The way we choose to compete.</div>
            </div>
            <div class="v-card" style="padding:28px;height:360px;display:flex;flex-direction:column;gap:18px;background:#FFF1D1" data-at="6" data-fx="pop">
              <div class="v-icon" style="background:#FFB020"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#14142B" stroke-width="2.2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg></div>
              <div style="font:700 32px/1.15 'Space Grotesk',sans-serif">Long-term plan</div>
              <div style="font-size:21px;color:#4A4A63">How the organisation develops over years.</div>
            </div>
          </div>`,
`<h2 class="v-abs v-h" style="left:90px;top:48px;font-size:46px" data-at="0" data-fx="rise">Disruptive innovation <span style="font-weight:500;color:#4A4A63;font-size:28px">· Christensen</span></h2>
          <svg class="v-abs" style="left:70px;top:120px" width="1140" height="560" viewBox="0 0 1140 560" aria-hidden="true">
            <rect x="80" y="372" width="980" height="128" fill="#FFB020" opacity=".0" data-at="3" data-fx="glow"/>
            <path d="M80 30 V500 H1080" fill="none" stroke="#14142B" stroke-width="4" stroke-linecap="round" data-at="0" data-d="0.3" data-dur="1.2" data-fx="draw"/>
            <text x="20" y="270" transform="rotate(-90 20 270)" text-anchor="middle" font-family="Inter" font-weight="600" font-size="22" fill="#4A4A63" data-at="0" data-d="1" data-fx="fade">Product performance</text>
            <text x="1080" y="535" text-anchor="end" font-family="Inter" font-weight="600" font-size="22" fill="#4A4A63" data-at="0" data-d="1" data-fx="fade">Time →</text>

            <path d="M80 160 L1080 112" fill="none" stroke="#8A8AA3" stroke-width="3" data-at="1" data-d="0.2" data-dur="1" data-fx="draw"/>
            <path d="M80 280 L1080 236" fill="none" stroke="#8A8AA3" stroke-width="3" data-at="1" data-d="0.8" data-dur="1" data-fx="draw"/>
            <path d="M80 400 L1080 364" fill="none" stroke="#8A8AA3" stroke-width="3" data-at="1" data-d="1.4" data-dur="1" data-fx="draw"/>
            <text x="96" y="146" font-family="Inter" font-weight="600" font-size="21" fill="#4A4A63" data-at="1" data-d="0.6" data-fx="fade">High end · most profitable</text>
            <text x="96" y="266" font-family="Inter" font-weight="600" font-size="21" fill="#4A4A63" data-at="1" data-d="1.2" data-fx="fade">Mainstream</text>
            <text x="96" y="388" font-family="Inter" font-weight="600" font-size="21" fill="#4A4A63" data-at="1" data-d="1.8" data-fx="fade">Low end · least profitable</text>

            <path d="M80 250 C 420 220, 760 120, 1080 40" fill="none" stroke="#4F46E5" stroke-width="8" stroke-linecap="round" data-at="2" data-d="0.2" data-dur="2.6" data-fx="draw"/>
            <g data-at="2" data-d="2.4" data-fx="pop"><rect x="770" y="20" width="270" height="44" rx="10" fill="#4F46E5" stroke="#14142B" stroke-width="3"/><text x="905" y="50" text-anchor="middle" font-family="Inter" font-weight="700" font-size="21" fill="#fff">Incumbent · sustaining</text></g>

            <path d="M330 492 C 600 470, 820 360, 1080 168" fill="none" stroke="#FFB020" stroke-width="9" stroke-linecap="round" data-at="4" data-d="0.3" data-dur="1.6" data-fx="draw" data-to="0.45"/>
            <path d="M330 492 C 600 470, 820 360, 1080 168" fill="none" stroke="#FFB020" stroke-width="9" stroke-linecap="round" data-at="5" data-d="0.2" data-dur="2.4" data-fx="draw"/>
            <path d="M330 492 C 600 470, 820 360, 1080 168" fill="none" stroke="#14142B" stroke-width="2" stroke-dasharray="2 14" stroke-linecap="round" data-at="5" data-d="0.2" data-dur="2.4" data-fx="fade" opacity=".0"/>
            <g data-at="4" data-d="1" data-fx="pop"><rect x="420" y="508" width="250" height="44" rx="10" fill="#FFB020" stroke="#14142B" stroke-width="3"/><text x="545" y="538" text-anchor="middle" font-family="Inter" font-weight="700" font-size="21" fill="#14142B">Entrant · disruptive</text></g>
          </svg>
          <div class="v-abs v-sticker" style="left:880px;top:330px" data-at="5" data-d="2.5" data-fx="pop">Disruption!</div>`,
`<div data-at="0" data-fx="fade" data-out="5">
            <h2 class="v-abs v-h v-h--md" style="left:100px;top:70px">Your first <span class="v-hl">1,000</span> users</h2>
            <div class="v-abs" style="right:100px;top:56px;text-align:right">
              <div class="v-mono" style="font-size:96px;font-weight:600;line-height:1" data-at="0" data-d="0.4" data-dur="7" data-fx="count" data-to="1000">0</div>
              <div class="v-lbl">users</div>
            </div>
            <div class="v-abs" style="left:100px;top:190px;display:flex;flex-direction:column;gap:20px;width:760px">
              <div class="v-card" style="display:flex;gap:22px;align-items:center;padding:20px 26px" data-at="1" data-fx="left"><span class="v-num">1</span><span style="font:600 30px/1.2 Inter,sans-serif">Reach out to friends and colleagues</span></div>
              <div class="v-card" style="display:flex;gap:22px;align-items:center;padding:20px 26px" data-at="2" data-fx="left"><span class="v-num">2</span><span style="font:600 30px/1.2 Inter,sans-serif">Go where your audience hangs out</span></div>
              <div class="v-card" style="display:flex;gap:22px;align-items:center;padding:20px 26px" data-at="3" data-fx="left"><span class="v-num">3</span><span style="font:600 30px/1.2 Inter,sans-serif">Get influencers on board</span></div>
            </div>
            <div class="v-abs v-lbl" style="left:100px;top:560px" data-at="4" data-fx="fade">Marketplaces also…</div>
            <div class="v-abs" style="left:100px;top:606px;display:flex;gap:16px;flex-wrap:wrap;width:1100px">
              <span class="v-chip v-tint" data-at="4" data-d="0.4" data-fx="pop">Message targeted strangers</span>
              <span class="v-chip v-tint" data-at="4" data-d="1.6" data-fx="pop">Stickers &amp; flyers</span>
              <span class="v-chip v-sun" data-at="4" data-d="2.8" data-fx="pop">Let supply drive demand</span>
            </div>
          </div>

          <h2 class="v-abs v-h v-h--md" style="left:100px;top:60px" data-at="5" data-fx="rise">The growth <span class="v-hl">racecar</span> <span style="font-weight:500;color:#4A4A63;font-size:28px">· Rachitsky</span></h2>
          <svg class="v-abs" style="left:320px;top:230px" width="640" height="280" viewBox="0 0 640 280" aria-hidden="true" data-at="5" data-d="0.3" data-fx="left">
            <g class="speed" stroke="#14142B" stroke-width="5" stroke-linecap="round">
              <line x1="-120" y1="120" x2="-20" y2="120" stroke-dasharray="30 26" data-loop="dash"/>
              <line x1="-160" y1="160" x2="-10" y2="160" stroke-dasharray="40 30" data-loop="dash"/>
              <line x1="-100" y1="200" x2="0" y2="200" stroke-dasharray="24 22" data-loop="dash"/>
            </g>
            <g data-loop="bob">
              <path d="M30 200 L70 150 L230 132 L300 82 L420 82 L470 140 L590 160 Q 612 166 612 190 L612 212 L30 212 Z" fill="#4F46E5" stroke="#14142B" stroke-width="5" stroke-linejoin="round"/>
              <path d="M316 96 L408 96 L444 140 L300 140 Z" fill="#E8E7FD" stroke="#14142B" stroke-width="4" stroke-linejoin="round"/>
              <rect x="20" y="118" width="58" height="22" rx="4" fill="#FFB020" stroke="#14142B" stroke-width="4"/>
              <text x="210" y="188" font-family="Space Grotesk" font-weight="700" font-size="42" fill="#fff">05</text>
            </g>
            <g data-loop="spin" style="transform-origin:150px 216px"><circle cx="150" cy="216" r="44" fill="#14142B"/><circle cx="150" cy="216" r="18" fill="#FFB020" stroke="#14142B" stroke-width="4"/><path d="M150 176 V256 M110 216 H190" stroke="#8A8AA3" stroke-width="5"/></g>
            <g data-loop="spin" style="transform-origin:500px 216px"><circle cx="500" cy="216" r="44" fill="#14142B"/><circle cx="500" cy="216" r="18" fill="#FFB020" stroke="#14142B" stroke-width="4"/><path d="M500 176 V256 M460 216 H540" stroke="#8A8AA3" stroke-width="5"/></g>
          </svg>
          <div class="v-abs v-card" style="left:470px;top:150px;width:340px;padding:12px 18px;text-align:center" data-at="6" data-fx="pop"><b style="font:700 28px 'Space Grotesk',sans-serif">Engine</b><div style="font-size:19px;color:#4A4A63">growth loops: virality, content, sales</div></div>
          <div class="v-abs v-card" style="left:60px;top:300px;width:280px;padding:12px 18px" data-at="7" data-fx="pop"><b style="font:700 28px 'Space Grotesk',sans-serif">Turbo boosts</b><div style="font-size:19px;color:#4A4A63">PR, events, a big ad. Short burst.</div></div>
          <div class="v-abs v-card" style="left:360px;top:560px;width:380px;padding:12px 18px;background:#E8E7FD" data-at="8" data-fx="pop"><b style="font:700 28px 'Space Grotesk',sans-serif">Lubricants</b><div style="font-size:19px;color:#4A4A63">better conversion, brand, retention</div></div>
          <div class="v-abs v-card" style="left:960px;top:300px;width:260px;padding:12px 18px;background:#FFF1D1" data-at="9" data-fx="pop"><b style="font:700 28px 'Space Grotesk',sans-serif">Fuel</b><div style="font-size:19px;color:#4A4A63">capital, content, users</div></div>`,
`<h2 class="v-abs v-h" style="left:100px;top:58px;font-size:84px" data-at="0" data-fx="rise">Zopa</h2>
          <div class="v-abs" style="left:330px;top:84px;display:flex;gap:10px;font:600 34px 'Space Grotesk',sans-serif">
            <span data-at="0" data-d="0.6" data-fx="pop"><span class="v-hl">Z</span>one</span>
            <span data-at="0" data-d="1.0" data-fx="pop"><span class="v-hl">O</span>f</span>
            <span data-at="0" data-d="1.4" data-fx="pop"><span class="v-hl">P</span>ossible</span>
            <span data-at="0" data-d="1.8" data-fx="pop"><span class="v-hl">A</span>greement</span>
          </div>

          <div data-at="1" data-fx="fade" data-out="4">
            <svg class="v-abs" style="left:110px;top:190px" width="1060" height="280" viewBox="0 0 1060 280" aria-hidden="true">
              <g><circle cx="110" cy="96" r="46" fill="#E8E7FD" stroke="#14142B" stroke-width="5"/><path d="M40 230 Q110 150 180 230 Z" fill="#E8E7FD" stroke="#14142B" stroke-width="5" stroke-linejoin="round"/></g>
              <text x="110" y="270" text-anchor="middle" font-family="Inter" font-weight="700" font-size="26" fill="#14142B">Savers</text>
              <rect x="400" y="70" width="260" height="140" rx="20" fill="#4F46E5" stroke="#14142B" stroke-width="5"/>
              <text x="530" y="152" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="44" fill="#fff">ZOPA</text>
              <text x="530" y="250" text-anchor="middle" font-family="Inter" font-weight="600" font-size="22" fill="#4A4A63">peer-to-peer platform</text>
              <g><circle cx="950" cy="96" r="46" fill="#FFF1D1" stroke="#14142B" stroke-width="5"/><path d="M880 230 Q950 150 1020 230 Z" fill="#FFF1D1" stroke="#14142B" stroke-width="5" stroke-linejoin="round"/></g>
              <text x="950" y="270" text-anchor="middle" font-family="Inter" font-weight="700" font-size="26" fill="#14142B">Borrowers</text>
              <path d="M180 140 H 880" stroke="#14142B" stroke-width="4" stroke-dasharray="14 12"/>
              <g data-loop="coins">
                <g><circle cx="200" cy="140" r="22" fill="#FFB020" stroke="#14142B" stroke-width="4"/><text x="200" y="149" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="24" fill="#14142B">£</text></g>
                <g><circle cx="200" cy="140" r="22" fill="#FFB020" stroke="#14142B" stroke-width="4"/><text x="200" y="149" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="24" fill="#14142B">£</text></g>
                <g><circle cx="200" cy="140" r="22" fill="#FFB020" stroke="#14142B" stroke-width="4"/><text x="200" y="149" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="24" fill="#14142B">£</text></g>
              </g>
            </svg>
            <div class="v-abs v-card" style="left:440px;top:480px;padding:12px 26px;text-align:center" data-at="2" data-fx="pop">
              <div class="v-mono" style="font-size:54px;font-weight:600;line-height:1.1">£<span data-at="2" data-d="0.2" data-dur="3.5" data-fx="count" data-to="6">0</span>bn+</div>
              <div class="v-lbl" style="font-size:20px">lent by 2020</div>
            </div>
            <div class="v-abs v-card" style="left:860px;top:470px;width:320px;padding:16px 22px;background:#FFE8CC;border-color:#9A3412" data-at="3" data-fx="pop">
              <b style="font:700 28px 'Space Grotesk',sans-serif;color:#9A3412">2020</b>
              <div style="font-size:21px">COVID-19 makes trading harder. New regulation opens a door.</div>
            </div>
          </div>

          <div class="v-abs v-card" style="left:220px;top:190px;width:840px;padding:34px 44px;display:flex;gap:34px;align-items:center" data-at="4" data-fx="rise">
            <svg width="150" height="150" viewBox="0 0 24 24" fill="#E8E7FD" stroke="#14142B" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M3 9 12 4l9 5H3z"/><path d="M5 9v9M9.5 9v9M14.5 9v9M19 9v9" fill="none"/><path d="M3 20h18" fill="none"/></svg>
            <div style="display:flex;flex-direction:column;gap:10px">
              <b style="font:700 46px/1.1 'Space Grotesk',sans-serif">2021: relaunched as a bank</b>
              <div style="font-size:26px;color:#4A4A63">Still lends money. Now adds protected fixed-term savings.</div>
            </div>
          </div>
          <div class="v-abs v-sticker" style="left:780px;top:470px" data-at="4" data-d="1.8" data-fx="pop">Strategic agility</div>

          <svg class="v-abs" style="left:100px;top:628px" width="1080" height="70" viewBox="0 0 1080 70" aria-hidden="true">
            <path d="M20 30 H1060" stroke="#14142B" stroke-width="4" data-at="1" data-dur="1.5" data-fx="draw"/>
            <g data-at="1" data-d="0.3" data-fx="pop"><circle cx="80" cy="30" r="14" fill="#4F46E5" stroke="#14142B" stroke-width="4"/><text x="110" y="40" font-family="JetBrains Mono" font-weight="600" font-size="24" fill="#14142B">2005 · launch</text></g>
            <g data-at="3" data-d="0.2" data-fx="pop"><circle cx="640" cy="30" r="14" fill="#9A3412" stroke="#14142B" stroke-width="4"/><text x="670" y="40" font-family="JetBrains Mono" font-weight="600" font-size="24" fill="#14142B">2020</text></g>
            <g data-at="4" data-d="0.2" data-fx="pop"><circle cx="840" cy="30" r="14" fill="#FFB020" stroke="#14142B" stroke-width="4"/><text x="870" y="40" font-family="JetBrains Mono" font-weight="600" font-size="24" fill="#14142B">2021 · bank</text></g>
          </svg>`,
`<h2 class="v-abs v-h v-h--md" style="left:100px;top:62px" data-at="0" data-fx="rise">Three kinds of <span class="v-hl">platform</span></h2>
          <div class="v-abs" style="left:100px;top:170px;display:grid;grid-template-columns:repeat(3,340px);gap:30px">
            <div class="v-card" style="padding:28px;height:470px;display:flex;flex-direction:column;gap:16px" data-at="1" data-fx="pop">
              <svg width="120" height="80" viewBox="0 0 120 80" aria-hidden="true"><circle cx="14" cy="14" r="9" fill="#E8E7FD" stroke="#14142B" stroke-width="3"/><circle cx="14" cy="40" r="9" fill="#E8E7FD" stroke="#14142B" stroke-width="3"/><circle cx="14" cy="66" r="9" fill="#E8E7FD" stroke="#14142B" stroke-width="3"/><path d="M24 14 L74 40 M24 40 H74 M24 66 L74 40" stroke="#14142B" stroke-width="3"/><circle cx="92" cy="40" r="20" fill="#4F46E5" stroke="#14142B" stroke-width="3"/></svg>
              <b style="font:700 36px/1.1 'Space Grotesk',sans-serif">Aggregation</b>
              <div style="font-size:22px;color:#4A4A63">Brings many offers into one place.</div>
              <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:auto">
                <span class="v-chip" style="font-size:20px;padding:6px 14px" data-at="1" data-d="1.6" data-fx="pop">MoneySupermarket</span>
                <span class="v-chip" style="font-size:20px;padding:6px 14px" data-at="1" data-d="2.2" data-fx="pop">App Store</span>
                <span class="v-chip" style="font-size:20px;padding:6px 14px" data-at="1" data-d="2.8" data-fx="pop">eBay</span>
                <span class="v-chip" style="font-size:20px;padding:6px 14px" data-at="1" data-d="3.4" data-fx="pop">Kaggle</span>
              </div>
            </div>
            <div class="v-card" style="padding:28px;height:470px;display:flex;flex-direction:column;gap:16px;background:#E8E7FD" data-at="2" data-fx="pop">
              <svg width="120" height="80" viewBox="0 0 120 80" aria-hidden="true"><path d="M20 20 L60 60 L100 20 L20 20 M60 60 L60 14" stroke="#14142B" stroke-width="3" fill="none"/><circle cx="20" cy="20" r="11" fill="#fff" stroke="#14142B" stroke-width="3"/><circle cx="100" cy="20" r="11" fill="#fff" stroke="#14142B" stroke-width="3"/><circle cx="60" cy="60" r="11" fill="#FFB020" stroke="#14142B" stroke-width="3"/><circle cx="60" cy="14" r="9" fill="#fff" stroke="#14142B" stroke-width="3"/></svg>
              <b style="font:700 36px/1.1 'Space Grotesk',sans-serif">Social</b>
              <div style="font-size:22px;color:#4A4A63">Connects people with each other.</div>
              <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:auto">
                <span class="v-chip" style="font-size:20px;padding:6px 14px" data-at="2" data-d="1.2" data-fx="pop">Facebook</span>
                <span class="v-chip" style="font-size:20px;padding:6px 14px" data-at="2" data-d="1.8" data-fx="pop">Twitter</span>
              </div>
            </div>
            <div class="v-card" style="padding:28px;height:470px;display:flex;flex-direction:column;gap:16px;background:#FFF1D1" data-at="3" data-fx="pop">
              <svg width="120" height="80" viewBox="0 0 120 80" aria-hidden="true"><circle cx="16" cy="64" r="9" fill="#fff" stroke="#14142B" stroke-width="3"/><circle cx="40" cy="68" r="9" fill="#fff" stroke="#14142B" stroke-width="3"/><circle cx="64" cy="64" r="9" fill="#fff" stroke="#14142B" stroke-width="3"/><path d="M40 52 L88 18" stroke="#14142B" stroke-width="3"/><path d="M76 16 L92 14 L88 30" stroke="#14142B" stroke-width="3" fill="none"/><rect x="92" y="4" width="22" height="22" rx="4" fill="#FFB020" stroke="#14142B" stroke-width="3"/></svg>
              <b style="font:700 36px/1.1 'Space Grotesk',sans-serif">Mobilisation</b>
              <div style="font-size:22px;color:#4A4A63">Rallies a crowd behind a project.</div>
              <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:auto">
                <span class="v-chip" style="font-size:20px;padding:6px 14px" data-at="3" data-d="1.6" data-fx="pop">Crowdfunder</span>
                <span class="v-chip" style="font-size:20px;padding:6px 14px" data-at="3" data-d="2.2" data-fx="pop">Kickstarter</span>
              </div>
            </div>
          </div>`,
`<h2 class="v-abs v-h v-h--md" style="left:100px;top:70px" data-at="0" data-fx="rise">Recap</h2>
          <div class="v-abs" style="left:100px;top:180px;display:flex;flex-direction:column;gap:22px;width:1080px">
            <div class="v-card" style="display:flex;gap:24px;align-items:center;padding:22px 28px" data-at="1" data-fx="left"><span class="v-num" style="background:#4F46E5;color:#fff">✓</span><span style="font:600 32px/1.25 Inter,sans-serif">Strategy = how we reach our objectives with our resources.</span></div>
            <div class="v-card" style="display:flex;gap:24px;align-items:center;padding:22px 28px" data-at="2" data-fx="left"><span class="v-num" style="background:#4F46E5;color:#fff">✓</span><span style="font:600 32px/1.25 Inter,sans-serif">Disruptors start at the low end and climb.</span></div>
            <div class="v-card" style="display:flex;gap:24px;align-items:center;padding:22px 28px" data-at="3" data-fx="left"><span class="v-num" style="background:#4F46E5;color:#fff">✓</span><span style="font:600 32px/1.25 Inter,sans-serif">Digital platforms let firms like Zopa change course fast.</span></div>
          </div>
          <div class="v-abs v-sticker" style="left:760px;top:560px;font-size:36px" data-at="4" data-fx="pop">Mini quiz next ↓</div>`,
];

const SCENES = [
    { title: 'Intro', beats: [
      { say: 'Chapter 5 is all about digital business strategy.' },
      { say: 'In this lesson: what strategy means, how disruption works, and how a start-up like Zopa used a digital platform.', hold: 1.2 },
    ] },
    { title: 'What is strategy?', beats: [
      { say: 'Michael Porter put it simply: companies no longer get to choose whether to use the Internet.', hold: 1 },
      { say: 'The real question is how to use it.' },
      { say: 'So what is a strategy? Chaffey gives four ways to look at it.' },
      { say: 'A strategy defines how we will meet our objectives,' },
      { say: 'it sets how resources are allocated to reach our goals,' },
      { say: 'it selects the option we will use to compete in a market,' },
      { say: 'and it gives a long-term plan for the organisation.', hold: 0.8 },
    ] },
    { title: 'Disruptive innovation', beats: [
      { say: "Christensen's disruptive innovation model plots product performance against time.", hold: 0.6 },
      { say: 'Each grey line shows the performance customers will pay for: the high end, the mainstream and the low end.', hold: 0.8 },
      { say: 'Incumbents keep improving for their best customers at the high end, where profits are biggest.', hold: 1.2 },
      { say: 'That leaves the low end, the least profitable part, wide open.' },
      { say: 'A new entrant starts right there, with a simpler and cheaper product…', hold: 0.6 },
      { say: '…then climbs until it is good enough for the mainstream. That is disruption.', hold: 1.6 },
    ] },
    { title: 'Getting the first users', beats: [
      { say: 'How does a start-up find its first thousand users? Lenny Rachitsky sees the same three moves again and again.' },
      { say: 'One: reach out to friends and colleagues.' },
      { say: 'Two: go where your target audience hangs out, online or offline.' },
      { say: 'Three: get influencers on board.' },
      { say: 'Marketplaces add more: message targeted strangers, put up stickers and flyers, and let supply drive demand.', hold: 1 },
      { say: 'To keep growing, picture a racecar.', hold: 0.8 },
      { say: 'The engine is your growth loop. It does most of the work.' },
      { say: 'Turbo boosts, like PR or a big ad, give a short burst that fades.' },
      { say: 'Lubricants, like better conversion or retention, make the engine run smoother.' },
      { say: 'And fuel, meaning capital, content and users, keeps it all running.', hold: 0.8 },
    ] },
    { title: 'Zopa: strategic agility', beats: [
      { say: 'Zopa stands for Zone Of Possible Agreement.', hold: 0.8 },
      { say: "In 2005 it launched the world's first peer-to-peer lending exchange: savers lend directly to borrowers.", hold: 0.6 },
      { say: 'Cutting out the bank meant better rates for both sides, and more than six billion pounds lent by 2020.' },
      { say: 'Then COVID-19 made trading harder, while new regulation opened a door.' },
      { say: 'So in 2021 Zopa relaunched as a bank: still lending, now with protected savings. That is strategic agility.', hold: 1.4 },
    ] },
    { title: 'Platform types', beats: [
      { say: 'Many digital businesses are platforms, and there are three kinds.' },
      { say: 'Aggregation platforms bring many offers together: MoneySupermarket, the App Store, eBay and Kaggle.', hold: 0.8 },
      { say: 'Social platforms connect people: Facebook and Twitter.' },
      { say: 'Mobilisation platforms rally people behind a project: Crowdfunder and Kickstarter.', hold: 1 },
    ] },
    { title: 'Recap', beats: [
      { say: 'Quick recap.' },
      { say: 'Strategy is how we reach our objectives with our resources.' },
      { say: 'Disruptors start at the low end and climb.' },
      { say: 'And digital platforms let firms like Zopa change course fast.' },
      { say: 'Now try the mini quiz below the video.', hold: 1 },
    ] },
  ];

export const scenes = SCENES.map((s, i) => ({ ...s, html: HTML[i] }));

export const checkpoints = [
    { after: 2, q: 'A simpler, cheaper product first wins the least profitable customers, then moves up to the mainstream. What is it?',
      opts: ['Sustaining innovation', 'Disruptive innovation', 'Market penetration'], answer: 1,
      why: 'Disruptors start at the low end, then climb.' },
    { after: 4, q: 'Zopa turned from a P2P lending exchange into a bank when the market changed. Which idea does that show?',
      opts: ['Strategic agility', 'A sustaining trajectory', 'An aggregation platform'], answer: 0,
      why: 'Changing direction fast when the environment shifts is strategic agility.' },
  ];
