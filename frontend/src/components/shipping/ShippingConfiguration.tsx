import React, { useState } from "react";
import { Input, Switch, Label } from "../ui";
import { Truck, MapPin, Clock, DollarSign, CreditCard } from "lucide-react";

interface ShippingConfigurationProps {
  shipping: {
    // Zone-based rates
    sameCityRate: number;
    sameRegionRate: number;
    sameCountryRate: number;
    othersRate: number;
    freeShippingThreshold: number;

    // Processing days
    sameCityDays: string;
    sameRegionDays: string;
    sameCountryDays: string;
    othersDays: string;

    // Delivery areas
    deliverLocally: boolean;
    deliverNationally: boolean;
    deliverInternationally: boolean;

    // Cash on delivery
    allowCashOnDelivery: boolean;
    codConditions: string;

    // Processing time
    processingTime: string;
  };
  onShippingChange: (shipping: any) => void;
  errors?: Record<string, string>;
}

const ShippingConfiguration: React.FC<ShippingConfigurationProps> = ({
  shipping,
  onShippingChange,
  errors = {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateShipping = (field: string, value: any) => {
    onShippingChange({ ...shipping, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Shipping Configuration
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set up delivery zones, rates, and processing times
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Expanded Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-6 pt-4">
          {/* Zone-based Rates */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h4 className="text-md font-medium text-gray-900 dark:text-white">
                Delivery Rates (XAF)
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Same City Rate"
                type="number"
                value={shipping.sameCityRate}
                onChangeHandler={(e) =>
                  updateShipping("sameCityRate", parseInt(e.target.value) || 0)
                }
                placeholder="1000"
                min="0"
                step="100"
                error={errors.sameCityRate}
              />
              <Input
                label="Same Region Rate"
                type="number"
                value={shipping.sameRegionRate}
                onChangeHandler={(e) =>
                  updateShipping(
                    "sameRegionRate",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="2000"
                min="0"
                step="100"
                error={errors.sameRegionRate}
              />
              <Input
                label="Same Country Rate"
                type="number"
                value={shipping.sameCountryRate}
                onChangeHandler={(e) =>
                  updateShipping(
                    "sameCountryRate",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="5000"
                min="0"
                step="100"
                error={errors.sameCountryRate}
              />
              <Input
                label="International Rate"
                type="number"
                value={shipping.othersRate}
                onChangeHandler={(e) =>
                  updateShipping("othersRate", parseInt(e.target.value) || 0)
                }
                placeholder="15000"
                min="0"
                step="100"
                error={errors.othersRate}
              />
            </div>
            <div className="mt-4">
              <Input
                label="Free Shipping Threshold (XAF)"
                type="number"
                value={shipping.freeShippingThreshold}
                onChangeHandler={(e) =>
                  updateShipping(
                    "freeShippingThreshold",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="50000"
                min="0"
                step="1000"
                error={errors.freeShippingThreshold}
              />
            </div>
          </div>

          {/* Processing Days */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h4 className="text-md font-medium text-gray-900 dark:text-white">
                Processing & Delivery Times
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Same City (hours)"
                value={shipping.sameCityDays}
                onChangeHandler={(e) =>
                  updateShipping("sameCityDays", e.target.value)
                }
                placeholder="1-2"
                error={errors.sameCityDays}
              />
              <Input
                label="Same Region (hours)"
                value={shipping.sameRegionDays}
                onChangeHandler={(e) =>
                  updateShipping("sameRegionDays", e.target.value)
                }
                placeholder="2-3"
                error={errors.sameRegionDays}
              />
              <Input
                label="Same Country (hours)"
                value={shipping.sameCountryDays}
                onChangeHandler={(e) =>
                  updateShipping("sameCountryDays", e.target.value)
                }
                placeholder="3-5"
                error={errors.sameCountryDays}
              />
              <Input
                label="International (hours)"
                value={shipping.othersDays}
                onChangeHandler={(e) =>
                  updateShipping("othersDays", e.target.value)
                }
                placeholder="5-10"
                error={errors.othersDays}
              />
            </div>
            <div className="mt-4">
              <Input
                label="Processing Time"
                value={shipping.processingTime}
                onChangeHandler={(e) =>
                  updateShipping("processingTime", e.target.value)
                }
                placeholder="1-2 business days"
                error={errors.processingTime}
              />
            </div>
          </div>

          {/* Delivery Areas */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 className="text-md font-medium text-gray-900 dark:text-white">
                Delivery Areas
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <Label
                  htmlFor="deliverLocally"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Deliver Locally (Same City)
                </Label>
                <Switch
                  id="deliverLocally"
                  checked={shipping.deliverLocally}
                  onCheckedChange={(checked) =>
                    updateShipping("deliverLocally", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <Label
                  htmlFor="deliverNationally"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Deliver Nationally (Same Country)
                </Label>
                <Switch
                  id="deliverNationally"
                  checked={shipping.deliverNationally}
                  onCheckedChange={(checked) =>
                    updateShipping("deliverNationally", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <Label
                  htmlFor="deliverInternationally"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Deliver Internationally
                </Label>
                <Switch
                  id="deliverInternationally"
                  checked={shipping.deliverInternationally}
                  onCheckedChange={(checked) =>
                    updateShipping("deliverInternationally", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Cash on Delivery */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h4 className="text-md font-medium text-gray-900 dark:text-white">
                Cash on Delivery
              </h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <Label
                  htmlFor="allowCashOnDelivery"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Allow Cash on Delivery
                </Label>
                <Switch
                  id="allowCashOnDelivery"
                  checked={shipping.allowCashOnDelivery}
                  onCheckedChange={(checked) =>
                    updateShipping("allowCashOnDelivery", checked)
                  }
                />
              </div>
              {shipping.allowCashOnDelivery && (
                <div>
                  <Label
                    htmlFor="codConditions"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    COD Conditions (Optional)
                  </Label>
                  <textarea
                    id="codConditions"
                    value={shipping.codConditions}
                    onChange={(e) =>
                      updateShipping("codConditions", e.target.value)
                    }
                    placeholder="e.g., Maximum order value: 50,000 XAF, Available only for local delivery"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingConfiguration;
