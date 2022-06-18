defmodule GameEngine.Coordinate do
  @moduledoc """
  A Coordinate%{} struct contains a row and column.
  """

  alias __MODULE__

  @enforce_keys [:row, :col]
  @derive Jason.Encoder
  defstruct [:row, :col]

  @board_range 0..2

  @doc """
  Create a new %Coordinate{}
  """
  def new(row, col) when row in @board_range and col in @board_range do
    {:ok, %Coordinate{row: row, col: col}}
  end

  def new(_row, _col), do: {:error, :invalid_coordinate}
end
