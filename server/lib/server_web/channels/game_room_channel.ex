defmodule ServerWeb.GameRoomChannel do
  use ServerWeb, :channel

  alias GameEngine.GameSupervisor
  alias GameEngine.Game

  @create_game_event "create_game"
  @delete_game_event "delete_game"
  @player_is_ready_event "player_is_ready"
  @player_join_game_event "player_join_game"
  @player_leave_game_event "player_leave_game"
  @player_pick_event "player_pick"
  @player_play_again "player_play_again"

  @game_created_event "game_created"
  @game_deleted_event "game_deleted"
  @update_game_event "update_game"

  @impl true
  def join("game_room:lobby", _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def join("game_room:" <> game_name, _payload, socket) do
    socket = assign(socket, :game_name, game_name)

    {:ok, socket}
  end

  @impl true
  def handle_in(@create_game_event, %{"game_name" => game_name}, socket) do
    result = GameSupervisor.start_game(game_name)

    case result do
      {:ok, _pid} ->
        game = Game.state(game_name)
        broadcast!(socket, @game_created_event, game)

        {:reply, :ok, socket}

      _error ->
        {:reply, {:error, "failed to create game"}, socket}
    end
  end

  @impl true
  def handle_in(@delete_game_event, %{"game_name" => game_name}, socket) do
    result = GameSupervisor.stop_game(game_name)

    case result do
      :ok ->
        broadcast!(socket, @game_deleted_event, %{game_name: game_name})

        {:reply, :ok, socket}

      {:error, :not_found} ->
        {:reply, {:error, "not_found"}, socket}

      _error ->
        {:reply, {:error, "failed to delete game"}, socket}
    end
  end

  @impl true
  def handle_in(@player_join_game_event, %{"player" => player}, socket) do
    game_name = socket.assigns.game_name
    player_name = socket.assigns.user_name
    player = String.to_existing_atom(player)

    result = Game.player_joined(game_name, player, player_name)

    case result do
      :ok ->
        game = Game.state(game_name)
        broadcast!(socket, @update_game_event, game)

        {:reply, :ok, socket}

      _error ->
        {:reply, {:error, "failed to join game"}, socket}
    end
  end

  @impl true
  def handle_in(@player_leave_game_event, %{"player" => player}, socket) do
    game_name = socket.assigns.game_name
    player = String.to_existing_atom(player)

    result = Game.player_leave(game_name, player)

    case result do
      :ok ->
        game = Game.state(game_name)
        broadcast!(socket, @update_game_event, game)

        {:reply, :ok, socket}

      _error ->
        {:reply, {:error, "failed to join game"}, socket}
    end
  end

  @impl true
  def handle_in(@player_is_ready_event, %{"player" => player}, socket) do
    game_name = socket.assigns.game_name
    player = String.to_existing_atom(player)

    result = Game.player_ready(game_name, player)

    case result do
      :ok ->
        game = Game.state(game_name)
        broadcast!(socket, @update_game_event, game)

        {:reply, :ok, socket}

      _error ->
        {:reply, {:error, "failed to join game"}, socket}
    end
  end

  @impl true
  def handle_in(
        @player_pick_event,
        %{"row" => row, "column" => column, "player" => player},
        socket
      ) do
    game_name = socket.assigns.game_name
    player = String.to_existing_atom(player)

    result = Game.player_pick(game_name, player, row, column)

    case result do
      :ok ->
        game = Game.state(game_name)
        broadcast!(socket, @update_game_event, game)

        {:reply, :ok, socket}

      _error ->
        {:reply, {:error, "failed to join game"}, socket}
    end
  end

  @impl true
  def handle_in(@player_play_again, %{"player" => player}, socket) do
    game_name = socket.assigns.game_name
    player = String.to_existing_atom(player)

    result = Game.player_play_again(game_name, player)

    case result do
      :ok ->
        game = Game.state(game_name)
        broadcast!(socket, @update_game_event, game)

        {:reply, :ok, socket}

      _error ->
        {:reply, {:error, "failed to join game"}, socket}
    end
  end
end
