defmodule ServerWeb.GameRoomChannelTest do
  use ServerWeb.ChannelCase

  setup do
    {:ok, _, socket} =
      ServerWeb.UserSocket
      |> socket("user_name", %{user_name: "user_name"})
      |> subscribe_and_join(ServerWeb.GameRoomChannel, "game_room:lobby")

    %{socket: socket}
  end
end
