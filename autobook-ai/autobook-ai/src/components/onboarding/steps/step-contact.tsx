'use client';

interface Props {
  formData: any;
  updateForm: (data: any) => void;
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

export function StepContact({ formData, updateForm }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
        <p className="mt-1 text-gray-600">How customers can reach your business.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateForm({ phone: e.target.value })}
            className="input-field mt-1"
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateForm({ email: e.target.value })}
            className="input-field mt-1"
            placeholder="hello@yourbiz.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => updateForm({ website: e.target.value })}
            className="input-field mt-1"
            placeholder="https://yourbiz.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => updateForm({ city: e.target.value })}
            className="input-field mt-1"
            placeholder="e.g., Austin"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <select
            value={formData.state}
            onChange={(e) => updateForm({ state: e.target.value })}
            className="input-field mt-1"
          >
            <option value="">Select state...</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
