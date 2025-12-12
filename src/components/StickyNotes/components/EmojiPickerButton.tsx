import React from 'react'
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react'
import type { EmojiClickData } from 'emoji-picker-react'
import { Smile } from 'lucide-react'

interface EmojiPickerButtonProps {
  onEmojiClick: (emojiData: EmojiClickData) => void
  isOpen: boolean
  onToggle: () => void
}

export const EmojiPickerButton: React.FC<EmojiPickerButtonProps> = ({
  onEmojiClick,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-1 hover:bg-black/5 rounded-full transition-colors"
        title="Adicionar emoji"
      >
        <Smile size={20} color="#343A40" />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 z-50 shadow-xl rounded-lg">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            searchPlaceHolder="Buscar"
            reactionsDefaultOpen={true}
            width={300}
            height={400}
            emojiStyle={EmojiStyle.NATIVE}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </div>
  )
}
