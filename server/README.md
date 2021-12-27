## Getting Started

1. [Install Brew](https://brew.sh/)
2. Install build tools for erlang `brew install autoconf openssl@1.1 libxslt fop wxwidgets`
4. Set environment variables for asdf `export KERL_CONFIGURE_OPTIONS="--without-javac --with-ssl=$(brew --prefix openssl@1.1)"`
5. Install asdf `asdf install`
6. Install dependencies `mix deps.get`
7. Start server `mix phx.server`