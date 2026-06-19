import { useState } from 'react';

const DURATION_OPTIONS = [
  { value: 'always', label: 'Always Available' },
  { value: '1w', label: '1 Week' },
  { value: '2w', label: '2 Weeks' },
  { value: '3w', label: '3 Weeks' },
  { value: '1m', label: '1 Month' },
  { value: 'custom', label: 'Custom Duration' }
] as const;

export function PublishOptionsCard() {
  const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now');
  const [duration, setDuration] = useState('custom');

  return (
    <div className="publish-card">
      <div className="segmented small">
        <button type="button" className={publishMode === 'now' ? 'active' : ''} onClick={() => setPublishMode('now')}>
          Publish Now
        </button>
        <button type="button" className={publishMode === 'schedule' ? 'active' : ''} onClick={() => setPublishMode('schedule')}>
          Schedule Publish
        </button>
      </div>

      {publishMode === 'schedule' ? (
        <div className="form-grid two-col">
          <label className="field">
            <span>Select Date and Time</span>
            <input className="input" type="date" />
          </label>
          <label className="field">
            <span>&nbsp;</span>
            <input className="input" type="time" />
          </label>
        </div>
      ) : null}

      <h2>Live Until</h2>
      <p className="muted">Choose how long this test should remain available on the platform.</p>

      <div className="duration-grid">
        {DURATION_OPTIONS.map((option) => (
          <label key={option.value}>
            <input type="radio" checked={duration === option.value} onChange={() => setDuration(option.value)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>

      {duration === 'custom' ? (
        <div className="form-grid two-col">
          <label className="field">
            <span>End Date</span>
            <input className="input" type="date" />
          </label>
          <label className="field">
            <span>End Time</span>
            <input className="input" type="time" />
          </label>
        </div>
      ) : null}
    </div>
  );
}
