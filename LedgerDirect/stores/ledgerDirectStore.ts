import { defineStore } from 'pinia';
import type { Customer } from '~/modules/GraphQL/types';

interface PaymentMethodState {
  paymentMethodName: string | null
}

export const useLedgerDirectStore = defineStore('ledgerDirect', {
  state: (): PaymentMethodState => ({
    paymentMethodName: null
  }),
  actions: {
    setPaymentMethodName(paymentMethodName: string) {
      this.paymentMethodName = paymentMethodName;
    },
  },
});
