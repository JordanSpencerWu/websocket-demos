export function findChannelTopic(channels: Array<object>, topic :string): any {
  return channels.find((channel: any) => channel.topic == topic);
}

export function getGameRoomChannel(gameName: string) {
  return `game_room:${gameName}`;
}

export const GAME_LOBBY_CHANNEL = "game_room:lobby";