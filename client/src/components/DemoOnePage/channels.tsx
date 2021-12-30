export function findChannelTopic(socket: any, topic :string): any {
  return socket.channels.find((channel: any) => channel.topic == topic);
}

export const GAME_LOBBY_CHANNEL = "game_room:lobby";