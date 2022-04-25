import faker from 'faker'
import { Response, Request } from 'express'
import { ITransactionData } from '../src/api/types'

const transactionList: ITransactionData[] = []

export const getTransactions = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
      total: transactionList.length,
      items: transactionList
    }
  })
}
