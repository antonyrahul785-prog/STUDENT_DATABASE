import React, { useState } from 'react';
import { 
  BookOpen, ChevronDown, ChevronRight, 
  Clock, Download, Printer 
} from 'lucide-react';

const SyllabusView = ({ syllabus = [], courseName, onPrint, onDownload }) => {
  const [expandedModules, setExpandedModules] = useState({});

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const downloadSyllabus = () => {
    // Generate PDF or download logic
    onDownload?.(syllabus);
  };

  const printSyllabus = () => {
    onPrint?.(syllabus);
  };

  const calculateTotalHours = () => {
    return syllabus.reduce((total, module) => {
      return total + module.topics.reduce((moduleTotal, topic) => {
        return moduleTotal + (topic.duration || 0);
      }, 0);
    }, 0);
  };

  return (
    <div className="syllabus-view">
      <div className="syllabus-header">
        <div className="header-content">
          <h2 className="course-title">{courseName}</h2>
          <h3 className="syllabus-title">Course Syllabus</h3>
        </div>
        
        <div className="header-actions">
          <button onClick={downloadSyllabus} className="btn btn-secondary">
            <Download size={16} />
            Download
          </button>
          <button onClick={printSyllabus} className="btn btn-secondary">
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      <div className="syllabus-summary">
        <div className="summary-item">
          <BookOpen size={20} />
          <div>
            <span className="summary-label">Total Modules</span>
            <span className="summary-value">{syllabus.length}</span>
          </div>
        </div>
        
        <div className="summary-item">
          <Clock size={20} />
          <div>
            <span className="summary-label">Total Duration</span>
            <span className="summary-value">{calculateTotalHours()} hours</span>
          </div>
        </div>
      </div>

      <div className="modules-list">
        {syllabus.length === 0 ? (
          <div className="no-syllabus">
            <BookOpen size={48} />
            <p>No syllabus available for this course</p>
          </div>
        ) : (
          syllabus.map((module, moduleIndex) => {
            const isExpanded = expandedModules[module.id] || false;
            const moduleDuration = module.topics.reduce((total, topic) => total + (topic.duration || 0), 0);
            
            return (
              <div key={module.id} className="module-card">
                <div 
                  className="module-header"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="module-title">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <h4>
                      Module {moduleIndex + 1}: {module.title}
                      <span className="module-hours">({moduleDuration} hours)</span>
                    </h4>
                  </div>
                  <div className="module-meta">
                    <span className="module-topics">{module.topics.length} topics</span>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="module-content">
                    {module.description && (
                      <p className="module-description">{module.description}</p>
                    )}
                    
                    <div className="topics-list">
                      {module.topics.map((topic, topicIndex) => (
                        <div key={topic.id} className="topic-item">
                          <div className="topic-header">
                            <span className="topic-number">
                              {moduleIndex + 1}.{topicIndex + 1}
                            </span>
                            <h5 className="topic-title">{topic.title}</h5>
                            {topic.duration && (
                              <span className="topic-duration">
                                <Clock size={12} />
                                {topic.duration}h
                              </span>
                            )}
                          </div>
                          
                          {topic.description && (
                            <p className="topic-description">{topic.description}</p>
                          )}
                          
                          {topic.objectives && topic.objectives.length > 0 && (
                            <div className="topic-objectives">
                              <h6>Learning Objectives:</h6>
                              <ul>
                                {topic.objectives.map((objective, objIndex) => (
                                  <li key={objIndex}>{objective}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {topic.materials && topic.materials.length > 0 && (
                            <div className="topic-materials">
                              <h6>Learning Materials:</h6>
                              <ul>
                                {topic.materials.map((material, matIndex) => (
                                  <li key={matIndex}>{material}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="syllabus-footer">
        <div className="prerequisites">
          <h4>Prerequisites</h4>
          <ul>
            <li>Basic computer knowledge</li>
            <li>Internet connectivity</li>
            <li>Dedicated study time</li>
          </ul>
        </div>
        
        <div className="assessment">
          <h4>Assessment</h4>
          <ul>
            <li>Module Quizzes: 30%</li>
            <li>Assignments: 30%</li>
            <li>Final Project: 40%</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SyllabusView;