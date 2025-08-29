// send.js
import fetch from "node-fetch";

// Basic config — edit these
const title = "🌅 Sunrise Signal";
const engPrompt = "Drop a 🌞 and tell us one good thing from today.";
const zhPrompt  = "来个🌞，分享你今天的一件小确幸～";
const nextStreamLabel = "Next live";
const nextStreamISO   = process.env.NEXT_STREAM_ISO || ""; // e.g. "2025-09-02T13:00:00Z"
const channelLink     = "https://discord.com/api/webhooks/1410758961254105188/zRVtsvYQAFlaTncnkfbxtU4m_3s7uvg5TSWnsFeZ61zG7BSOSMnQsTi84v_1sQo_Z9gF"; // optional
const bannerUrl       = process.env.BANNER_URL || "https://cdn.discordapp.com/attachments/1409312492961927339/1410778813993975850/SunRise.gif?ex=68b241a8&is=68b0f028&hm=6d2fe2f048e4d4169caa3b3bb82c7804414ff953bcd122cdd036fada9d3130fd&";    // optional image across the embed
const thumbUrl        = process.env.THUMBNAIL_URL || "https://cdn.discordapp.com/attachments/1409312492961927339/1410776459831672938/Untitled_design_1.gif?ex=68b23f76&is=68b0edf6&hm=1a990cdde5a495a807e7b112f65350b3b2e3212143dfbacfa34063ea5446adb5&"; // optional small icon
const footerNote      = "Auto-posted via Sunrise Signal";
const color           = 0xF9A825; // sunrise gold; change if you like

function countdown(iso) {
  if (!iso) return "—";
  const now = new Date();
  const then = new Date(iso);
  const diffMs = then - now;
  if (diffMs <= 0) return "Live now (or very soon)!";
  const mins = Math.floor(diffMs / 60000);
  const days = Math.floor(mins / (60*24));
  const hours = Math.floor((mins - days*24*60) / 60);
  const m = mins % 60;
  return `${days}d ${hours}h ${m}m`;
}

const embeds = [{
  title,
  description: `${engPrompt}\n**${zhPrompt}**`,
  color,
  timestamp: new Date().toISOString(),
  thumbnail: thumbUrl ? { url: thumbUrl } : undefined,
  image: bannerUrl ? { url: bannerUrl } : undefined,
  fields: [
    { name: "🗓 " + nextStreamLabel, value: countdown(nextStreamISO), inline: true },
    { name: "📎 Links", value: `[Chat here](${channelLink})`, inline: true },
  ].filter(Boolean),
  footer: { text: footerNote }
}];

const payload = {
  username: "Sunrise Signal",
  // avatar_url: "https://…", // optional
  content: "",               // optional plain text
  embeds
};

const url = process.env.WEBHOOK_URL;
if (!url) {
  console.error("Missing WEBHOOK_URL");
  process.exit(1);
}

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});

if (!res.ok) {
  console.error("Discord error", await res.text());
  process.exit(1);
} else {
  console.log("Posted Sunrise Signal.");
}
