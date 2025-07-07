export type Address = {
  name: string;
  phone: string;

  line1: string;
  line2?: string;
  city: string;
  province?: string;
  provinceCode?: string;
  country: string;
  countryCode: string;
  zipCode: string;
};

export interface CustomerCreateParams {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  address?: Address;

  image?: string;
  password?: string;
  metadata?: Record<string, any>;

  tags?: string[];
  notes?: string;

  isSubscribedEmail?: boolean;
  isSubscribedSMS?: boolean;
}

export interface CustomerUpdateParams
  extends Omit<CustomerCreateParams, "email"> {
  email?: string;
}

export interface Customer extends CustomerCreateParams {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSubscription {
  cancelAtPeriodEnd: boolean;
}

export type CustomerSubscriptionUpdateParams = Partial<
  Pick<CustomerSubscription, "cancelAtPeriodEnd">
>;
