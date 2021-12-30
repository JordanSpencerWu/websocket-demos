defmodule ServerWeb.GameRoomChannel do
  use ServerWeb, :channel

  alias GameEngine.GameSupervisor

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

    {:noreply, socket}
  end
end
