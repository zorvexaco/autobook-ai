'use client';

interface Props {
  formData: any;
  updateForm: (data: any) => void;
}

export function StepAutomation({ formData, updateForm }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Automation Settings</h2>
        <p className="mt-1 text-gray-600">Configure automatic messages and follow-ups.</p>
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={formData.smsReminders}
            onChange={(e) => updateForm({ smsReminders: e.target.checked })}
            className="mt-0.5 h-5 w-5 rounded border-gray-300 text-brand focus:ring-brand"
          />
          <div>
            <div className="font-medium text-gray-900">SMS Appointment Reminders</div>
            <div className="text-sm text-gray-500">Automatically text customers 24 hours before their appointment.</div>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={formData.missedLeadFollowup}
            onChange={(e) => updateForm({ missedLeadFollowup: e.target.checked })}
            className="mt-0.5 h-5 w-5 rounded border-gray-300 text-brand focus:ring-brand"
          />
          <div>
            <div className="font-medium text-gray-900">Missed Lead Follow-up</div>
            <div className="text-sm text-gray-500">Send a text to callers who hung up before booking — within 5 minutes.</div>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={formData.reviewRequests}
            onChange={(e) => updateForm({ reviewRequests: e.target.checked })}
            className="mt-0.5 h-5 w-5 rounded border-gray-300 text-brand focus:ring-brand"
          />
          <div>
            <div className="font-medium text-gray-900">Review Requests</div>
            <div className="text-sm text-gray-500">Automatically request reviews after completed appointments.</div>
          </div>
        </label>
      </div>

      <div className="rounded-lg bg-green-50 p-4">
        <h3 className="text-sm font-semibold text-green-800">You&apos;re all set!</h3>
        <p className="mt-1 text-sm text-green-700">Click &quot;Complete Setup&quot; below to save your configuration and start using your AI receptionist.</p>
      </div>
    </div>
  );
}
