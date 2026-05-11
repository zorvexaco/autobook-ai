'use client';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Props {
  formData: any;
  updateForm: (data: any) => void;
}

export function StepHours({ formData, updateForm }: Props) {
  const updateDay = (day: string, field: string, value: any) => {
    const hours = { ...formData.hours };
    hours[day] = { ...hours[day], [field]: value };
    updateForm({ hours });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Business Hours</h2>
        <p className="mt-1 text-gray-600">Set your operating hours so the AI knows when you&apos;re open.</p>
      </div>

      <div className="space-y-3">
        {DAYS.map((day) => {
          const h = formData.hours[day] || { open: '09:00', close: '17:00', isOpen: true };
          return (
            <div key={day} className="flex items-center gap-4 rounded-lg border p-3">
              <label className="flex w-28 items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={h.isOpen}
                  onChange={(e) => updateDay(day, 'isOpen', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                {day}
              </label>
              {h.isOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={h.open}
                    onChange={(e) => updateDay(day, 'open', e.target.value)}
                    className="input-field !py-1.5 text-sm"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="time"
                    value={h.close}
                    onChange={(e) => updateDay(day, 'close', e.target.value)}
                    className="input-field !py-1.5 text-sm"
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-400">Closed</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
