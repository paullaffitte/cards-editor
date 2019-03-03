#! /usr/bin/env bash

function release() {
	local type="$1"
	local version="$2"
	local release_name="$3"

	github-release "$type" \
		--owner "$LOGIN" \
		--repo cards-editor \
		--tag "$version" \
		--name "$release_name" \
		--body "$DESCRIPTION" \
		$prerelease \
		-T "$TOKEN" \
		cards-editor*
}

default_login='paullaffitte'
env_token=$(printenv GITHUB_OAUTH_TOKEN)
read -p "Github LOGIN [$default_login]: " LOGIN
read -p "Github OAuth TOKEN [$env_token]: " -r TOKEN
LOGIN=${LOGIN:-$default_login}
TOKEN=${TOKEN:-$env_token}

VERSION=$(semver.sh $@)
default_version_name="v$VERSION"

read -p "Release name [$default_version_name]: " RELEASE_NAME
read -p "Description: " DESCRIPTION
read -p "It's a prerelease (y/N): " -n 1 -r && echo
RELEASE_NAME=${RELEASE_NAME:-$default_version_name}

yarn release
cd ./dist

if [[ $REPLY =~ ^[Yy]$ ]]; then
    prerelease='--prerelease=true'
else
	release delete "latest" "Latest"
	release upload "latest" "Latest"
fi

release upload "$VERSION" "$RELEASE_NAME"
