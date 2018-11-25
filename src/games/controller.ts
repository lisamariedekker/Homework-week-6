import { JsonController, Get, Param, Put, Body, NotFoundError, Post, HttpCode, BadRequestError } from 'routing-controllers'
import Game, { boardColor } from './entity'
import { validate } from 'class-validator'

@JsonController()
export default class GameController {

  generateRandomColor() {
    return boardColor[Math.floor(Math.random() * Math.floor(boardColor.length))]
  }

  moves = (board1, board2) =>
  board1
    .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
    .reduce((a, b) => a.concat(b))
    .length
  
  @Get('/games/:id')
  getGame(
    @Param('id') id: number
  ) {
    return Game.findOne(id)
  }

  @Get('/games')
  async allGames() {
    const games = await Game.find()
    return { games }
  }

  @Put('/games/:id')
  async updateGame(
    @Param('id') id: number,
    @Body() update: Partial<Game>
  ) {
    if (update.id) {
      throw new BadRequestError('Cannot modify id')
    }

    const game = await Game.findOne(id)
    if (!game) {
      throw new NotFoundError('Cannot find game')
    }

    if (update.board && this.moves(game.board, update.board) > 1) {
      throw new BadRequestError('Cannot make more than 1 move')
    }

    //merges game with update so that it can be validated
    const mergedGameWithUpdate = Game.merge(game, update)

    const errors = await validate(mergedGameWithUpdate);
    if (errors.length > 0) {
      throw new BadRequestError(`Oops, something went wrong!: ${errors.join()}`)
    }

    return mergedGameWithUpdate.save()
  }

  @Post('/games')
  @HttpCode(201)
  async createGame(
    @Body() game: Game
  ) {
    game.color = this.generateRandomColor();
    return game.save();
  }
}