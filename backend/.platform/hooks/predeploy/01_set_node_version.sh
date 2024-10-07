#!/bin/bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# Install and use Node.js 20.11.1
nvm install 20.11.1
nvm use 20.11.1
# Make it the default
nvm alias default 20.11.1