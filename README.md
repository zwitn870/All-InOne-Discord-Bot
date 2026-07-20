<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-57F287?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord" alt="Discord.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB"/>
  <br/>
  <img src="https://img.shields.io/github/stars/zwitn870/All-InOne-Discord-Bot?style=for-the-badge&logo=github" alt="Stars"/>
  <img src="https://img.shields.io/github/license/zwitn870/All-InOne-Discord-Bot?style=for-the-badge" alt="License"/>
</div>

<h1 align="center">🤖 All-InOne Discord Bot</h1>

<p align="center">
  <b>A fully-featured Discord bot with Tickets, Moderation, Music, Leveling, Economy, and Giveaways.</b><br/>
  Built with TypeScript, Discord.js v14, and MongoDB.
</p>

<br/>

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>🎫 Tickets</h3>
      <ul>
        <li>Button-based ticket creation</li>
        <li>Claim / Close / Add / Remove users</li>
        <li>Support role permissions</li>
        <li>Persistent MongoDB storage</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🛡️ Moderation</h3>
      <ul>
        <li>Ban / Kick / Mute / Unmute</li>
        <li>Warn system with history</li>
        <li>Bulk message clear</li>
        <li>Lock / Unlock / Slowmode</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🎵 Music</h3>
      <ul>
        <li>YouTube & Spotify support</li>
        <li>Queue management (add/remove/shuffle)</li>
        <li>Loop modes (none/song/queue)</li>
        <li>Playlist support</li>
        <li>Volume control & seek</li>
      </ul>
    </td>
    <td width="50%">
      <h3>⭐ Leveling</h3>
      <ul>
        <li>Message-based XP gain</li>
        <li>Level roles rewards</li>
        <li>Leaderboard system</li>
        <li>Configurable multipliers</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>💰 Economy</h3>
      <ul>
        <li>Wallet & Bank system</li>
        <li>Daily / Weekly rewards</li>
        <li>Work & earn currency</li>
        <li>Shop with role purchases</li>
        <li>Gamble / Coinflip / Dice / Rob</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🎉 Giveaways</h3>
      <ul>
        <li>Auto-draw on expiry</li>
        <li>Multi-winner support</li>
        <li>Role & level requirements</li>
        <li>Early end & reroll</li>
      </ul>
    </td>
  </tr>
</table>

<br/>

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Discord Application with bot token

### Setup

```bash
git clone https://github.com/zwitn870/All-InOne-Discord-Bot.git
cd All-InOne-Discord-Bot
npm install
```

### Configuration

Create a `.env` file:

```env
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
MONGO_URI=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
```

### Run

```bash
npm run dev
npm run build
npm start
```

<br/>

## 📁 Project Structure

```
src/
├── index.ts
├── config.ts
├── core/
│   ├── Client.ts
│   └── Loader.ts
├── database/
│   ├── connection.ts
│   └── models/
│       ├── Guild.ts
│       ├── User.ts
│       ├── Ticket.ts
│       └── Giveaway.ts
├── modules/
│   ├── tickets/
│   ├── moderation/
│   ├── music/
│   ├── leveling/
│   ├── economy/
│   ├── giveaways/
│   └── core/
└── shared/
    ├── types/
    ├── services/
    └── utils/
```

<br/>

## 📋 Commands

<details>
<summary><b>🎫 Tickets</b></summary>

| Command | Description |
|---------|-------------|
| `/ticket-setup` | Configure ticket system |
| `/ticket-close` | Close current ticket |
| `/ticket-claim` | Claim a ticket |
| `/ticket-add` | Add user to ticket |
| `/ticket-remove` | Remove user from ticket |
| `/ticket-rename` | Rename ticket channel |
</details>

<details>
<summary><b>🛡️ Moderation</b></summary>

| Command | Description |
|---------|-------------|
| `/ban` | Ban a member |
| `/kick` | Kick a member |
| `/mute` | Timeout a member |
| `/unmute` | Remove timeout |
| `/warn` | Warn a member |
| `/warnings` | View warnings |
| `/clear` | Bulk delete messages |
| `/lock` | Lock a channel |
| `/unlock` | Unlock a channel |
| `/slowmode` | Set channel slowmode |
</details>

<details>
<summary><b>🎵 Music</b></summary>

| Command | Description |
|---------|-------------|
| `/play` | Play a song or URL |
| `/skip` | Skip current song |
| `/stop` | Stop & clear queue |
| `/queue` | View queue |
| `/nowplaying` | Current song info |
| `/pause` | Pause playback |
| `/resume` | Resume playback |
| `/volume` | Set volume (0-200) |
| `/loop` | Set loop mode |
| `/shuffle` | Shuffle queue |
| `/remove` | Remove song from queue |
| `/playlist` | Save queue as playlist |
| `/seek` | Seek to position |
</details>

<details>
<summary><b>⭐ Leveling</b></summary>

| Command | Description |
|---------|-------------|
| `/rank` | Check XP rank |
| `/leaderboard` | XP leaderboard |
| `/setlevel` | Set user level (admin) |
| `/level-role` | Manage level roles |
</details>

<details>
<summary><b>💰 Economy</b></summary>

| Command | Description |
|---------|-------------|
| `/balance` | Check balance |
| `/daily` | Daily reward |
| `/weekly` | Weekly reward |
| `/give` | Give currency |
| `/shop` | Browse shop |
| `/buy` | Purchase item |
| `/inventory` | View items |
| `/work` | Work for currency |
| `/gamble` | 50/50 gamble |
| `/rob` | Attempt robbery |
| `/coinflip` | Bet on coin flip |
| `/dice` | Bet on dice roll |
</details>

<details>
<summary><b>🎉 Giveaways</b></summary>

| Command | Description |
|---------|-------------|
| `/giveaway-start` | Start a giveaway |
| `/giveaway-end` | End giveaway early |
| `/giveaway-reroll` | Reroll winners |
</details>

<details>
<summary><b>⚙️ Core</b></summary>

| Command | Description |
|---------|-------------|
| `/help` | Show all commands |
</details>

<br/>

## 🛠️ Built With

- [Discord.js v14](https://discord.js.org/) — Discord API framework
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) — Database
- [@discordjs/voice](https://github.com/discordjs/voice) — Audio playback
- [play-dl](https://github.com/play-dl/play-dl) — YouTube & Spotify streaming

<br/>

## 📄 License

This project is licensed under the MIT License.
