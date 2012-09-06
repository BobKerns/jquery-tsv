#!/usr/bin/env bash

ROOT=$(dirname $0)/..
cd $ROOT

RELEASE=$1

# Make sure we have a version number.
if [ "$RELEASE" == "" ]; then
    echo "You must specify a release number.">&2
    exit 1
fi

# Make sure the tree is clean.
if [ "$(git status --porcelain --untracked-files=normal)" != "" ]; then
  git status
  echo You must only release from a clean tree.
  exit 1
fi

# Check out the release development branch
git checkout release-$RELEASE
if [ "$?" != "0" ]; then
  echo You must release from a release branch named release-$RELEASE
  exit 1;
fi

# Now we're ready to go. Failures from here are fatal.
set -e
function handleFailure() {
  echo <<EOF
The release was unsuccessful. Please fix the problem and try again.

You may want to first do
  git reset --hard BEFORE_RELEASE
to return to the previous state.
EOF
}
trap

git tag --force BEFORE_RELEASE

# Now update and commit the release.
# First the version number in the manifest
sed "s/\"version\"\s*:\s*\".*\"/\"version\": \"$RELEASE\"/" <tsv.jquery.json >tsv.jquery.json.new
mv tsv.jquery.json.new tsv.jquery.json

# Then update the version number in the source.

sed "s/\version\s*:\s*\".*\"/\"version\": \"$RELEASE-git\"/" < src/tsv.jquery.js >src/tsv.jquery.js.new
mv src/tsv.jquery.js.new src/tsv.jquery.js

# Copy the source release to the releases tree

mkdir releases/$RELEASE
sed "s/\version\s*:\s*\".*\"/\"version\": \"$RELEASE\"/" < src/tsv.jquery.js >releases/$RELEASE/tsv.jquery-$RELEASE.js

# Then minify the release.

tools/jsmin <releases/$RELEASE/tsv.jquery-$RELEASE.js >releases/$RELEASE/tsv.jquery-$RELEASE.min.js

git add releases/$RELEASE tsv.jquery.json src/tsv.jquery.js

git commit -m"Release $RELEASE"

git checkout master
git merge -m"Release $RELEASE" release-$RELEASE

echo <<EOF
The product is now released into the repository.
EOF

git tag --delete BEFORE_RELEASE
