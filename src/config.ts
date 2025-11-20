import 'dotenv/config';
const { DISCORD_TOKEN, DISCORD_CLIENT_ID, LAVALINK_HOST, LAVALINK_PORT, LAVALINK_PASSWORD, LAVALINK_SECURE } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  LAVALINK_HOST: LAVALINK_HOST || 'localhost',
  LAVALINK_PORT: parseInt(LAVALINK_PORT || '2333'),
  LAVALINK_PASSWORD: LAVALINK_PASSWORD || 'youshallnotpass',
  LAVALINK_SECURE: LAVALINK_SECURE === 'true'
};
