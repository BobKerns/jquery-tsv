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

GITDIR=$(git rev-parse --git-dir 2>/dev/null)
ORIGINAL=$(git rev-parse HEAD)
ORIGINAL_HEAD=$(cat $GITDIR/HEAD)

function mybranch() {
  (
    if egrep --silent -e '^ref: ' <$GITDIR/HEAD; then
      sed 's@^.*/\([^/]*\)$@\1@' <$GITDIR/HEAD
    else
      BHEAD=$(git describe --all --long $(cat $GITDIR/HEAD) | sed -e 's@^.*/\([^/]*\)$@\1@')
      POSBRANCHES=$(git branch --list --contains $(cat $GITDIR/HEAD) | egrep -v '^\*')
      echo -n "detached from branch head at $BHEAD, Possible branches: $POSBRANCHES"
    fi
  )
}

if [ "$ORIGINAL" != "release-$RELEASE" ]; then
  echo <<EOF
You must release from a release branch named release-$RELEASE

This should be based on the last release on master. All topic changes
should be merged to this branch, and the branch should be in a clean
state prior to release.

Current state: $(mybranch)
EOF
  exit 1;
fi
# Reundant after that check, but we want to be sure.
git checkout release-$RELEASE

git branch --force RELEASE_TEMP
if [ "$?" != "0" ]; then
  cat 1>&2 <<EOF
For some reason, we could not create or recreate the RELEASE_TEMP branch.

We appear to currently be here: $(mybranch)

EOF
  
fi

# Now we're ready to go. Failures from here are fatal.
set -e
function handleFailure() {
  cat 1>&2 <<EOF
The release was unsuccessful. Please fix the problem and try again.

EOF

if [ "$(mybranch)" == "RELEASE_TEMP" ]; then
cat 1>&2 <<EOF
We have let you on the RELEASE_TEMP branch so you can investigate the
failure.
EOF
else
cat 1>&2 <<EOF
We expected to leave you on the RELEASE_TEMP branch so you could
investigate the failure.

However, something appears to have gone wrong, and we have left you here:
$(mybranch)
EOF
fi

cat 1>&2 <<EOF

Fix up the release-$RELEASE branch as necessary, possibly rebasing it
on the most recent release, then retry this command.
EOF

git status
exit 1;
}
trap "handleFailure" ERR

git checkout RELEASE_TEMP

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

# --delete will only delete if it's been fully merged.
git branch --delete RELEASE_TEMP

cat <<EOF
The product is now released into the repository.

Caution: You are now on the master branch.
EOF
