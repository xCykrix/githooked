#!/bin/bash
set -e

# DevOps: githooked - https://xcykrix.github.io/githooked.html#githooked-installation-and-help
curl -s https://api.github.com/repos/xCykrix/githooked/releases/latest \
| grep "browser_download_url.*" \
| cut -d : -f 2,3 \
| tr -d \" \
| wget -qi - -O githooked.prod
chmod +x githooked.prod
./githooked.prod install
rm ./githooked.prod

# DevOps: shfmt - https://github.com/mvdan/sh
sudo snap install shfmt && sudo snap refresh shfmt

# Dependency: ruby gem - https://snapcraft.io/install/ruby/ubuntu
sudo snap install ruby --classic && sudo snap refresh ruby
## Child: bashly (gem) - https://bashly.dannyb.co/
/snap/bin/gem install bashly
