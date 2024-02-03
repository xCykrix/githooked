info "Upgrading 'githooked' in the current path..."

# Query GitHub Release API
if command -v curl &>/dev/null; then
  trace "Detected 'curl'..."

  rm -f ./githooked
  local GITHOOED_UPDATE_URL=$(
    curl -s https://api.github.com/repos/xCykrix/githooked/releases/latest |
      grep "browser_download_url.*" |
      cut -d : -f 2,3 |
      tr -d \" |
      tr -d '[:space:]'
  )
  curl -LO "$GITHOOED_UPDATE_URL"
elif command -v wget &>/dev/null; then
  trace "Detected 'wget'..."

  rm -f ./githooked
  wget https://api.github.com/repos/xCykrix/githooked/releases/latest -qO- |
    grep "browser_download_url.*" |
    cut -d : -f 2,3 |
    tr -d \" |
    tr -d '[:space:]' |
    wget -qi -
fi

# Call Installation
chmod +x ./githooked
./githooked install
