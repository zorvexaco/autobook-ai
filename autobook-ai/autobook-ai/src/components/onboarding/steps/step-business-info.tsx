'use client';

import { BUSINESS_TYPES } from '@/lib/constants/business-types';

interface Props {
  formData: any;
  updateForm: (data: any) => void;
}

export function StepBusinessInfo({ formData, updateForm }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tell us about your business</h2>
        <p className="mt-1 text-gray-600">This information helps your AI receptionist represent your business accurately.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Business Name *</label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => updateForm({ businessName: e.target.value })}
            className="input-field mt-1"
            placeholder="e.g., Glow Beauty Lounge"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Owner Name *</label>
          <input
            type="text"
            value={formData.ownerName}
            onChange={(e) => updateForm({ ownerName: e.target.value })}
            className="input-field mt-1"
            placeholder="Your full name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Type *</label>
          <select
            value={formData.businessType}
            onChange={(e) => updateForm({ businessType: e.target.value })}
            className="input-field mt-1"
            required
          >
            <option value="">Select a type...</option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
