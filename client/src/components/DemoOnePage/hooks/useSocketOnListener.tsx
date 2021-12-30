import { useContext, useEffect } from 'react';

import { SocketContext } from 'components/DemoOnePage/providers/SocketProvider';
import { findChannelTopic, findChannelListenEvent } from 'components/DemoOnePage/channels';

function useSocketOnListener(channelTopic: string, event: string, callback: (payload: any) => void) {
  const socket = useContext(SocketContext);

  useEffect(() => {
    const channels = socket == null ? [] : socket.channels;
    const channel = findChannelTopic(channels, channelTopic) || null;
    const bindings = channel == null ? [] : channel.bindings;
    const binding = findChannelListenEvent(bindings, event) || null;
    
    let handleRef: () => void;
    if (socket != null && channel && !binding) {
      handleRef = channel.on(event, callback);
    }

    return () => {
      if (channel) {
        channel.off(event, handleRef);
      }
    }
  }, [socket]);
}

export default useSocketOnListener;