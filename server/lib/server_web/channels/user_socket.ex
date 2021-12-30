defmodule ServerWeb.UserSocket do
  use Phoenix.Socket

  @impl true
  def connect(%{"token" => token} = _params, socket, _connect_info) do
    result = Phoenix.Token.verify(socket, "user auth", token, max_age: 86400)

    case result do
      {:ok, user_name} ->
        socket = assign(socket, :user_name, user_name)

        {:ok, socket}

      {:error, _} ->
        :error
    end
  end

  def connect(_params, _socket, _connect_info), do: :error

  @impl true
  def id(socket), do: "user:#{socket.assigns.user_name}"
end
