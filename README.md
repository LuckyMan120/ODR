# nkb

# Run

## Prerequisites

Docker must be installed

## Run with Docker Compose

```bash
docker-compose up
```

> API Crashes: Sometimes API service lifts before DB or Redis which will cause it to crash, in this case waiting for DB and Redis to finish startup and restarting just the API service should fix the issue.

> Running locally: docker-compose uses local folder and mounts them inside services. The node_modules for projects are installed from the service container and some modules might require OS specific installation(i.e. bcrypt). In case of using Ubuntu as a host - this is not a problem because the node_modules installed will still work when attempting to run without docker. In case of host OS being different to containers OS (windows, mac os) running locally after launching once with Docker might not work. In that case reinstalling node_modules via `rm -rf node_modules & npm i` will fix the issue. If going other way, trying to run docker after using running locally, you have to just remove the `node_modules`.

# Git Hooks

## Why

Projects are using linter to maintain consistent code style and avoid some common JS pitfalls.
Linter will run during development mode but in rare cases changes might be applied without running dev mode and end up with unlinted code.
To avoid accidentally pushing unlinted code to the remote this repository provides the pre-push githook in .githooks folder.
When using this githook git will run linter before every push and abort the push if linter finds errors.
This should let you do the development in your preferred way but remind you of running linter in case you forgot.

Git hooks include git-secret automation as well, hiding all secretes pre-commit, revealing all secrets post-merge.

## Prerequisites

* Node.js 14.15.3 or above
* npm 6.14.11 or above
* git 2.25.1 or above

## Set your local git to use hook in git repo

```bash
git config core.hooksPath .githooks
```

From now on every `git push` will first run the linter for both API and Client.

> Linter will autofix some issues. In that case it's possible that you where able to push successfully but end up with some unstaged changes still. But hopefully at that point you're where reminded of linting and can add and commit all auto fixed changes.

# Git Secret

## Why

Some third party services require secret values. We can't store these openly in the repo and passing them around un-encrypted is just as bad. Using [git-secret](https://git-secret.io/) will let us store secrets encrypted in the repo and pass them around via git.

## Prerequisites

* git 2.25.1 or above
* git secret 0.3.2 or above
* gpg 2.2.19 or above

## Get access

1. [Create gpg RSA key-pair](https://git-secret.io/#using-gpg) if you don't yet have any. If  you do skip to step 2
2. Get your public key with `gpg -a --export your_email@email.com > public_key`
3. Ask another team member with access to give you access and send them your public key
4. Access is granted via running `gpg --import public_key` and then `git secret tell your_email@email.com`
5. Access granter commits changes
6. Access recipient can now run `git secret reveal`
7. Secrets will be automatically used by docker-compose if present during `up` command

> Using git hooks explained in the section above will automate secret work based on git actions. Hiding and adding secret files to commits, and revealing new secrets after merges.

# Deployment

Quick deployment note:

* Got to [Actions](https://github.com/GR-ODR/grv3/actions)
* Click `build-and-deploy-to-{{ENV}} on the left
* Click "Run workflow" on the right
* Select branch to deploy
* Click "Run"
* The new workflow run will be added to the list
* You can click the workflow to get more information
* Wait for the run to end ~5-7min
* Wait for Azure side to do it's thing, ~3-4 minutes
* Checking api or client `/version` endpoint will tell you currently deployed version, it'll change once the version is up
