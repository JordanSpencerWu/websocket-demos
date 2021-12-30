defmodule ServerWeb.GameRoomChannel do
  use ServerWeb, :channel

  alias GameEngine.GameSupervisor
  alias GameEngine.Game

  @create_game_event "create_game"
  @delete_game_event "delete_game"

  @game_created_event "game_created"
  @game_deleted_event "game_deleted"

  @impl true
  def join("game_room:lobby", _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def join("game_room:" <> _game_name, _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_in(@create_game_event, game_name, socket) do
    result = GameSupervisor.start_game(game_name)

    case result do
      {:ok, _pid} ->
        game = Game.state(game_name)
        broadcast!(socket, @game_created_event, game)

        {:reply, :ok, socket}

      {:error, _} ->
        {:reply, {:error, :already_started}, socket}
    end
  end

  @impl true
  def handle_in(@delete_game_event, game_name, socket) do
    result = GameSupervisor.stop_game(game_name)

    case result do
      :ok ->
        broadcast!(socket, @game_deleted_event, %{game_name: game_name})

        {:reply, :ok, socket}

      {:error, :not_found} ->
        {:reply, {:error, :not_found}, socket}
    end
  end
end
