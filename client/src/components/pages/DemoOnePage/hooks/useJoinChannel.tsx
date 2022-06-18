import { useContext, useEffect } from 'react';
import { Channel, Socket } from 'phoenix';

import { SocketContext } from 'components/pages/DemoOnePage/providers/SocketProvider';
import { findChannelTopic } from 'components/pages/DemoOnePage/contants/channels';

function useJoinChannel(channelTopic: string) {
  const socket: Socket = useContext(SocketContext);

  useEffect(() => {
    // @ts-ignore
    const channels: Channel[] = socket == null ? [] : socket.channels;
    let channel = findChannelTopic(channels, channelTopic);

    if (socket != null && !channel) {
      const newChannel = socket.channel(channelTopic);
      newChannel.join();
      channel = newChannel;
    }

    return () => {
      if (channel) {
        channel.leave();
      }
    };
  }, [socket, channelTopic]);
}

export default useJoinChannel;
