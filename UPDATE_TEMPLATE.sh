
TEMP_DIR="UPDATE_STATE_LOCK_X1"

echo "Updating using '${TEMP_DIR}' as relative storage."
echo "Cloning the 'meta' template to the relative storage."
git clone https://github.com/amethyst-studio/meta "${TEMP_DIR}"

echo "Installing githooked to the project."
if ! [[ -d "./.git-hooks/_util/" ]]; then
  curl -s https://api.github.com/repos/amethyst-studio/githooked/releases/latest \
  | grep "githooked_linux" \
  | cut -d : -f 2,3 \
  | tr -d \" \
  | wget -qi -
fi
chmod +x githooked_linux
./githooked_linux

echo "Pulling the files which will be updated."
cp -r "./${TEMP_DIR}/.github" "./"
cp -r "./${TEMP_DIR}/UPDATE_TEMPLATE.sh" "./UPDATE_TEMPLATE.sh"
cp -r "./${TEMP_DIR}/.editorconfig" "./.editorconfig"
cp -r "./${TEMP_DIR}/.gitattributes" "./.gitattributes"
cp -r "./${TEMP_DIR}/.git-hooks/prepare-commit-msg" "./.git-hooks/prepare-commit-msg"

if ! [[ "$PWD" =~ "meta" ]]; then
  sed -i "s/random/$RANDOM-$RANDOM-$RANDOM-$RANDOM/g" .github/settings.yml
  sed -i "s/vr-stage: .*//g" .github/settings.yml
else
  sed -i "s/vr-stage: .*/vr-stage: $RANDOM-$RANDOM-$RANDOM-$RANDOM/g" .github/settings.yml
fi

# Remove the UPDATE_STATE_LOCK_X1 dir.
rm -rf "./${TEMP_DIR}/"
rm -rf githooked_linux

# Commit the changes.
echo "Commiting files to the selected branch."
git reset
git add UPDATE_TEMPLATE.sh
git add .github
git add .editorconfig
git add .gitattributes
git commit -m "chore(meta): update cross-organization state"

# Notice.
echo "Done! Please create a pull request or push to release. These files do not change production."
