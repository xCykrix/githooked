
TEMP_DIR="UPDATE_STATE_LOCK_X1"

echo "Updating using '${TEMP_DIR}' as relative storage."
echo "Cloning the 'meta' template to the relative storage."
git clone git@codeberg.org:Amethyst/meta.git "${TEMP_DIR}"

echo "Pulling the files which can be updated."
cp -r "./${TEMP_DIR}/ISSUE_TEMPLATE" "./"
cp -r "./${TEMP_DIR}/CODE_OF_CONDUCT.md" "./CODE_OF_CONDUCT.md"
cp -r "./${TEMP_DIR}/CONTRIBUTING.md" "./CONTRIBUTING.md"
cp -r "./${TEMP_DIR}/SECURITY.md" "./SECURITY.md"
cp -r "./${TEMP_DIR}/SUPPORT.md" "./SUPPORT.md"
cp -r "./${TEMP_DIR}/UPDATE_TEMPLATE.sh" "./UPDATE_TEMPLATE.sh"

# Remove the UPDATE_STATE_LOCK_X1 dir.
rm -rf "./${TEMP_DIR}/"

# Commit the changes.
git reset
git add ISSUE_TEMPLATE
git add CODE_OF_CONDUCT.md
git add CONTRIBUTING.md
git add SECURITY.md
git add SUPPORT.md
git add UPDATE_TEMPLATE.sh
git commit -m 'chore(meta): update cross-organization meta documents'

# Notice.
echo 'Done! Please push these changed when finished.'
