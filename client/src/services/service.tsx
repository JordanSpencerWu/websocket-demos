const HOST = 'http://localhost:4000';

function createToken(user_name: string): Promise<object> {
  const url = `${HOST}/api/token`;
  const body = JSON.stringify({ user_name });
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  };

  return fetch(url, options);
}

function fetchGame(gameName: string): Promise<object> {
  const url = `${HOST}/api/games/${gameName}`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(url, options);
}

function fetchGames(): Promise<object> {
  const url = `${HOST}/api/games`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(url, options);
}

export default {
  createToken,
  fetchGame,
  fetchGames,
};
