'use client';

import { TONES } from '@/lib/constants/tone-presets';

interface Props {
  formData: any;
  updateForm: (data: any) => void;
}

export function StepAiSettings({ formData, updateForm }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">AI Receptionist Settings</h2>
        <p className="mt-1 text-gray-600">Customize how your AI receptionist sounds and behaves.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">AI Name</label>
          <input
            type="text"
            value={formData.aiName}
            onChange={(e) => updateForm({ aiName: e.target.value })}
            className="input-field mt-1"
            placeholder="e.g., Alex, Sam, Jordan"
          />
          <p className="mt-1 text-xs text-gray-500">This is how the AI will introduce itself on calls.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">AI Tone</label>
          <div className="grid gap-3 sm:grid-cols-2">
            {TONES.map((tone) => (
              <label
                key={tone.value}
                className={`cursor-pointer rounded-lg border-2 p-4 transition ${
                  formData.aiTone === tone.value
                    ? 'border-brand bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="aiTone"
                  value={tone.value}
                  checked={formData.aiTone === tone.value}
                  onChange={(e) => updateForm({ aiTone: e.target.value })}
                  className="sr-only"
                />
                <div className="text-sm font-semibold text-gray-900">{tone.label}</div>
                <div className="mt-1 text-xs text-gray-500">{tone.description}</div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
