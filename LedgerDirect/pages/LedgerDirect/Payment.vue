<template>

  <div>
    <div class="ld-container" data-xrp-payment-page="true">
      <div class="ld-content">
        <div class="ld-header">
          <h2> - XRP Payment Page</h2>
        </div>

        <div class="ld-card">
          <div class="ld-card-left">
            <p v-html="$t('LedgerDirect.paymentPage.sendXrpMessage', {xrpAmount: xrpPayment.xrp_amount})" />

            <label for="destinationAccount" class="bootstrap-form-label">
              {{ $t("LedgerDirect.paymentPage.destinationAccountLabel") }}
            </label>
            <div class="bootstrap-input-group">
              <input id="destination-account"
                     type="text"
                     name="destination-account"
                     class="bootstrap-form-control"
                     :value="xrpPayment.destination_account"
                     readonly
              />
              <span class="bootstrap-input-group-text ld-hover" data-bs-toggle="tooltip" data-bs-title="Copy">
                <SfIcon
                  :icon="clipboardSvg.paths"
                  size="24px"
                  view-box="0 0 24 24"
                  @click="copy(xrpPayment.destination_account)"
                />
              </span>

              <SfIcon
                :icon="linkSvg.paths"
                class="ld-icon"
                size="24px"
                view-box="0 0 24 24"
                @click="copy(xrpPayment.destination_account)"
              />

            </div>

            <label for="destinationTag" class="bootstrap-form-label">
              {{ $t("LedgerDirect.paymentPage.destinationTagLabel") }}
            </label>
            <div class="bootstrap-input-group">

              <input id="destination-tag"
                     type="text"
                     name="destination-tag"
                     class="bootstrap-form-control"
                     :value="xrpPayment.destination_tag"
                     readonly
              />
              <span class="bootstrap-input-group-text ld-hover" data-bs-toggle="tooltip" data-bs-title="Copy">
                <SfIcon
                  :icon="clipboardSvg.paths"
                  size="24px"
                  view-box="0 0 24 24"
                  @click="copy(xrpPayment.destination_tag)"
                />
              </span>

              <SfIcon
                :icon="tagSvg.paths"
                class="ld-icon pointer"
                size="24px"
                view-box="0 0 24 24"
              />

            </div>

            <div class="ld-warning">
              <div role="alert" class="alert alert-warning alert-has-icon">
                {% sw_icon 'warning' %}
                <div class="alert-content-container">
                  <div class="alert-content">
                    {{ $t("LedgerDirect.paymentPage.destinationTagWarning") }}
                  </div>
                </div>
              </div>
            </div>

            <div class="ld-sync">
              <button id="check-payment-button" @click="checkPayment(orderNumber)">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display:none" />
                {{ $t("LedgerDirect.paymentPage.checkPaymentButton") }}
              </button>
            </div>
          </div>

          <div class="ld-card-right">
            <div class="ld-sum">{{ xrpPayment.currency_symbol }} {{ xrpPayment.price }}</div>
            <span>{{ $t("LedgerDirect.paymentPage.orderNumber") }}: {{ orderNumber }}</span><br/>
            <span>{{ $t("LedgerDirect.paymentPage.price") }}: {{ xrpPayment.price }} {{ xrpPayment.currency_code }}</span><br/>
            <span>{{ $t("LedgerDirect.paymentPage.price") }}: {{ xrpPayment.xrp_amount }} XRP</span><br/>
            <span>{{ $t("LedgerDirect.paymentPage.exchangeRate") }}: {{ xrpPayment.exchange_rate }} XRP / {{ xrpPayment.currency_code }}</span>

            <img src="../../assets/img/astronaut.png" class="ld-astronaut"  alt="Retro Lego Astronaut" />
          </div>
        </div>

        <div class="ld-footer">
          Ledger Direct Payment Plugin ({{ xrpPayment.network }})
        </div>
      </div>
    </div>

    <nuxt />
  </div>
</template>

<script lang="ts">
export default {
  layout: 'plain',
};
</script>

<script setup lang="ts">

import {
  onBeforeMount,
  onMounted,
  ref,
  useContext,
  useRouter,
} from "@nuxtjs/composition-api";

import { XrpPayment } from "~/modules/ledger-direct/types";
import { useXrpPayment } from '~/modules/ledger-direct/composables/useXrpPayment';

import clipboardSvg from '~/modules/ledger-direct/assets/svg/clipboard';
import clipboardCheckedSvg from '~/modules/ledger-direct/assets/svg/clipboard-checked';
import linkSvg from '~/modules/ledger-direct/assets/svg/link';
import homeSvg from '~/modules/ledger-direct/assets/svg/home';
import warningSvg from '~/modules/ledger-direct/assets/svg/warning';
import tagSvg from '~/modules/ledger-direct/assets/svg/tag';
import SfIcon from "@storefront-ui/vue/src/components/atoms/SfIcon/SfIcon.vue";

const { app } = useContext();
const router = useRouter();
const { checkPaymentStatus } = useXrpPayment();

const { orderNumber } = router.currentRoute.params;
const xrpPayment = ref<XrpPayment>({
  currency_code: null,
  currency_symbol: null,
  destination_account: null,
  destination_tag: null,
  exchange_rate: null,
  network: null,
  order_id: null,
  order_number: null,
  price: null,
  xrp_amount: null,
  tx_hash: null,
});

const isPolling = ref(false);
const isSettled = ref(false);

const checkPayment = (orderNumber: string) => {
  isPolling.value = true;
  checkPaymentStatus(orderNumber).then((result) => {
    if (result.tx_hash) {
      isSettled.value = true;
      redirect(orderNumber);
    }
    xrpPayment.value = result;
  }).catch((error) => {
    console.log(error);
  });
};

const copy = (text: string | number) => {
  navigator.clipboard.writeText(text.toString());
};

const redirect = async (orderNumber) => {
  const thankYouRoute = app.localeRoute({
    name: 'thank-you',
    query: {
      order: orderNumber,
    },
  });
  await router.push(thankYouRoute);
};

onBeforeMount(async () => {
  const script = document.createElement('script');
  script.src = "https://unpkg.com/@gemwallet/api@3.1.0/umd/gemwallet-api.js";
  script.async = true;
  document.head.append(script);

  //https://kazupon.github.io/vue-i18n/guide/locale.html

  // TODO: Merge this on plugin creation
  const localeCode = app.i18n.locale;
  const { file } = app.i18n.locales.find((locale) => locale.code === localeCode);
  const translations = await import('../../lang/' + file);
  app.i18n.setLocaleMessage('default', translations.default);
  console.log(translations);
});

onMounted(async () => {
  checkPayment(orderNumber);
});

</script>

<style lang="scss">
body {
  font-family: Montserrat, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  outline: 0!important;
  background-color: #e62355;
}

.ld-container {
  width: 100%;
  max-width: 50rem;
  margin-left: auto;
  margin-right: auto;
}

.ld-content {
  width: 100%;
}

.ld-header {
  margin-top: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  h2 {
    color: white;
  }
}

.ld-footer {
  margin-top: 1rem;
  text-align: center;
  color: white;
}

.ld-card {
  display: flex;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 15px 30px 0 rgb(0 0 0 / 11%), 0 5px 15px 0 rgb(0 0 0 / 8%);
}

.ld-card-left {
  width: 66.66667%;
  padding: 1.5rem;
}

.ld-card-right {
  position:relative;
  width: 33.33333%;
  padding: 1.5rem;
  color: white;
  background-color: #1daae6;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

img.ld-astronaut {
  position: absolute;
  right: 0;
  bottom: 0;
}

.bootstrap-input-group {
  position: relative;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-align: stretch;
  align-items: stretch;
  width: 100%;
  margin-bottom: 0.5rem;
}

.bootstrap-form-label {
  display: inline-block;
  margin-bottom: 0.5rem;
}

.bootstrap-form-control {
  display: block;
  padding: 0.375rem 0.75rem 0.375rem 3rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.375rem;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;

  position: relative;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  width: 1%;
  min-width: 0;

  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.bootstrap-input-group-text {
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  margin-left: -1px;
  padding: 0.5625rem 0.5625rem;
  font-size: .875rem;
  font-weight: 400;
  line-height: 1.5;
  color: #2b3136;
  text-align: center;
  white-space: nowrap;
  background-color: #eee;
  border: 1px solid #ced4da;
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;

  cursor: pointer;

  &:hover {
    background-color: whitesmoke;
  }

  span.icon {
    svg {
      top: 0;
    }
  }
}

.ld-icon {
  display: block;
  position: absolute;
  padding: 0.5625rem 0.5625rem;

  span.icon {
    svg {
      top: 0;
    }
  }
}

.ld-warning {
  margin-top: 1rem;
}

.ld-sync {
  text-align: center;

  button {
    padding: 0.5rem;
    font-weight: bold;
    color: white;
    background-color: #1daae6;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;

    &:hover {
      background-color: #59c2ef;
    }
  }
}

.ld-sum {
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
}
</style>
