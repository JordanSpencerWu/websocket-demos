defmodule GameEngine.Board do
  @moduledoc """
  A Board%{} struct contains both the x and y coordinates of a
  tic tac toe game.
  """

  alias __MODULE__
  alias GameEngine.Coordinate

  @enforce_keys [:x_coordinates, :o_coordinates]
  @derive Jason.Encoder
  defstruct [:x_coordinates, :o_coordinates]

  @choices [:x_coordinates, :o_coordinates]
  @win_conditions [
    MapSet.new([
      %Coordinate{row: 0, col: 0},
      %Coordinate{row: 0, col: 1},
      %Coordinate{row: 0, col: 2}
    ]),
    MapSet.new([
      %Coordinate{row: 1, col: 0},
      %Coordinate{row: 1, col: 1},
      %Coordinate{row: 1, col: 2}
    ]),
    MapSet.new([
      %Coordinate{row: 2, col: 0},
      %Coordinate{row: 2, col: 1},
      %Coordinate{row: 2, col: 2}
    ]),
    MapSet.new([
      %Coordinate{row: 0, col: 0},
      %Coordinate{row: 1, col: 0},
      %Coordinate{row: 2, col: 0}
    ]),
    MapSet.new([
      %Coordinate{row: 0, col: 1},
      %Coordinate{row: 1, col: 1},
      %Coordinate{row: 2, col: 1}
    ]),
    MapSet.new([
      %Coordinate{row: 0, col: 2},
      %Coordinate{row: 1, col: 2},
      %Coordinate{row: 2, col: 2}
    ]),
    MapSet.new([
      %Coordinate{row: 0, col: 0},
      %Coordinate{row: 1, col: 1},
      %Coordinate{row: 2, col: 2}
    ]),
    MapSet.new([
      %Coordinate{row: 0, col: 2},
      %Coordinate{row: 1, col: 1},
      %Coordinate{row: 2, col: 0}
    ])
  ]

  @doc """
  Create a new %Board{}
  """
  def new() do
    %Board{x_coordinates: MapSet.new(), o_coordinates: MapSet.new()}
  end

  @doc """
  Pick a coordinate in a board.
  """
  def pick(board, choice, row, col) when choice in @choices do
    with {:ok, coordinate} <- Coordinate.new(row, col),
         false <- MapSet.member?(board.x_coordinates, coordinate),
         false <- MapSet.member?(board.o_coordinates, coordinate) do
      board =
        if choice == :x_coordinates do
          %Board{board | x_coordinates: MapSet.put(board.x_coordinates, coordinate)}
        else
          %Board{board | o_coordinates: MapSet.put(board.o_coordinates, coordinate)}
        end

      {:ok, board}
    else
      true ->
        {:error, :coordinate_already_exist}

      error ->
        error
    end
  end

  def pick(_board, _choice, _row, _col), do: {:error, :invalid_choice}

  @doc """
  Check if there's a winner.
  """  
  def check_win?(coordinates) do
    Enum.any?(@win_conditions, &MapSet.subset?(&1, coordinates))
  end

  @doc """
  Returns the win coordinate.
  """
  def win_coordinates(coordinates) do
    Enum.find(@win_conditions, &MapSet.subset?(&1, coordinates))
  end

  @doc """
  Check if there's a tie.
  """
  def check_tie?(board, check_win?) do
    all_coordinates =
      board.x_coordinates
      |> MapSet.union(board.o_coordinates)
      |> MapSet.to_list()

    if !check_win? and length(all_coordinates) == 9 do
      true
    else
      false
    end
  end
end
