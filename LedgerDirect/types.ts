//interface BaseXrpl

export interface XrpPayment {
  currency_code: string
  currency_symbol: string
  destination_account: string
  destination_tag: number
  exchange_rate: number
  network: string
  order_id: number
  order_number: string
  price: number
  xrp_amount: number
  tx_hash: string
}
