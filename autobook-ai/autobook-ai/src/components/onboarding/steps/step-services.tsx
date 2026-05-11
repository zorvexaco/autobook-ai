'use client';

interface Props {
  formData: any;
  updateForm: (data: any) => void;
}

export function StepServices({ formData, updateForm }: Props) {
  const addService = () => {
    updateForm({ services: [...formData.services, { name: '', price: '', duration: '30' }] });
  };

  const removeService = (index: number) => {
    const services = formData.services.filter((_: any, i: number) => i !== index);
    updateForm({ services: services.length ? services : [{ name: '', price: '', duration: '30' }] });
  };

  const updateService = (index: number, field: string, value: string) => {
    const services = [...formData.services];
    services[index] = { ...services[index], [field]: value };
    updateForm({ services });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Services</h2>
        <p className="mt-1 text-gray-600">List the services you offer so the AI can help customers book.</p>
      </div>

      <div className="space-y-3">
        {formData.services.map((svc: any, i: number) => (
          <div key={i} className="flex gap-3 rounded-lg border p-3">
            <div className="flex-1">
              <input
                type="text"
                value={svc.name}
                onChange={(e) => updateService(i, 'name', e.target.value)}
                className="input-field text-sm"
                placeholder="Service name"
              />
            </div>
            <div className="w-28">
              <input
                type="text"
                value={svc.price}
                onChange={(e) => updateService(i, 'price', e.target.value)}
                className="input-field text-sm"
                placeholder="$ Price"
              />
            </div>
            <div className="w-24">
              <select
                value={svc.duration}
                onChange={(e) => updateService(i, 'duration', e.target.value)}
                className="input-field text-sm"
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">1 hr</option>
                <option value="90">1.5 hr</option>
                <option value="120">2 hr</option>
              </select>
            </div>
            <button
              onClick={() => removeService(i)}
              className="text-gray-400 hover:text-red-500"
              title="Remove"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button onClick={addService} className="btn btn-secondary text-sm">
        + Add Service
      </button>
    </div>
  );
}
