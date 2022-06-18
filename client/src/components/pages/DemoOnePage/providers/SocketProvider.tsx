import React, { useEffect, useState, createContext } from 'react';
import { Socket } from 'phoenix';

import { useAppSelector } from 'components/pages/DemoOnePage/app/hooks';
import { selectToken } from 'components/pages/DemoOnePage/app/features/game/gameSlice';

export const WS_URL = 'ws://localhost:4000/socket';

export const SocketContext = createContext<Socket>(null);

type Props = {
  children: React.ReactNode;
};

function SocketProvider(props: Props) {
  const [socket, setSocket] = useState<Socket>(null);
  const token = useAppSelector(selectToken);
  const { children } = props;

  useEffect(() => {
    if (token != null && socket == null) {
      const newSocket = new Socket(WS_URL, { params: { token } });
      newSocket.connect();

      setSocket(newSocket);
    }

    return () => {
      if (socket != null) {
        socket.disconnect();
      }
    };
  }, [token, socket]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export default SocketProvider;
