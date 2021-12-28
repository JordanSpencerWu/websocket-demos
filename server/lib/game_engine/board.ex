defmodule GameEngine.Board do
  alias __MODULE__
  alias GameEngine.Coordinate

  @enforce_keys [:x_coordinates, :o_coordinates]
  defstruct [:x_coordinates, :o_coordinates]

  @choices [:x_coordinates, :o_coordinates]
  @win_conditions [
    MapSet.new([%Coordinate{row: 0, col: 0}, %Coordinate{row: 0, col: 1}, %Coordinate{row: 0, col: 2}]),
    MapSet.new([%Coordinate{row: 1, col: 0}, %Coordinate{row: 1, col: 1}, %Coordinate{row: 1, col: 2}]),
    MapSet.new([%Coordinate{row: 2, col: 0}, %Coordinate{row: 2, col: 1}, %Coordinate{row: 2, col: 2}]),
    MapSet.new([%Coordinate{row: 0, col: 0}, %Coordinate{row: 1, col: 0}, %Coordinate{row: 2, col: 0}]),
    MapSet.new([%Coordinate{row: 0, col: 1}, %Coordinate{row: 1, col: 1}, %Coordinate{row: 2, col: 1}]),
    MapSet.new([%Coordinate{row: 0, col: 2}, %Coordinate{row: 1, col: 2}, %Coordinate{row: 2, col: 2}]),
    MapSet.new([%Coordinate{row: 0, col: 0}, %Coordinate{row: 1, col: 1}, %Coordinate{row: 2, col: 2}]),
    MapSet.new([%Coordinate{row: 0, col: 2}, %Coordinate{row: 1, col: 1}, %Coordinate{row: 2, col: 0}])
  ]

  def new() do
    %Board{x_coordinates: MapSet.new(), o_coordinates: MapSet.new()}
  end

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

  def check_win?(coordinates) do
    Enum.any?(@win_conditions, &MapSet.subset?(&1, coordinates))
  end
end