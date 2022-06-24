# github-trello-comment
GitHub Action used to write a comment in a Trello card

This action has been inspired from [dalezak/github-commit-to-trello-card](https://github.com/marketplace/actions/github-commit-to-trello-card)

#### Action Marketplace
[https://github.com/marketplace/actions/github-trello-message](https://github.com/marketplace/actions/github-trello-message)

#### Action Variables
- **trello-api-key** - Trello API key, visit https://trello.com/app-key for key
- **trello-auth-token** - Trello auth token, visit https://trello.com/app-key then click generate a token
- **trello-board-id** - Trello board ID, visit a board then append .json to url to find id
- **trello-card-id** - Trello card id (ex: https://trello.com/c/xxxxx/66-my-card, id = 66)
- **trello-message** - Message

#### GitHub Action
```
on: ...

jobs:
  my-job:
    ...
    steps:
      ...

      - uses: Notso-dark/github-trello-comment@main
        with:
          trello-api-key: ${{ secrets.TRELLO_API_KEY }}
          trello-auth-token: ${{ secrets.TRELLO_API_TOKEN }}
          trello-board-id: ${{ secrets.TRELLO_BOARD_ID }}
          trello-card-id: cardId
          trello-message: "my message"
```          
### How we get the trello card id

Each git branches are prefixed by the trello card id on the board (ex: origin/12-my-feature)

So we extract the card id from the branch

```
on: ...

jobs:
  my-job:
    ...
    steps:
      ...
      - name: Get branch name
        id: branch-name
        uses: tj-actions/branch-names@v5.2

      - name: get trello card id
        id: trello
        run: |
          ID=$(echo $BRANCH | sed "s/^\([0-9]\{1,\}\).*/\1/")
          echo "::set-output name=id::$ID"
        env:
          BRANCH: ${{ steps.branch-name.outputs.current_branch }}
          
      - uses: Notso-dark/github-trello-comment@main
        with:
          trello-api-key: ${{ secrets.TRELLO_API_KEY }}
          trello-auth-token: ${{ secrets.TRELLO_API_TOKEN }}
          trello-board-id: ${{ secrets.TRELLO_BOARD_ID }}
          trello-card-id: ${{ steps.trello.outputs.id }}
          trello-message: "my message"
```

#### Local Build
```
npm run build
```

#### Release Build
```
git tag -a "v1" -m "v1"
git push origin --tags
```