# multistream-chat-overlay
This project combines chats on several streaming services into one that can be added to stream overlay.

<img src="https://i.imgur.com/M86i2V1.png" alt="Example chat overlay" style="width:50%" />

> This project got inspiration from [social_stream](https://github.com/steveseguin/social_stream#readme), but for my needs social_stream wasn't good enough.

### Currently supported platforms
* Twitch
  * All chat badges
  * Removes messages from overlay if user gets timeouted on Twitch
* TikTok (with all chat badges)
* YouTube (might have some bugs)

## How to setup?
1. Install [Node.js LTS](https://nodejs.dev/en/download/)
2. Download & extract this repo
3. Edit `.env` with text editor
4. Run start.bat
5. Open `open_this_obs.html` in browser or OBS
