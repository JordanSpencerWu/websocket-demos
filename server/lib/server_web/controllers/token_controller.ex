defmodule ServerWeb.TokenController do
  use ServerWeb, :controller

  def create(conn, %{"user_name" => user_name}) do
    token = Phoenix.Token.sign(conn, "user auth", user_name)

    json(conn, %{token: token})
  end
end