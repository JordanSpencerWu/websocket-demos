defmodule GameEngine.Rules do
  alias __MODULE__

  @players [:player1, :player2]

  @derive Jason.Encoder
  defstruct state: :waiting_for_players,
            player1: :not_joined,
            player2: :not_joined

  def new(), do: %Rules{}

  def check(rules, {player, :leave}) when player in @players do
    rules = Map.put(rules, player, :not_joined)
    other_player = if player == :player1, do: :player2, else: :player1

    rules =
      if Map.get(rules, other_player) == :ready,
        do: Map.put(rules, other_player, :joined),
        else: rules

    {:ok, %Rules{rules | state: :waiting_for_players}}
  end

  def check(rules, {player, :play_again}) when player in @players do
    rules = Map.put(rules, player, :ready)
    other_player = if player == :player1, do: :player2, else: :player1

    rules =
      if Map.get(rules, other_player) == :ready,
        do: Map.put(rules, other_player, :joined),
        else: rules

    {:ok, %Rules{rules | state: :players_ready}}
  end

  def check(%Rules{state: :waiting_for_players} = rules, {player, :joined})
      when player in @players do
    rules = Map.put(rules, player, :joined)

    if rules.player1 == :joined and rules.player2 == :joined do
      {:ok, %Rules{rules | state: :players_ready, player1: :joined}}
    else
      {:ok, rules}
    end
  end

  def check(%Rules{state: :players_ready} = rules, {player, :ready}) when player in @players do
    rules = Map.put(rules, player, :ready)

    if rules.player1 == :ready and rules.player2 == :ready do
      {:ok, %Rules{rules | state: random_player_turn()}}
    else
      {:ok, rules}
    end
  end

  def check(%Rules{state: :player1_turn} = rules, {:player1, :pick}) do
    {:ok, %Rules{rules | state: :player2_turn}}
  end

  def check(%Rules{state: :player2_turn} = rules, {:player2, :pick}) do
    {:ok, %Rules{rules | state: :player1_turn}}
  end

  def check(%Rules{state: state} = rules, {:check_win, check_win?})
      when state in [:player1_turn, :player2_turn] do
    if check_win? do
      {:ok, %Rules{rules | state: :game_over}}
    else
      {:ok, rules}
    end
  end

  def check(%Rules{state: state} = rules, {:check_tie, check_tie?})
      when state in [:player1_turn, :player2_turn] do
    if check_tie? do
      {:ok, %Rules{rules | state: :game_over}}
    else
      {:ok, rules}
    end
  end

  def check(rules, {:check_tie, _check_tie?}) do
    {:ok, rules}
  end

  def check(_state, _action), do: :error

  defp random_player_turn do
    Enum.random([:player1_turn, :player2_turn])
  end
end
