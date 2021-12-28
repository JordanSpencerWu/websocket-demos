defmodule GameEngine.Game do
  use GenServer

  alias __MODULE__
  alias GameEngine.Board
  alias GameEngine.Rules

  @players [:player1, :player2]

  defstruct game_name: nil,
            player1: %{name: nil},
            player2: %{name: nil},
            board: Board.new(),
            rules: %Rules{},
            winner: nil

  def start_link(game_name) when is_binary(game_name) do
    GenServer.start_link(__MODULE__, game_name, [])
  end

  def init(game_name) do
    game = Map.put(%Game{}, :game_name, game_name)
  
    {:ok, game}
  end

  def player_joined(game, player, player_name) when player in @players and is_binary(player_name) do
    GenServer.call(game, {:player_joined, player, player_name})
  end

  def player_ready(game, player) when player in @players do
    GenServer.call(game, {:player_ready, player})
  end

  def player_pick(game, player, row, col) when player in @players do
    GenServer.call(game, {player, row, col})
  end

  def handle_call({:player_joined, player, player_name}, _from, state) do
    with {:ok, rules} <- Rules.check(state.rules, {player, :joined}) do
      state =
        state
        |> update_player_name(player, player_name)
        |> update_rules(rules)

      {:reply, :ok, state}
    else
      :error -> {:reply, :error, state}
    end
  end

  def handle_call({:player_ready, player}, _from, state) do
    with {:ok, rules} <- Rules.check(state.rules, {player, :ready}) do
      state = update_rules(state, rules)

      {:reply, :ok, state}
    else
      :error -> {:reply, :error, state}
    end
  end

  def handle_call({player, row, col}, _from, state) do
    choice =
      if player == :player1 do
        :x_coordinates
      else
        :o_coordinates
      end

    with {:ok, rules} <- Rules.check(state.rules, {player, :pick}),
         {:ok, board} <- Board.pick(state.board, choice, row, col),
         coordinates = Map.get(board, choice),
         check_win? = Board.check_win?(coordinates),
         {:ok, rules} = Rules.check(rules, {:check_win, check_win?}) do
      state = 
        state
        |> update_rules(rules)
        |> update_board(board)

      if check_win? do
        {:reply, :ok, %{state | winner: player}}
      else
        {:reply, :ok, state}
      end
    else
      _error -> {:reply, :error, state}
    end
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
end