defmodule GameEngine.Game do
  use GenServer, restart: :transient

  alias __MODULE__
  alias GameEngine.Board
  alias GameEngine.Matrix
  alias GameEngine.Rules
  alias ServerWeb.Endpoint

  @game_deleted_event "game_deleted"
  @game_lobby_channel "game_room:lobby"

  @players [:player1, :player2]
  @timeout 1000 * 60 * 10

  @derive {Jason.Encoder, except: [:board]}
  defstruct board: Board.new(),
            game_board: [
              [nil, nil, nil],
              [nil, nil, nil],
              [nil, nil, nil]
            ],
            game_name: nil,
            player1: %{name: nil},
            player2: %{name: nil},
            rules: %Rules{},
            winner: nil

  def start_link(game_name) when is_binary(game_name) do
    GenServer.start_link(__MODULE__, game_name, name: via_tuple(game_name))
  end

  def init(game_name) do
    game = Map.put(%Game{}, :game_name, game_name)

    {:ok, game, @timeout}
  end

  def state(game_name) do
    [{pid, nil}] = Registry.lookup(GameRegistry, game_name)

    GenServer.call(pid, :state)
  end

  def player_leave(game_name, player) when player in @players do
    [{pid, nil}] = Registry.lookup(GameRegistry, game_name)

    GenServer.call(pid, {:player_left, player})
  end

  def player_joined(game_name, player, player_name)
      when player in @players and is_binary(player_name) do
    [{pid, nil}] = Registry.lookup(GameRegistry, game_name)

    GenServer.call(pid, {:player_joined, player, player_name})
  end

  def player_ready(game_name, player) when player in @players do
    [{pid, nil}] = Registry.lookup(GameRegistry, game_name)

    GenServer.call(pid, {:player_ready, player})
  end

  def player_pick(game_name, player, row, col) when player in @players do
    [{pid, nil}] = Registry.lookup(GameRegistry, game_name)

    GenServer.call(pid, {player, row, col})
  end

  def handle_call(:state, _from, state) do
    {:reply, state, state, @timeout}
  end

  def handle_call({:player_left, player}, _from, state) do
    with {:ok, rules} <- Rules.check(state.rules, {player, :leave}) do
      state =
        state
        |> update_player_name(player, nil)
        |> update_rules(rules)
        |> update_board(Board.new())
        |> update_game_board([
          [nil, nil, nil],
          [nil, nil, nil],
          [nil, nil, nil]
        ])

      {:reply, :ok, state, @timeout}
    else
      :error -> {:reply, :error, state, @timeout}
    end
  end

  def handle_call({:player_joined, player, player_name}, _from, state) do
    with {:ok, rules} <- Rules.check(state.rules, {player, :joined}) do
      state =
        state
        |> update_player_name(player, player_name)
        |> update_rules(rules)

      {:reply, :ok, state, @timeout}
    else
      :error -> {:reply, :error, state, @timeout}
    end
  end

  def handle_call({:player_ready, player}, _from, state) do
    with {:ok, rules} <- Rules.check(state.rules, {player, :ready}) do
      state = update_rules(state, rules)

      {:reply, :ok, state, @timeout}
    else
      :error -> {:reply, :error, state, @timeout}
    end
  end

  def handle_call({player, row, col}, _from, state) do
    choice =
      if player == :player1 do
        :x_coordinates
      else
        :o_coordinates
      end

    board_value =
      if choice == :x_coordinates do
        "x"
      else
        "o"
      end

    with {:ok, rules} <- Rules.check(state.rules, {player, :pick}),
         {:ok, board} <- Board.pick(state.board, choice, row, col),
         coordinates = Map.get(board, choice),
         check_win? = Board.check_win?(coordinates),
         {:ok, rules} = Rules.check(rules, {:check_win, check_win?}),
         check_tie? = Board.check_tie?(board, check_win?),
         {:ok, rules} = Rules.check(rules, {:check_tie, check_tie?}) do
      game_board =
        state.game_board
        |> Matrix.from_list()
        |> put_in([row, col], board_value)
        |> Matrix.to_list()

      state =
        state
        |> update_rules(rules)
        |> update_board(board)
        |> update_game_board(game_board)
        |> update_winner(player, check_win?, check_tie?)

      if check_win? do
        {:reply, :ok, %{state | winner: player}, @timeout}
      else
        {:reply, :ok, state, @timeout}
      end
    else
      _error -> {:reply, :error, state, @timeout}
    end
  end

  def handle_info(:timeout, state) do
    Endpoint.broadcast!(@game_lobby_channel, @game_deleted_event, %{game_name: state.game_name})

    {:stop, {:shutdown, :timeout}, state}
  end

  def via_tuple(name) do
    {:via, Registry, {GameRegistry, name}}
  end

  defp update_player_name(state, player, name) do
    player_info = %{name: name}

    Map.put(state, player, player_info)
  end

  defp update_rules(state, rules) do
    %{state | rules: rules}
  end

  defp update_board(state, board) do
    %{state | board: board}
  end

  defp update_game_board(state, game_board) do
    %{state | game_board: game_board}
  end

  defp update_winner(state, player, true = _check_win?, _check_tie?) do
    %{state | winner: player}
  end

  defp update_winner(state, _player, _check_win?, true = _check_tie?) do
    %{state | winner: :tie}
  end

  defp update_winner(state, _player, _check_win?, _check_tie?) do
    state
  end
end
