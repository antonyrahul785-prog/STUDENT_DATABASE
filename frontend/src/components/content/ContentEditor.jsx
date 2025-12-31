import React, { useState, useRef, useEffect } from 'react';
import { 
  Save, Upload, X, Bold, 
  Italic, List, Link, Image as ImageIcon,
  Heading, Code, Eye
} from 'lucide-react';

const ContentEditor = ({
  content,
  onSave,
  onCancel,
  mode = 'create', // 'create' or 'edit'
  categories = [],
  courses = [],
  batches = []
}) => {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    description: content?.description || '',
    content: content?.content || '',
    type: content?.type || 'document',
    category: content?.category || '',
    tags: content?.tags || [],
    accessLevel: content?.accessLevel || 'public',
    course: content?.course || '',
    batch: content?.batch || '',
  });

  const [uploading, setUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (e) => {
    setFormData(prev => ({ ...prev, content: e.target.value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fileType = file.type;
      const fileSize = file.size;
      const fileName = file.name;
      
      // Update form data with file info
      setFormData(prev => ({
        ...prev,
        fileType,
        fileSize,
        fileName,
        type: getContentTypeFromFile(fileType),
      }));
      
      // Read file for preview if it's a text file
      if (fileType.startsWith('text/') || fileType === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({ ...prev, content: e.target.result }));
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const getContentTypeFromFile = (fileType) => {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType.startsWith('audio/')) return 'audio';
    if (fileType.includes('pdf')) return 'document';
    if (fileType.includes('presentation')) return 'presentation';
    return 'document';
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      handleAddTag();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const formatToolbar = (command) => {
    const textarea = document.getElementById('content-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let newText = '';

    switch (command) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          newText = `[${selectedText}](${url})`;
        }
        break;
      case 'image':
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          newText = `![${selectedText}](${imageUrl})`;
        }
        break;
      case 'heading':
        newText = `# ${selectedText}`;
        break;
      case 'list':
        newText = `- ${selectedText}`;
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        break;
      default:
        return;
    }

    const newContent = 
      textarea.value.substring(0, start) + 
      newText + 
      textarea.value.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + newText.length;
      textarea.selectionEnd = start + newText.length;
    }, 0);
  };

  const renderMarkdownPreview = () => {
    // Simple markdown parser (you might want to use a library like marked)
    const text = formData.content;
    
    // Convert markdown to HTML
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');

    return { __html: html };
  };

  return (
    <div className="content-editor">
      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-header">
          <h2>{mode === 'create' ? 'Create New Content' : 'Edit Content'}</h2>
          <div className="header-actions">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="btn btn-secondary"
            >
              <Eye size={16} />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              <X size={16} />
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              Save Content
            </button>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter content title"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select type</option>
              <option value="document">Document</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="presentation">Presentation</option>
              <option value="audio">Audio</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Access Level</label>
            <select
              name="accessLevel"
              value={formData.accessLevel}
              onChange={handleChange}
              className="form-select"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>

          <div className="form-group col-span-2">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows="2"
              placeholder="Brief description of the content"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Course (Optional)</label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Batch (Optional)</label>
            <select
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select batch</option>
              {batches
                .filter(batch => !formData.course || batch.course === formData.course)
                .map(batch => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* File Upload */}
        <div className="file-upload-section">
          <label className="form-label">Upload File</label>
          <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
            <Upload size={32} />
            <p>Click to upload or drag and drop</p>
            <p className="upload-hint">Supports documents, images, videos, and presentations</p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mp3,.ppt,.pptx"
            />
          </div>
          {uploading && (
            <div className="uploading-status">
              <div className="spinner-small"></div>
              Uploading...
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="tags-section">
          <label className="form-label">Tags</label>
          <div className="tags-input">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              className="tag-input"
              placeholder="Add a tag and press Enter"
            />
            <button type="button" onClick={handleAddTag} className="add-tag-btn">
              Add
            </button>
          </div>
          <div className="tags-list">
            {formData.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="remove-tag"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Content Editor */}
        <div className="content-section">
          <label className="form-label">Content *</label>
          
          {previewMode ? (
            <div className="preview-container">
              <div className="preview-content" dangerouslySetInnerHTML={renderMarkdownPreview()} />
            </div>
          ) : (
            <>
              <div className="editor-toolbar">
                <button type="button" onClick={() => formatToolbar('bold')} className="toolbar-btn">
                  <Bold size={16} />
                </button>
                <button type="button" onClick={() => formatToolbar('italic')} className="toolbar-btn">
                  <Italic size={16} />
                </button>
                <button type="button" onClick={() => formatToolbar('heading')} className="toolbar-btn">
                  <Heading size={16} />
                </button>
                <button type="button" onClick={() => formatToolbar('list')} className="toolbar-btn">
                  <List size={16} />
                </button>
                <button type="button" onClick={() => formatToolbar('link')} className="toolbar-btn">
                  <Link size={16} />
                </button>
                <button type="button" onClick={() => formatToolbar('image')} className="toolbar-btn">
                  <ImageIcon size={16} />
                </button>
                <button type="button" onClick={() => formatToolbar('code')} className="toolbar-btn">
                  <Code size={16} />
                </button>
              </div>
              
              <textarea
                id="content-editor"
                value={formData.content}
                onChange={handleContentChange}
                className="content-textarea"
                rows="10"
                placeholder="Enter your content here... (Supports Markdown)"
                required
              />
              
              <div className="editor-help">
                <p><strong>Markdown Tips:</strong></p>
                <ul>
                  <li><code>**bold**</code> for <strong>bold text</strong></li>
                  <li><code>*italic*</code> for <em>italic text</em></li>
                  <li><code># Heading</code> for headings</li>
                  <li><code>- item</code> for bullet points</li>
                  <li><code>[link](url)</code> for hyperlinks</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContentEditor;