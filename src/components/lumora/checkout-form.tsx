"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/toaster";

import { formatCurrency } from "@/lib/format";
import { createCheckoutSessionAction } from "@/lib/shop/actions/checkout";
import type { AddressInput } from "@/lib/validation/shop/checkout";

export interface CheckoutShippingMethod {
  id: string;
  name: string;
  description: string | null;
  rateCents: number;
  estimatedDays: string;
}

const EMPTY_ADDRESS: AddressInput = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
  phone: "",
};

export function CheckoutForm({
  shippingMethods,
  defaultEmail,
  defaultAddress,
  isAuthenticated,
}: {
  shippingMethods: CheckoutShippingMethod[];
  defaultEmail: string;
  defaultAddress?: AddressInput;
  isAuthenticated: boolean;
}) {
  const [email, setEmail] = React.useState(defaultEmail);
  const [address, setAddress] = React.useState<AddressInput>(
    defaultAddress ?? EMPTY_ADDRESS,
  );
  const [shippingMethodId, setShippingMethodId] = React.useState(
    shippingMethods[0]?.id ?? "",
  );
  const [couponCode, setCouponCode] = React.useState("");
  const [saveAddress, setSaveAddress] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<
    Record<string, string[]>
  >({});
  const [isPending, startTransition] = React.useTransition();

  function updateAddress<K extends keyof AddressInput>(
    key: K,
    value: AddressInput[K],
  ) {
    setAddress((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFieldErrors({});
    startTransition(async () => {
      const result = await createCheckoutSessionAction({
        email,
        shippingAddress: address,
        billingSameAsShipping: true,
        shippingMethodId,
        couponCode: couponCode || undefined,
        saveAddress,
      });

      if (result.success && result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      toast.error(result.message);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      <section className="grid gap-4">
        <h2 className="font-display text-heading-03">Contact</h2>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-body-sm text-danger">
              {fieldErrors.email[0]}
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-display text-heading-03">Shipping Address</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              required
              value={address.fullName}
              onChange={(e) => updateAddress("fullName", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="line1">Address</Label>
            <Input
              id="line1"
              required
              value={address.line1}
              onChange={(e) => updateAddress("line1", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
            <Input
              id="line2"
              value={address.line2}
              onChange={(e) => updateAddress("line2", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              required
              value={address.city}
              onChange={(e) => updateAddress("city", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="state">State / Province</Label>
            <Input
              id="state"
              value={address.state}
              onChange={(e) => updateAddress("state", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="postalCode">Postal code</Label>
            <Input
              id="postalCode"
              required
              value={address.postalCode}
              onChange={(e) => updateAddress("postalCode", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="country">Country (2-letter code)</Label>
            <Input
              id="country"
              required
              maxLength={2}
              value={address.country}
              onChange={(e) =>
                updateAddress("country", e.target.value.toUpperCase())
              }
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              value={address.phone}
              onChange={(e) => updateAddress("phone", e.target.value)}
            />
          </div>
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="save-address"
              checked={saveAddress}
              onCheckedChange={(checked) => setSaveAddress(checked === true)}
            />
            <Label htmlFor="save-address" className="text-body-sm">
              Save this address to my account
            </Label>
          </div>
        )}
      </section>

      <section className="grid gap-4">
        <h2 className="font-display text-heading-03">Shipping Method</h2>
        <RadioGroup
          value={shippingMethodId}
          onValueChange={setShippingMethodId}
        >
          {shippingMethods.map((method) => (
            <label
              key={method.id}
              htmlFor={`shipping-${method.id}`}
              className="flex cursor-pointer items-center justify-between rounded-sm border border-hairline-subtle p-4"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value={method.id}
                  id={`shipping-${method.id}`}
                />
                <div>
                  <p className="text-body-md font-medium">{method.name}</p>
                  <p className="text-body-sm text-content-muted">
                    {method.estimatedDays}
                  </p>
                </div>
              </div>
              <p className="text-body-sm font-medium">
                {formatCurrency(method.rateCents)}
              </p>
            </label>
          ))}
        </RadioGroup>
        {fieldErrors.shippingMethodId && (
          <p className="text-body-sm text-danger">
            {fieldErrors.shippingMethodId[0]}
          </p>
        )}
      </section>

      <section className="grid gap-2">
        <Label htmlFor="couponCode">Coupon code (optional)</Label>
        <Input
          id="couponCode"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="WELCOME10"
        />
      </section>

      <Button type="submit" size="lg" isLoading={isPending}>
        Continue to Payment
      </Button>
    </form>
  );
}
