import React, { useMemo, useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { createEditor, Node, Range } from 'slate'
import { Slate, Editable, withReact, useSelected, useSlate } from 'slate-react'
import { withHistory } from 'slate-history'

import './styles.css'

const Element = (props): JSX.Element => {
  const { children } = props
  const selected = useSelected()
  const editor = useSlate()
  const selection = editor.selection
  let isSelectionCollapsed = true
  if (selection !== null)
    isSelectionCollapsed = Range.isCollapsed(editor.selection)
  const isEmpty =
    children.props.node.children[0].text === '' &&
    children.props.node.children.length === 1

  return (
    <p
      {...props}
      className={
        selected && isSelectionCollapsed && isEmpty
          ? 'selected-empty-element'
          : ''
      }
    >
      {children}
    </p>
  )
}

const App = (): JSX.Element => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const [value, setValue] = useState<Node[]>([
    {
      children: [
        {
          text: 'Create a newline to see placeholder',
          marks: []
        }
      ]
    }
  ])

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable
        placeholder="Enter some plain text..."
        style={{
          padding: '10px',
          border: '1px solid #999'
        }}
        renderElement={renderElement}
      />
    </Slate>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
