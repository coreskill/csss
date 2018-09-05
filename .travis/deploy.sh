#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

SOURCE_BRANCH="latest"
TARGET_BRANCH="gh-pages"

# Run build scripts
npm run build

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy; just doing a build."
    exit 0
fi

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Clone the existing gh-pages for this repo into out/
# Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deploy)
git clone $REPO out
cd out
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH

# Clean out existing contents
ls -A | grep -vx .git | xargs rm -rf || exit 0
cd ..

# Run deploy scripts
cp build/* out

# Now let's go have some fun with the cloned repo
cd out
git config user.name "Katebot"
git config user.email "katebot@katemihalikova.cz"

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
if git diff --exit-code > /dev/null; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add --all .
git commit -m "Deploy to GitHub Pages ${SHA}"
cd ..

# Get the deploy key by using Travis's stored variables to decrypt repo.key.enc
ENCRYPTION_KEY=${!ENCRYPTION_LABEL}
openssl aes-256-cbc -k $ENCRYPTION_KEY -in .travis/repo.key.enc -out .travis/repo.key -d
chmod 600 .travis/repo.key
eval `ssh-agent -s`
ssh-add .travis/repo.key

# Now that we're all set up, we can push.
cd out
git push $SSH_REPO $TARGET_BRANCH