import { useState, useContext, useEffect } from 'react';

import { SocketContext } from 'components/DemoOnePage/providers/SocketProvider';
import { findChannelTopic } from 'components/DemoOnePage/channels';

function useSocketOnListener(channelTopic: string, event: string, callback: (payload: any) => void) {
  const [channel, setChannel] = useState(null);
  const socket = useContext(SocketContext);
  const channels = socket == null ? [] : socket.channels;

  if (channels != [] && channel == null) {
    const foundChannel = findChannelTopic(channels, channelTopic) || null;

    setChannel(foundChannel);
  }

  useEffect(() => {
    let handleRef: () => void;
    
    if (channel) {
      handleRef = channel.on(event, callback);
    }

    return () => {
      if (channel) {
        channel.off(event, handleRef);
      }
    }
  }, [channel]);
}

export default useSocketOnListener;