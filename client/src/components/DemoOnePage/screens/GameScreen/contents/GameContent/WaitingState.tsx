import React, { useContext } from 'react';
import debounce from 'lodash.debounce';

import { useAppSelector } from 'components/DemoOnePage/app/hooks';
import { selectUserName } from 'components/DemoOnePage/app/features/game/gameSlice';
import { PLAYER_JOIN_GAME_EVENT } from 'components/DemoOnePage/channelEvents';
import { SocketContext } from 'components/DemoOnePage/providers/SocketProvider';
import { findChannelTopic, getGameRoomChannel } from 'components/DemoOnePage/channels';

type Props = {
  game: any;
}

function playerName(name: string | null, currentUserName: string) {
  const isYou = name == currentUserName;
  
  let playerName = "TBA";
  if (name) {
    playerName = name;
  }

  if (playerName && isYou) {
    playerName += " (You)";
  }
  
  return playerName;
}

function WaitingState(props: Props) {
  const { game } = props;

  const userName = useAppSelector(selectUserName);
  const socket = useContext(SocketContext);

  const {
    player1,
    player2,
    rules,
    game_name: gameName
  } = game;

  let message = "Waiting for two more players";
  if (rules.player1 == 'joined' || rules.player2 == 'joined') {
    message = "Waiting for one more player";
  }

  const isInGame = player1.name == userName || player2.name == userName;
  const buttonText = isInGame ? "Leave" : "Join";

  function handleButtonClick(event: React.MouseEvent): void {
    const channels = socket == null ? [] : socket.channels;
    const gameRoomChannelTopic = getGameRoomChannel(gameName);
    const gameRoomChannel = findChannelTopic(channels, gameRoomChannelTopic);

    if (isInGame && gameRoomChannel) {
    }

    if (!isInGame && gameRoomChannel) {
      const player = rules.player1 == "not_joined" ? "player1" : "player2";
      gameRoomChannel.push(PLAYER_JOIN_GAME_EVENT, player)
      .receive("error", () => {
        alert("Failed to join game.")
      });
    }
  }

  return (
    <div className="flex flex-col text-center">
      <h1 className="text-4xl">Game: {gameName}</h1>
      <p>{message}</p>
      <p>Player 1: {playerName(player1.name, userName)}</p>
      <p>Player 2: {playerName(player2.name, userName)}</p>
      <button className="mt-8 underline" onClick={debounce(handleButtonClick, 200)}>{buttonText}</button>
    </div>
  )
}

export default WaitingState;