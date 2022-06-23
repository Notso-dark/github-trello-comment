import axios from 'axios'
import * as core from '@actions/core'

class Trello {
    constructor(params) {
        this.params = params
    }

    async getCardOnBoard() {
        if (!this.params.cardId || !this.params.boardId) {
            return false
        }

        const url = `https://trello.com/1/boards/${this.params.boardId}/cards/${this.params.cardId}`
        try {
            const response = await axios.get(url, {
                params: {
                    key: this.params.apiKey,
                    token: this.params.authToken,
                },
            })
            return response.data.id
        } catch (err) {
            if (err.response) {
                throw `getCardOnBoard error: ${err.response.status} ${err.response.statusText}`
            }
            throw `getCardOnBoard error: ${err}`
        }
    }

    async addCommentToCard(card) {
        const url = `https://api.trello.com/1/cards/${card}/actions/comments`
        try {
            core.info(card)
            core.info(JSON.stringify(this.params))
            return await axios.post(url, null, {
                params: {
                    key: this.params.apiKey,
                    token: this.params.authToken,
                    text: this.params.message,
                },
            })
        } catch (err) {
            if (err.response) {
                throw `addCommentToCard error: ${err.response.status} ${err.response.statusText}`
            }
            throw `addCommentToCard error: ${err}`
        }
    }

    async run() {
        try {
            const card = await this.getCardOnBoard()
            if (!card) {
                throw `Card not found`
            }
            await this.addCommentToCard(card)
        } catch (err) {
            throw err
        }
    }
}

(async () => {
    try {
        const trello = new Trello({
            apiKey: core.getInput('trello-api-key', { required: true }),
            authToken: core.getInput('trello-auth-token', { required: true }),
            boardId: core.getInput('trello-board-id', { required: true }),
            cardId: core.getInput('trello-card-id', { required: true }),
            message: core.getInput('trello-message', { required: true }),
        })
        await trello.run()
    } catch (err) {
        core.error(err)
    }
})()
