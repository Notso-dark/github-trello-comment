import * as core from '@actions/core'
import axios, { AxiosError } from 'axios'

const API_ID = core.getInput('trello-api-key', { required: true })
const AUTH_TOKEN = core.getInput('trello-auth-token', { required: true })
const BOARD_ID = core.getInput('trello-board-id', { required: true })
const CARD_ID = core.getInput('trello-card-id', { required: true })
const MESSAGE = core.getInput('trello-message', { required: true })

interface TrelloParams {
    apiKey: string
    authToken: string
    boardId: string
}

class Trello {

    params: TrelloParams

    /**
     *
     * @param params {{apiKey: string, authToken: string, boardId: string}}
     */
    constructor(params: TrelloParams) {
        this.params = params
    }

    /**
     *
     * @param cardId
     * @returns {Promise<boolean|*>}
     */
    async getCardOnBoard(cardId: string) {
        if (!cardId || !this.params.boardId) {
            return false
        }
        const url = `https://trello.com/1/boards/${this.params.boardId}/cards/${cardId}`
        const response = await axios.get(url, {
            params: {
                key: this.params.apiKey,
                token: this.params.authToken,
            },
        })
        return response.data.id
    }

    /**
     *
     * @param card {string}
     * @param message {string}
     * @returns {Promise<void>}
     */
    async addCommentToCard(card: string, message: string) {
        const url = `https://api.trello.com/1/cards/${card}/actions/comments`
        const query = new URLSearchParams({
            key: this.params.apiKey,
            token: this.params.authToken,
            text: message,
        }).toString()
        await axios.post(`${url}?${query}`)
    }

    /**
     *
     * @param cardId
     * @param message
     */
    async run(cardId: string, message: string) {
        const card = await this.getCardOnBoard(cardId)
        if (!card) {
            throw `Card (${cardId}) not found`
        }
        await this.addCommentToCard(card, message)
    }
}

(async () => {
    try {
        const trello = new Trello({
            apiKey: API_ID,
            authToken: AUTH_TOKEN,
            boardId: BOARD_ID,
        })
        await trello.run(CARD_ID, MESSAGE)
    } catch (err: Error | AxiosError | string | unknown) {
        if (axios.isAxiosError(err)) {
            return core.error(`[${err.response.config.method.toUpperCase()}] ${err.response.config.url} : ${err.response.status} ${err.response.statusText} (${err.response.data ?? ''})`)
        }
        core.error(err.toString())
        console.error(err)
    }
})()