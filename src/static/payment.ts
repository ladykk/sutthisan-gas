// Payment Type
export const PAYMENT_TYPE_ID_ARRAY = [
  "CASH",
  "CREDIT_CARD",
  "TRANSFER",
] as const;

export const PAYMENT_TYPE_LIST: Record<TPaymentTypeId, TPaymentType> = {
  CASH: {
    id: "CASH",
    label: "Cash",
  },
  CREDIT_CARD: {
    id: "CREDIT_CARD",
    label: "Credit Card",
  },
  TRANSFER: {
    id: "TRANSFER",
    label: "Transfer",
  },
};

export const PaymentTypes = PAYMENT_TYPE_ID_ARRAY.reduce((acc, id) => {
  acc[id] = id;
  return acc;
}, {} as Record<TPaymentTypeId, TPaymentTypeId>);

export const PAYMENT_TYPE_ARRAY = Object.values(PAYMENT_TYPE_LIST);

export type TPaymentTypeId = (typeof PAYMENT_TYPE_ID_ARRAY)[number];
export type TPaymentType = {
  id: TPaymentTypeId;
  label: string;
};

// Payment Status
export const PAYMENT_STATUS_ID_ARRAY = [
  "PENDING",
  "PAID",
  "OVERDUE",
  "REFUNDED",
] as const;

export const PAYMENT_STATUS_LIST: Record<TPaymentStatusId, TPaymentStatus> = {
  PENDING: {
    id: "PENDING",
    label: "Pending",
    colorCode: "#e11d48",
  },
  PAID: {
    id: "PAID",
    label: "Paid",
    colorCode: "#16a34a",
  },
  OVERDUE: {
    id: "OVERDUE",
    label: "Overdue",
    colorCode: "#ea580c",
  },
  REFUNDED: {
    id: "REFUNDED",
    label: "Refunded",
    colorCode: "#2563eb",
  },
};

export const PaymentStatuses = PAYMENT_STATUS_ID_ARRAY.reduce((acc, id) => {
  acc[id] = id;
  return acc;
}, {} as Record<TPaymentStatusId, TPaymentStatusId>);

export const PAYMENT_STATUS_ARRAY = Object.values(PAYMENT_STATUS_LIST);

export type TPaymentStatusId = (typeof PAYMENT_STATUS_ID_ARRAY)[number];
export type TPaymentStatus = {
  id: TPaymentStatusId;
  label: string;
  colorCode: string;
};
