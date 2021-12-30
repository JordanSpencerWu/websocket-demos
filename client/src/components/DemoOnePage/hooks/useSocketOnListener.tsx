import { useContext, useEffect } from 'react';

import { SocketContext } from 'components/DemoOnePage/providers/SocketProvider';
import { findChannelTopic } from 'components/DemoOnePage/channels';

function useSocketOnListener(channelTopic: string, event: string, callback: (payload: any) => void) {
  const socket = useContext(SocketContext);

  useEffect(() => {
    let handleRef: () => void;
    let gameLobbyChannel: any;
    if (socket != null) {
      gameLobbyChannel = findChannelTopic(socket, channelTopic);
      handleRef = gameLobbyChannel.on(event, callback);
    }

    return () => {
      if (gameLobbyChannel) {
        gameLobbyChannel.off(event, handleRef);
      }
    }
  }, [socket]);
}

export default useSocketOnListener;