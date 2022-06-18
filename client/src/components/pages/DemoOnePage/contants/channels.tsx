import { Channel } from 'phoenix';

type Binding = {
  callback: () => void;
  event: string;
  ref: number;
};

export function findChannelTopic(channels: Array<Channel>, topic: string): Channel {
  // @ts-ignore
  return channels.find((channel: Channel) => channel.topic == topic);
}

export function findChannelListenEvent(bindings: Array<Binding>, event: string): Binding {
  return bindings.find((binding: Binding) => binding.event == event);
}

export function getGameRoomChannel(gameName: string) {
  return `game_room:${gameName}`;
}

export const GAME_LOBBY_CHANNEL = 'game_room:lobby';
