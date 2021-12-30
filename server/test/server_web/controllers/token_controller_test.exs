defmodule ServerWeb.TokenControllerTest do
  use ServerWeb.ConnCase

  describe "create" do
    test "returns user token", %{conn: conn} do
      user_name = "player"

      %{"token" => token} =
        conn
        |> post(Routes.token_path(conn, :create), %{user_name: user_name})
        |> json_response(200)

      {:ok, user_name_from_token} =
        Phoenix.Token.verify(ServerWeb.Endpoint, "user auth", token, max_age: 86400)

      assert user_name_from_token == user_name
    end
  end
end
