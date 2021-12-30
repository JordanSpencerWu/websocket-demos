defmodule ServerWeb.GameController do
  use ServerWeb, :controller

  alias GameEngine.Game

  def index(conn, _params) do
    games =
      GameRegistry
      |> Registry.select([{{:"$1", :_, :_}, [], [:"$1"]}])
      |> Enum.map(fn game_name ->
        Game.state(game_name)
      end)
      |> Enum.sort_by(&Map.fetch(&1, :game_name))

    json(conn, %{games: games})
  end
end