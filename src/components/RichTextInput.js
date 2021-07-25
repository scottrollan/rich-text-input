import React from 'react';
import { EditorState, Editor, RichUtils } from 'draft-js';
// import Editor from 'draft-js-plugins-editor';
import addLinkPlugin from './plugins/addLinkPlugin';
import './RichTextInput.css';

class RichTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    this.plugins = [addLinkPlugin];
  }
  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onAddLink = () => {
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const link = window.prompt('Paste the link -');
    if (!link) {
      this.onChange(RichUtils.toggleLink(editorState, selection, null));
      return 'handled';
    }
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity('LINK', 'MUTABLE', {
      url: link,
    });
    const newEditorState = EditorState.push(
      editorState,
      contentWithEntity,
      'create-entity'
    );
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey));
    return 'handled';
  };

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  onUnderlineClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE')
    );
  };

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  };

  onItalicClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC')
    );
  };

  onStrikeThroughClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'STRIKETHROUGH')
    );
  };

  render() {
    return (
      <div className="editorContainer">
        <button
          className="inline styleButton"
          id="underline"
          onClick={this.onUnderlineClick}
        >
          U
        </button>

        <button
          className="inline styleButton"
          id="bold"
          onClick={this.onBoldClick}
        >
          <strong>B</strong>
        </button>

        <button
          className="inline styleButton"
          id="italic"
          onClick={this.onItalicClick}
        >
          I
        </button>
        <button
          className="inline styleButton strikethrough"
          onClick={this.onStrikeThroughClick}
        >
          abc
        </button>

        <button id="link_url" onClick={this.onAddLink} className="add-link">
          <i className="fas fa-link"></i>
        </button>

        <div className="editors">
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            plugins={this.plugins}
          />
        </div>
      </div>
    );
  }
}

export default RichTextInput;
