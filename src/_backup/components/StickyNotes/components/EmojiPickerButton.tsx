import React from 'react'
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react'
import type { EmojiClickData } from 'emoji-picker-react'
import { Smile } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

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
    <Popover open={isOpen} onOpenChange={() => onToggle()}>
      <PopoverTrigger asChild>
        <button
          className="p-1 hover:bg-black/5 rounded-full transition-colors outline-none"
          title="Adicionar emoji"
        >
          <Smile size={20} color="#343A40" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 border-none shadow-none bg-transparent z-50"
        side="top"
        align="start"
        sideOffset={5}
      >
        <EmojiPicker
          onEmojiClick={onEmojiClick}
          searchPlaceHolder="Buscar"
          reactionsDefaultOpen={true}
          width={300}
          height={400}
          emojiStyle={EmojiStyle.NATIVE}
          previewConfig={{ showPreview: false }}
        />
      </PopoverContent>
    </Popover>
  )
}
