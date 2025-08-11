'use client';

import { useState, useEffect } from 'react';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default function DescriptionTab({ html }) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    const blocksFromHTML = convertFromHTML(html || '');
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(contentState));
  }, [html]);

  return (
    <div className="border rounded p-3 bg-white" style={{ minHeight: '200px' }}>
      <Editor
        editorState={editorState}
        toolbarHidden
        readOnly
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
      />
    </div>
  );
}
