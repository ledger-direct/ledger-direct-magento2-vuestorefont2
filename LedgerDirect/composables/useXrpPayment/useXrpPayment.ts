import type { Ref } from '@nuxtjs/composition-api';
import type { XrpPayment } from '~/modules/ledger-direct/types';

/**
 * Errors that occurred in the {@link useXrpPayment|useXrpPayment()} composable
 */
export interface UseXrpPaymentErrors {
  /**
   * Contains error if `paymentStatus` method failed, otherwise is `null`
   */
  checkPaymentStatus: Error | null;
}

/**
 * Data and methods returned from the {@link useXrpPayment|useXrpPayment()} composable
 */
export interface UseXrpPaymentInterface {
  /**
   * Contains errors from the composable methods
   */
  error: Ref<UseXrpPaymentErrors>;

  /**
   * Indicates whether any of the methods is in progress
   */
  loading: Ref<boolean>;

  /**
   * Get payment information for given order
   */
  checkPaymentStatus(orderId: string): Promise<XrpPayment>;
}
