import { HttpException, HttpStatus } from '@nestjs/common'
import { INCORRECT_PAGE_COUNT_QUERIES } from '../constants/errors.constants'

export default function checkPageCount(page?: number, count?: number) {
  const isCorrect = (page === undefined) === (count === undefined)
  if (!isCorrect) {
    throw new HttpException(INCORRECT_PAGE_COUNT_QUERIES, HttpStatus.BAD_REQUEST)
  }

  return {
    page: page as number,
    count: count as number,
  }
}
