import { UseXrpPaymentInterface, UseXrpPaymentErrors } from "~/modules/ledger-direct/composables/useXrpPayment";
import { ref, Ref, useContext } from "@nuxtjs/composition-api";
import { XrpPayment } from "~/modules/ledger-direct/types";

export function useXrpPayment(): UseXrpPaymentInterface {

  const error: Ref<UseXrpPaymentErrors> = ref({
    checkPaymentStatus: null
  });

  const loading: Ref<boolean> = ref(false);
  const {app} = useContext();

  const checkPaymentStatus = async (orderNumber: string): Promise<XrpPayment> => {
    return await app.context.$vsf.$magento.api.xrpPayment({orderNumber})
  }

  return {
    error,
    loading,
    checkPaymentStatus
  }
}

export * from './useXrpPayment';
export default useXrpPayment;
