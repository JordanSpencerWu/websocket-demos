defmodule ServerWeb.GameRoomChannel do
  use ServerWeb, :channel

  alias GameEngine.GameSupervisor
  alias GameEngine.Game

  @impl true
  def join("game_room:lobby", _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def join("game_room:" <> _game_name, _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_in("create_game", game_name, socket) do
    GameSupervisor.start_game(game_name)
    game = Game.state(game_name)
    broadcast!(socket, "game_created", game)

    {:noreply, socket}
  end
end
