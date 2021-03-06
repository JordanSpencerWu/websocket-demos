import { useContext, useEffect } from 'react';

import { SocketContext } from 'components/pages/DemoOnePage/providers/SocketProvider';
import {
  findChannelTopic,
  findChannelListenEvent,
} from 'components/pages/DemoOnePage/contants/channels';

function useSocketOnListener(
  channelTopic: string,
  event: string,
  callback: (payload: any) => void,
) {
  const socket = useContext(SocketContext);

  useEffect(() => {
    // @ts-ignore
    const channels = socket == null ? [] : socket.channels;
    const channel = findChannelTopic(channels, channelTopic) || null;
    // @ts-ignore
    const bindings = channel == null ? [] : channel.bindings;
    const binding = findChannelListenEvent(bindings, event) || null;

    let handleRef: number;
    if (socket != null && channel && !binding) {
      handleRef = channel.on(event, callback);
    }

    return () => {
      if (channel) {
        channel.off(event, handleRef);
      }
    };
  }, [socket, channelTopic]);
}

export default useSocketOnListener;
