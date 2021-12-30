import { useContext, useEffect } from 'react';

import { SocketContext } from 'components/DemoOnePage/providers/SocketProvider';

function useSocketJoin(channelTopic: string) {
  const socket = useContext(SocketContext);

  useEffect(() => {
    let channel: any;

    if (socket != null) {
      channel = socket.channel(channelTopic);
      channel.join();
    }

    return () => {
      if (channel) {
        channel.leave();
      }
    }
  }, [socket])
}

export default useSocketJoin;