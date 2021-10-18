import { ANALYTICS_EVENTS, trackEvent } from "../utils/analytics";

const isDev = false; // process.env.NODE_ENV === "development";

const VENDOR_ID = isDev ? 1506 : 128190;
const PRODUCT_ID = (plan) => {
  if (isDev) return plan === "monthly" ? 9822 : 0;
  else return plan === "monthly" ? 648884 : 658759;
};

function loadPaddle(eventCallback) {
  return new Promise((resolve) => {
    var script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/paddle.js";
    script.async = true;
    var firstScriptElement = document.getElementsByTagName("script")[0];
    script.onload = function () {
      if (isDev) window.Paddle.Environment.set("sandbox");
      window.Paddle.Setup({
        vendor: VENDOR_ID,
        eventCallback,
      });
      resolve();
    };
    firstScriptElement.parentNode.insertBefore(script, firstScriptElement);
  });
}

async function upgrade(user, coupon, plan) {
  if (!window.Paddle) {
    await loadPaddle();
  }

  const { Paddle } = window;
  if (!Paddle) return;

  if (coupon) {
    trackEvent(ANALYTICS_EVENTS.offerClaimed, `[${coupon}] redeemed!`);
  } else {
    trackEvent(ANALYTICS_EVENTS.checkoutStarted, `Checkout requested`);
  }

  Paddle.Checkout.open({
    product: PRODUCT_ID(plan),
    email: user.email,
    coupon,
    passthrough: JSON.stringify({
      userId: user.id,
    }),
  });
}

async function openPaddleDialog(overrideUrl) {
  if (!window.Paddle) {
    await loadPaddle();
  }

  const { Paddle } = window;
  if (!Paddle) return;

  Paddle.Checkout.open({
    override: overrideUrl,
    product: PRODUCT_ID,
  });
}

const DEFAULT_DATA_MONTHLY = JSON.parse(
  `{"data":{"public_checkout_id":"112231879-chree0325aa1705-38b9ffa5ce","type":"default","vendor":{"id":128190,"name":"Streetwriters (Private) Limited"},"display_currency":"USD","charge_currency":"USD","settings":{"feature_flags":{"show_save_payment_details_UI_without_taking_payment":false,"show_save_payment_details_UI_and_take_payment":false,"marketing_consent":true,"customer_name":true,"tax_code":false,"tax_code_link":false,"coupon":true,"coupon_link":true,"quantity_enabled":false,"quantity_selection":false,"hide_compliance_bar":false},"variant":"multipage","expires":"2021-12-07 23:59:59","marketing_consent_message":"<var vendorname>Streetwriters (Private) Limited<\/var> may send me product updates and offers via email. It is possible to opt-out at any time.","language_code":"en","disable_logout":false,"styles":{"primary_colour":null,"theme":"light"},"inline_styles":null},"customer":{"id":11363557,"email":"enkaboot@gmail.com","country_code":null,"postcode":null,"remember_me":false,"audience_opt_in":false},"items":[{"checkout_product_id":116991843,"product_id":648884,"name":"Notesnook Pro (Monthly)","custom_message":"","quantity":1,"allow_quantity":false,"icon_url":"https:\/\/paddle.s3.amazonaws.com\/user\/128190\/UgQbUiBTuWY7j9PDMnvY_android-chrome-512x512.png","prices":[{"currency":"USD","unit_price":{"net":4.49,"gross":4.49,"net_discount":0.0,"gross_discount":0.0,"net_after_discount":4.49,"gross_after_discount":4.49,"tax":0.0,"tax_after_discount":0.0},"line_price":{"net":4.49,"gross":4.49,"net_discount":0.0,"gross_discount":0.0,"net_after_discount":4.49,"gross_after_discount":4.49,"tax":0.0,"tax_after_discount":0.0},"discounts":[],"tax_rate":0.0}],"recurring":{"period":"month","interval":1,"trial_days":0,"prices":[{"currency":"USD","unit_price":{"net":4.49,"gross":4.49,"net_discount":0.0,"gross_discount":0.0,"net_after_discount":4.49,"gross_after_discount":4.49,"tax":0.0,"tax_after_discount":0.0},"line_price":{"net":4.49,"gross":4.49,"net_discount":0.0,"gross_discount":0.0,"net_after_discount":4.49,"gross_after_discount":4.49,"tax":0.0,"tax_after_discount":0.0},"discounts":[],"tax_rate":0.0}]},"webhook_url":null}],"available_payment_methods":[],"total":[{"net":4.49,"gross":4.49,"net_discount":0.0,"gross_discount":0.0,"net_after_discount":4.49,"gross_after_discount":4.49,"tax":0.0,"tax_after_discount":0.0,"currency":"USD","is_free":false,"includes_tax":false,"tax_rate":0.0}],"pending_payment":false,"completed":false,"payment_method_type":null,"flagged_for_review":false,"ip_geo_country_code":"PK","tax":null,"passthrough":"{}","redirect_url":null,"tracking":{"source_page":"http:\/\/localhost:3000\/settings","test_name":null,"test_variant":null,"initial_request":{"data":{"type":"default","items":[{"product_id":648884}],"customer":{"email":"redacted"},"settings":{"passthrough":"{}"},"tracking":{"referrer":"localhost:3000 \/ localhost:3000"},"parent_url":"http:\/\/localhost:3000\/settings","geo_country":"PK"}}},"created_at":"2021-10-08 12:03:13","paddlejs":{"vendor":{"currency":"USD","prices":{"unit":4.49,"unit_tax":0.0,"total":4.49,"total_tax":0.0},"recurring_prices":{"unit":4.49,"unit_tax":0.0,"total":4.49,"total_tax":0.0}}},"payment_details":null,"environment":"production","messages":[]}}`
);
const DEFAULT_DATA_YEARLY = JSON.parse(
  `{"data":{"public_checkout_id":"112231646-chre94eb195cbde-12dcba6761","type":"default","vendor":{"id":128190,"name":"Streetwriters (Private) Limited"},"display_currency":"USD","charge_currency":"USD","settings":{"feature_flags":{"show_save_payment_details_UI_without_taking_payment":false,"show_save_payment_details_UI_and_take_payment":false,"marketing_consent":true,"customer_name":true,"tax_code":false,"tax_code_link":false,"coupon":true,"coupon_link":true,"quantity_enabled":false,"quantity_selection":false,"hide_compliance_bar":false},"variant":"multipage","expires":"2021-12-07 23:59:59","marketing_consent_message":"<var vendorname>Streetwriters (Private) Limited<\/var> may send me product updates and offers via email. It is possible to opt-out at any time.","language_code":"en","disable_logout":false,"styles":{"primary_colour":null,"theme":"light"},"inline_styles":null},"customer":{"id":11363557,"email":"enkaboot@gmail.com","country_code":"PK","postcode":null,"remember_me":false,"audience_opt_in":false},"items":[{"checkout_product_id":116991610,"product_id":658759,"name":"Notesnook Pro (Yearly)","custom_message":"","quantity":1,"allow_quantity":false,"icon_url":"https:\/\/paddle.s3.amazonaws.com\/user\/128190\/9v0fhULnQUCZzo3DMkJ8_android-chrome-512x512.png","prices":[{"currency":"USD","unit_price":{"net":49.99,"gross":49.99,"net_discount":0.0,"gross_discount":0.0,"net_after_discount":49.99,"gross_after_discount":49.99,"tax":0.0,"tax_after_discount":0.0},"line_price":{"net":49.99,"gross":49.99,"net_discount":0.0,"gross_discount":0.0,"net_after_discount":49.99,"gross_after_discount":49.99,"tax":0.0,"tax_after_discount":0.0},"discounts":[],"tax_rate":0.0}],"recurring":{"period":"year","interval":1,"trial_days":0,"prices":[{"currency":"USD","unit_price":{"net":49.99,"gross":49.99,"net_discount":0.0,"gross_discount":0.0,"net_after_discount":49.99,"gross_after_discount":49.99,"tax":0.0,"tax_after_discount":0.0},"line_price":{"net":49.99,"gross":49.99,"net_discount":0.0,"gross_discount":0.0,"net_after_discount":49.99,"gross_after_discount":49.99,"tax":0.0,"tax_after_discount":0.0},"discounts":[],"tax_rate":0.0}]},"webhook_url":null}],"available_payment_methods":[{"type":"SPREEDLY_CARD","weight":1,"options":{"api_key":"LIyzQnqLfedZ3oo6aWJFxSiqgfW","spreedly_environment_key":"LIyzQnqLfedZ3oo6aWJFxSiqgfW"},"seller_friendly_name":"card"},{"type":"PAYPAL","weight":2,"options":[],"seller_friendly_name":"paypal"}],"total":[{"net":49.99,"gross":49.99,"net_discount":0.0,"gross_discount":0.0,"net_after_discount":49.99,"gross_after_discount":49.99,"tax":0.0,"tax_after_discount":0.0,"currency":"USD","is_free":false,"includes_tax":false,"tax_rate":0.0}],"pending_payment":false,"completed":false,"payment_method_type":null,"flagged_for_review":false,"ip_geo_country_code":"PK","tax":null,"passthrough":"{}","redirect_url":null,"tracking":{"source_page":"http:\/\/localhost:3000\/settings","test_name":null,"test_variant":null,"initial_request":{"data":{"type":"default","items":[{"product_id":658759}],"customer":{"email":"redacted"},"settings":{"passthrough":"{}"},"tracking":{"referrer":"localhost:3000 \/ localhost:3000"},"parent_url":"http:\/\/localhost:3000\/settings","geo_country":"PK"}}},"created_at":"2021-10-08 12:00:58","paddlejs":{"vendor":{"currency":"USD","prices":{"unit":49.99,"unit_tax":0.0,"total":49.99,"total_tax":0.0},"recurring_prices":{"unit":49.99,"unit_tax":0.0,"total":49.99,"total_tax":0.0}}},"payment_details":null,"environment":"production","messages":[]}}`
);

async function getCouponData(coupon, plan) {
  let url =
    plan === "monthly"
      ? "https://checkout-service.paddle.com/checkout/1122-chree0325aa1705-38b9ffa5ce/coupon"
      : "https://checkout-service.paddle.com/checkout/1122-chre94eb195cbde-12dcba6761/coupon";

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json;charset=UTF-8",
      },
      body: coupon
        ? JSON.stringify({ data: { coupon_code: coupon } })
        : undefined,
      method: coupon ? "POST" : "DELETE",
    });
    const json = await response.json();
    if (response.ok) {
      return json.data;
    } else {
      throw new Error(json.errors[0].details);
    }
  } catch (e) {
    console.error("Error: ", e);
    return plan === "monthly"
      ? DEFAULT_DATA_MONTHLY.data
      : DEFAULT_DATA_YEARLY.data;
  }
}

export { upgrade, openPaddleDialog, getCouponData };