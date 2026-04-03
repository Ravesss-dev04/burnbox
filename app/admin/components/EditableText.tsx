'use client'
import React from 'react'

interface EditableTextProps {
  text: string
  onChange: (newValue: string) => void
  editable?: boolean
  className?: string
}

const EditableText: React.FC<EditableTextProps> = ({ text, onChange, editable = false, className }) => {
  if (!editable) return <span className={className}>{text}</span>

  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.target.textContent || '')}
      className={`${className} cursor-text outline-none`}
    >
      {text}
    </span>
  )
}

export default EditableText
