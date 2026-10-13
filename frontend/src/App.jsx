import { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ResumeUpload from './pages/ResumeUpload.jsx';
import AnalysisResults from './pages/AnalysisResults.jsx';
import CareerRecommendations from './pages/CareerRecommendations.jsx';
import SkillGapAnalysis from './pages/SkillGapAnalysis.jsx';
function NotFound(){return <section className="page-wrap empty-state"><h1>Page not found</h1><NavLink to="/" className="btn btn-primary">Back home</NavLink></section>}
export default function App(){const [results,setResults]=useState(null);return <><Header/><main><Routes><Route path="/" element={<Dashboard/>}/><Route path="/upload" element={<ResumeUpload onResults={setResults}/>}/><Route path="/results" element={<AnalysisResults results={results}/>}/><Route path="/careers" element={<CareerRecommendations results={results}/>}/><Route path="/skills" element={<SkillGapAnalysis results={results}/>}/><Route path="*" element={<NotFound/>}/></Routes></main><footer className="footer"><span>Smart Resume Analyzer</span><span>Career insights for guidance—not hiring decisions.</span></footer></>}
