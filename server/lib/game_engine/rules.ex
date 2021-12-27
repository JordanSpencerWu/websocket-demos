defmodule GameEngine.Rules do
  alias __MODULE__

  defstruct state: :initialized,
            player1: :not_joined,
            player2: :not_joined

  def new(), do: %Rules{}

  def check(%Rules{state: :initialized} = rules, {:player1, :joined}) do
    {:ok, %Rules{rules | state: :waiting_for_players, player1: :joined}}
  end

  def check(%Rules{state: :waiting_for_players} = rules, {:player2, :joined}) do
    {:ok, %Rules{rules | state: :players_ready, player2: :joined}}
  end

  def check(%Rules{state: :players_ready} = rules, {:player1, :ready}) do
    if rules.player2 == :ready do
      {:ok, %Rules{rules | state: random_player_turn(), player1: :ready}}
    else
      {:ok, %Rules{rules | state: :players_ready, player1: :ready}}
    end
  end

  def check(%Rules{state: :players_ready} = rules, {:player2, :ready}) do
    if rules.player1 == :ready do
      {:ok, %Rules{rules | state: random_player_turn(), player2: :ready}}
    else
      {:ok, %Rules{rules | state: :players_ready, player2: :ready}}
    end
  end

  def check(%Rules{state: :player1_turn} = rules, {:player1, :pick}) do
    {:ok, %Rules{rules | state: :player2_turn}}
  end

  def check(%Rules{state: :player1_turn} = rules, {:check_win, check_win?}) do
    if check_win? do
      {:ok, %Rules{rules | state: :game_over}}
    else
      {:ok, rules}
    end
  end

  def check(%Rules{state: :player2_turn} = rules, {:player2, :pick}) do
    {:ok, %Rules{rules | state: :player1_turn}}
  end

  def check(%Rules{state: :player2_turn} = rules, {:check_win, check_win?}) do
    if check_win? do
      {:ok, %Rules{rules | state: :game_over}}
    else
      {:ok, rules}
    end
  end

  def check(_state, _action), do: :error

  defp random_player_turn do
    Enum.random([:player1_turn, :player2_turn])
  end
end