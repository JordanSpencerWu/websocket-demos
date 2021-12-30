import React, { useEffect, useState, createContext } from 'react';
import { Socket } from "phoenix";

import { useAppSelector } from 'components/DemoOnePage/app/hooks';
import { selectToken } from 'components/DemoOnePage/app/features/game/gameSlice';

export const WS_URL = "ws://localhost:4000/socket";

const SocketContext = createContext(null);

type Props = {
  children: React.ReactNode
}

function SocketProvider(props: Props) {
  const [socket, setSocket] = useState<any>();
  const token = useAppSelector(selectToken);
  const { children } = props;

  useEffect(() => {
    if (token != null && !socket) {
      const socket = new Socket(WS_URL, {params: {token}});
      socket.connect();

      setSocket(socket);
    }
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider;