'use client';

interface Props {
  formData: any;
  updateForm: (data: any) => void;
}

export function StepBookingRules({ formData, updateForm }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Booking Rules</h2>
        <p className="mt-1 text-gray-600">Set rules and policies for appointment scheduling.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Booking Rules & Preferences</label>
          <textarea
            value={formData.bookingRules}
            onChange={(e) => updateForm({ bookingRules: e.target.value })}
            className="input-field mt-1"
            rows={4}
            placeholder="e.g., Appointments must be booked at least 24 hours in advance. No double-booking. Walk-ins accepted on weekdays only."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cancellation Policy</label>
          <textarea
            value={formData.cancellationPolicy}
            onChange={(e) => updateForm({ cancellationPolicy: e.target.value })}
            className="input-field mt-1"
            rows={3}
            placeholder="e.g., Cancellations must be made 24 hours in advance. Late cancellations may be charged a 50% fee."
          />
        </div>
      </div>
    </div>
  );
}
