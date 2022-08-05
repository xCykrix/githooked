
TEMP_DIR="UPDATE_STATE_LOCK_X1"

echo "Updating using '${TEMP_DIR}' as relative storage."
echo "Cloning the 'meta' template to the relative storage."
git clone https://github.com/amethyst-studio/meta "${TEMP_DIR}"

echo "Pulling the files which can be updated."
cp -r "./${TEMP_DIR}/.github" "./"
cp -r "./${TEMP_DIR}/UPDATE_TEMPLATE.sh" "./UPDATE_TEMPLATE.sh"
cp -r "./${TEMP_DIR}/.editorconfig" "./.editorconfig"
cp -r "./${TEMP_DIR}/.gitattributes" "./.gitattributes"

if ! [[ "$PWD" =~ "meta" ]]; then
  sed -i "s/random/$RANDOM-$RANDOM-$RANDOM-$RANDOM/g" .github/settings.yml
  sed -i "s/vr-stage: .*//g" .github/settings.yml
else
  sed -i "s/vr-stage: .*/vr-stage: $RANDOM-$RANDOM-$RANDOM-$RANDOM/g" .github/settings.yml
fi

# Remove the UPDATE_STATE_LOCK_X1 dir.
rm -rf "./${TEMP_DIR}/"

# Commit the changes.
git reset
git add UPDATE_TEMPLATE.sh
git add .github
git add .editorconfig
git add .gitattributes
git commit -m 'chore(meta): update cross-organization meta documents'

# Notice.
echo 'Done! Please push these changed when finished.'
