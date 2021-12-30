defmodule ServerWeb.GameRoomChannel do
  use ServerWeb, :channel

  @impl true
  def join("game_room:lobby", payload, socket) do
    {:ok, socket}
  end

  @impl true
  def join("game_room:" <> game_name, _payload, socket) do
    {:ok, socket}
  end
end
