import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeSkills, predictCareers, uploadResume } from '../services/api.js';
import { roles } from '../data/roles.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const MAX_BYTES = 5 * 1024 * 1024;
const emptyProfile = { name: '', education: '', experience: 'Fresher', skills: '', targetRole: roles[0] || '' };

export default function ResumeUpload({ onResults }) {
  const inputRef = useRef(null);
  const [mode, setMode] = useState('pdf');
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [profile, setProfile] = useState(emptyProfile);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function chooseFile(next) {
    setError('');
    if (!next) { setFile(null); return; }
    if (!next.name.toLowerCase().endsWith('.pdf') || (next.type && next.type !== 'application/pdf')) {
      setFile(null); setError('Please select a PDF file.'); return;
    }
    if (next.size > MAX_BYTES) { setFile(null); setError('PDF must be 5 MB or smaller.'); return; }
    if (next.size === 0) { setFile(null); setError('The selected file is empty.'); return; }
    setFile(next);
  }

  async function submitPdf(e) {
    e.preventDefault();
    if (!file) { setError('Choose a PDF resume before continuing.'); return; }
    setLoading(true); setError('');
    try {
      const result = await uploadResume(file, targetRole);
      onResults({ ...result, source: 'pdf' });
      navigate('/results');
    } catch (err) {
      setError(err.message || 'Upload failed. Check that the backend is running.');
    } finally { setLoading(false); }
  }

  async function submitProfile(e) {
    e.preventDefault();
    const skills = profile.skills.split(',').map(s => s.trim()).filter(Boolean);
    if (!profile.name.trim() || !profile.education.trim() || !profile.skills.trim()) {
      setError('Please fill in your name, education, and skills.'); return;
    }
    if (!skills.length) { setError('Enter at least one skill.'); return; }
    setLoading(true); setError('');
    try {
      const careerData = await predictCareers(skills);
      let skillGap = null;
      if (profile.targetRole) skillGap = await analyzeSkills(skills, profile.targetRole);
      // Manual profile mode deliberately does not invent a resume score or AI-extracted details.
      onResults({
        source: 'manual',
        analysis: {
          name: profile.name.trim(),
          summary: 'Profile details entered manually by the user.',
          education: [profile.education.trim()],
          experience: [profile.experience],
          projects: [], certifications: [], technicalSkills: skills, softSkills: [], notes: []
        },
        careerPredictions: careerData.predictions || [],
        geminiRecommendations: [],
        score: null,
        skillGap
      });
      navigate('/results');
    } catch (err) {
      setError(err.message || 'Could not generate recommendations. Check the backend connection.');
    } finally { setLoading(false); }
  }

  function updateProfile(key, value) { setProfile(prev => ({ ...prev, [key]: value })); }

  if (loading) return <LoadingState title="Working on your profile" message="Analyzing the information you provided. This may take a moment." />;

  return <section className="page-wrap narrow-page">
    <div className="page-heading text-center">
      <span className="eyebrow-chip">RESUME ANALYSIS</span>
      <h1>Build your career profile</h1>
      <p className="muted">Upload a PDF for full analysis, or fill in the form to get career and skill-gap recommendations.</p>
    </div>

    <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap" role="tablist" aria-label="Choose profile input method">
      <button type="button" className={`btn ${mode === 'pdf' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => { setMode('pdf'); setError(''); }}>Upload PDF resume</button>
      <button type="button" className={`btn ${mode === 'form' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => { setMode('form'); setError(''); }}>Fill form manually</button>
    </div>

    {mode === 'pdf' ? <form className="panel upload-panel" onSubmit={submitPdf}>
      <div className={`dropzone ${file ? 'has-file' : ''}`} role="button" tabIndex="0" onClick={() => inputRef.current?.click()} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); chooseFile(e.dataTransfer.files?.[0]); }}>
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="visually-hidden" aria-label="Choose PDF resume" onChange={e => chooseFile(e.target.files?.[0])} />
        <span className="upload-icon"><i className={`bi ${file ? 'bi-file-earmark-check' : 'bi-cloud-arrow-up'}`} /></span>
        <h2>{file ? file.name : 'Drag and drop your resume here'}</h2>
        <p className="muted">PDF only · Maximum size 5 MB</p>
        <button type="button" className="btn btn-outline-primary" onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}>Browse files</button>
      </div>
      <div className="mt-4">
        <label className="form-label" htmlFor="targetRole">Optional target role</label>
        <select id="targetRole" className="form-select" value={targetRole} onChange={e => setTargetRole(e.target.value)}><option value="">Recommend careers automatically</option>{roles.map(role => <option key={role}>{role}</option>)}</select>
        <div className="form-text">If selected, the response also includes a skill-gap analysis for this role.</div>
      </div>
      <ErrorMessage message={error} />
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mt-4"><small className="muted"><i className="bi bi-lock me-1" />Not saved by this app after analysis.</small><button className="btn btn-primary btn-lg" type="submit" disabled={!file}>Analyze resume <i className="bi bi-arrow-right ms-2" /></button></div>
    </form> : <form className="panel" onSubmit={submitProfile}>
      <div className="section-heading compact"><span className="eyebrow">MANUAL PROFILE</span><h2>Enter your details</h2><p className="muted">Required fields are marked with an asterisk. Skills should be comma-separated.</p></div>
      <div className="mb-3"><label className="form-label" htmlFor="profileName">Full name *</label><input id="profileName" className="form-control" value={profile.name} onChange={e => updateProfile('name', e.target.value)} placeholder="Enter your full name" required /></div>
      <div className="mb-3"><label className="form-label" htmlFor="profileEducation">Education *</label><input id="profileEducation" className="form-control" value={profile.education} onChange={e => updateProfile('education', e.target.value)} placeholder="e.g. MCS, BSc Computer Science" required /></div>
      <div className="mb-3"><label className="form-label" htmlFor="profileExperience">Experience level</label><select id="profileExperience" className="form-select" value={profile.experience} onChange={e => updateProfile('experience', e.target.value)}><option>Fresher</option><option>Internship experience</option><option>0–2 years</option><option>2–5 years</option><option>5+ years</option></select></div>
      <div className="mb-3"><label className="form-label" htmlFor="profileSkills">Technical skills *</label><textarea id="profileSkills" className="form-control" rows="4" value={profile.skills} onChange={e => updateProfile('skills', e.target.value)} placeholder="Java, SQL, React, HTML, CSS" required /><div className="form-text">Example: Java, SQL, React, HTML, CSS</div></div>
      <div className="mb-3"><label className="form-label" htmlFor="profileTargetRole">Target job role</label><select id="profileTargetRole" className="form-select" value={profile.targetRole} onChange={e => updateProfile('targetRole', e.target.value)}>{roles.map(role => <option key={role}>{role}</option>)}</select></div>
      <ErrorMessage message={error} />
      <button className="btn btn-primary btn-lg w-100 mt-2" type="submit">Generate career recommendations <i className="bi bi-arrow-right ms-2" /></button>
      <p className="small muted mt-3 mb-0">Manual mode generates career matches and a skill-gap report. It does not generate a PDF resume score or AI-extracted summary.</p>
    </form>}
    <p className="small muted text-center mt-3">AI-generated suggestions and baseline career matches are guidance only. Review them for accuracy.</p>
  </section>;
}
