defmodule Server.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      ServerWeb.Telemetry,
      {Phoenix.PubSub, name: Server.PubSub},
      {Registry, keys: :unique, name: GameRegistry},
      {DynamicSupervisor, strategy: :one_for_one, name: GameEngine.GameSupervisor},
      ServerWeb.Endpoint
    ]

    opts = [strategy: :one_for_one, name: Server.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    ServerWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
